import * as cheerio from 'cheerio'
import prisma from '../../db'
import redisSettings from '../../settings/redis'
import { Worker } from 'bullmq'
import { Subject } from '../subject.entity'

const getJupiterDefaultSubjects = async (jupiterCode: String, jupiterCodeHab: String) => {
  try {
    const subjectsJupiterLink = `https://uspdigital.usp.br/jupiterweb/listarGradeCurricular?codcg=86&codcur=${jupiterCode}&codhab=${jupiterCodeHab}&tipo=N`

    const myHeaders = new Headers()
    myHeaders.append('Content-Type', 'text/plain; charset=ISO-8859-1')

    const response = await fetch(subjectsJupiterLink, { headers: myHeaders })
    const buffer = await response.arrayBuffer()
    const decoder = new TextDecoder('iso-8859-1')
    const html = decoder.decode(buffer)

    const $ = cheerio.load(html, { decodeEntities: false })
    const tbody = $('table tbody table tbody')[11]
    const trs = $('tr')

    const periods: string[][] = []

    let electiveStarted = false
    let started = false

    trs.get().forEach((tr, index) => {
      const isTheFirstTr = index === 0

      if (!started) {
        started = tr.attribs.bgcolor === '#658CCF'
      }

      if (electiveStarted || isTheFirstTr || !started) return

      const isNewPeriod = tr.attribs.bgcolor === '#CCCCCC'

      if (isNewPeriod) {
        periods.push([])
        return
      }

      const isSubject = tr.attribs.bgcolor === '#FFFFFF' && $(tr).find('a').get().length

      if (isSubject) {
        const tds = tr.children
        const code = $(tds[1]).text().trim()

        periods[periods.length - 1].push(code)
      }

      electiveStarted = $(tr).text().trim().includes('Optativas')
    })

    return periods
  } catch (error) {
    throw error
  }
}

const getSubjectIdByCode = (code: string, subjects: Subject[]): number => {
  const subject = subjects.find((subject) => subject.code === code)
  return subject!.id!
}

const syncDefaultSubjectsJupiterWorker = () => {
  new Worker(
    'SyncDefaultSubjectsJupiter',
    async (job) => {
      const courseId = job.data.courseId

      try {
        const course = await prisma.course.findUnique({ where: { id: courseId } })

        if (!course) throw new Error('course not found')
        if (!course.jupiterCode || !course.jupiterCodeHab) throw new Error('institute has no jupiter code')

        console.log(`INFO: Syncing default subjects from jupiter web of course ${course.name}`)

        const jupiterDefaultSubjectCodesByPeriod = await getJupiterDefaultSubjects(
          course.jupiterCode,
          course.jupiterCodeHab,
        )

        console.log(`INFO: ${jupiterDefaultSubjectCodesByPeriod.length} periods found`)

        const jupiterSubjects = await prisma.subject.findMany({
          where: { code: { in: jupiterDefaultSubjectCodesByPeriod.flat() } },
        })
        const isMissingSubjects = jupiterSubjects.length !== jupiterDefaultSubjectCodesByPeriod.flat().length

        if (isMissingSubjects) {
          const subjectsMissed = jupiterDefaultSubjectCodesByPeriod
            .flat()
            .filter((code) => !jupiterSubjects.find((subject) => subject.code === code))
            .join(', ')
          throw new Error(`missing subjects - ${subjectsMissed}`)
        }

        await prisma.$transaction([
          prisma.default_subject.deleteMany({ where: { courseId: courseId } }),
          ...jupiterDefaultSubjectCodesByPeriod.map((period, index) => {
            return prisma.default_subject.createMany({
              data: period.map((code) => {
                return {
                  period: index + 1,
                  courseId: courseId,
                  subjectId: getSubjectIdByCode(code, jupiterSubjects),
                }
              }),
            })
          }),
        ])

        console.log(`INFO: ${jupiterSubjects.length} default subjects synced from jupiter web - ${course.name}\n`)
      } catch (error) {
        console.log(`ERROR: Syncing default subjects from jupiter web of course ${courseId} failed\n`)
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

export default syncDefaultSubjectsJupiterWorker
