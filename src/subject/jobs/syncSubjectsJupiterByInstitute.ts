import * as cheerio from 'cheerio'
import prisma from '../../db'
import redisSettings from '../../settings/redis'
import { Worker } from 'bullmq'
import { Subject } from '../subject.entity'

const getJupiterDepartmentCodes = async (jupiterCode: String) => {
  const departmentCodesJupiterLink = `https://uspdigital.usp.br/jupiterweb/jupDepartamentoLista?codcg=${jupiterCode}&tipo=D`

  const response = await fetch(departmentCodesJupiterLink)
  const buffer = await response.arrayBuffer()
  const decoder = new TextDecoder('iso-8859-1')
  const html = decoder.decode(buffer)

  const $ = cheerio.load(html, { decodeEntities: false })
  const tbody = $('tbody')[3]
  const trs = $(tbody).children('tr')

  const departments = trs.get().map((tr) => {
    const tds = tr.children
    const code = $(tds[1]).text().trim()
    return code
  })

  departments.shift()

  return departments
}

const getJupiterSubjects = async (jupiterCode: String) => {
  let allSubjects: Subject[] = []

  try {
    const departmentCodes = await getJupiterDepartmentCodes(jupiterCode)

    for (let i = 0; i < departmentCodes.length; i++) {
      const departmentCode = departmentCodes[i]
      const subjectsJupiterLink = `https://uspdigital.usp.br/jupiterweb/jupDisciplinaLista?codcg=${jupiterCode}&pfxdisval=${departmentCode}&tipo=D`

      const response = await fetch(subjectsJupiterLink)
      const buffer = await response.arrayBuffer()
      const decoder = new TextDecoder('iso-8859-1')
      const html = decoder.decode(buffer)

      const $ = cheerio.load(html, { decodeEntities: false })
      const tbody = $('tbody')[1]
      const trs = $(tbody).children('tr')

      const subjects: Subject[] = trs.get().map((tr) => {
        const tds = tr.children
        const code = $(tds[1]).text().trim()
        const name = $(tds[3]).text().trim()

        return { code, name }
      })

      subjects.shift()

      allSubjects = allSubjects.concat(subjects)
    }

    return allSubjects
  } catch (error) {
    throw error
  }
}

const getSubjectsToSync = (subjectsFromInstitutes: Subject[], subjectsFromJupiter: Subject[], instituteId: number) => {
  const subjectsDidntSync = subjectsFromJupiter.filter(
    (subjectFromJupiter) =>
      !subjectsFromInstitutes.find((subjectFromInstitute) => subjectFromInstitute.code === subjectFromJupiter.code),
  )

  const subjectsToSync = subjectsDidntSync.map((subject) => {
    return {
      code: subject.code,
      name: subject.name,
      instituteId: instituteId,
    }
  })

  return subjectsToSync
}

const syncSubjectsJupiterWorker = () => {
  new Worker(
    'SyncSubjectsJupiter',
    async (job) => {
      const instituteId = job.data.instituteId

      try {
        const institute = await prisma.institute.findUnique({ where: { id: instituteId } })

        if (!institute) throw new Error('institute not found')
        if (!institute.jupiterCode) throw new Error('institute has no jupiter code')

        console.log(`Syncing subjects from jupiter web of institute - ${institute.name}`)

        const subjectsFromInstitute = await prisma.subject.findMany({ where: { instituteId: instituteId } })
        const subjectsFromJupiter = await getJupiterSubjects(institute.jupiterCode)

        const subjectsToSync = getSubjectsToSync(subjectsFromInstitute, subjectsFromJupiter, instituteId)

        await prisma.subject.createMany({ data: subjectsToSync })

        console.log(`${subjectsToSync.length} subjects synced from jupiter web - ${institute.name}`)
      } catch (error) {
        throw error
      }
    },
    {
      connection: {
        host: redisSettings.redisHost,
        port: redisSettings.redisPort,
      },
    },
  )
}

export default syncSubjectsJupiterWorker
