import { Worker } from 'bullmq'
import prisma from '../../db'
import * as cheerio from 'cheerio'
import redisSettings from '../../settings/redis'

const weekdays = ['seg', 'ter', 'qua', 'qui', 'sex', 'sab', 'dom']

const getJupiterClasses = async (subjectCode: string) => {
  try {
    const subjectsJupiterLink = `https://uspdigital.usp.br/jupiterweb/obterTurma?sgldis=${subjectCode}`

    const myHeaders = new Headers()
    myHeaders.append('Content-Type', 'text/plain; charset=ISO-8859-1')

    const response = await fetch(subjectsJupiterLink, { headers: myHeaders })
    const buffer = await response.arrayBuffer()
    const decoder = new TextDecoder('iso-8859-1')
    const html = decoder.decode(buffer)

    const $ = cheerio.load(html, { decodeEntities: false })
    const isValid = $('p:contains("existe oferecimento para a sigla")')

    if (isValid.length) return []

    const classes: any[] = []

    const tbody = $('tbody')[8]
    const tbodies = $(tbody).find('tbody')

    const isRegularClass = $(tbodies.get()[1]).find('tr').eq(0).find('td').eq(0).text().includes('Horário')

    if (!isRegularClass) return []

    let index = -1

    tbodies.get().forEach((tbod) => {
      if ($(tbod).text().includes('Observações:') && index === -1) index = 0

      if (!index) {
        classes.push({
          details: $(tbod)
            .find('tr')
            .eq(4)
            .text()
            .replace(/\n/g, ' ')
            .trim()
            .replace(/\s\s+/g, ' ')
            .replace('Observações:', '')
            .trim(),
        })
        index = 1
      } else if (index === 1) {
        const availableDays: any[] = []

        $(tbod)
          .children('tr')
          .get()
          .forEach((tr, i) => {
            if (!i) return
            classes[classes.length - 1].professorName = $(tr).find('td').eq(3).text().trim()
            const day = $(tr).find('td').eq(0).text().trim()

            availableDays.push({
              day: day || availableDays[availableDays.length - 1].day,
              start: $(tr).find('td').eq(1).text().trim(),
              end: $(tr).find('td').eq(2).text().trim(),
            })
          })

        classes[classes.length - 1].availableDays = availableDays

        index = -1
      }
    })

    return classes
  } catch (error) {
    throw error
  }
}

const syncClassesJupiterBySubjectWorker = () => {
  new Worker(
    'SyncClassesJupiter',
    async (job) => {
      const subjectId = job.data.subjectId

      try {
        if (!subjectId) throw new Error('subjectId not found')

        const subject = await prisma.subject.findUnique({ where: { id: subjectId } })

        if (!subject) throw new Error('subject not found')
        if (!subject.code) throw new Error('subject has no code')

        console.log(`Syncing classes from jupiter web of subject ${subject.code} ${subject.name}`)

        const jupiterClasses = await getJupiterClasses(subject.code)

        await prisma.$transaction([
          prisma.subject_class.deleteMany({ where: { subjectId: subjectId } }),
          prisma.subject_class.createMany({
            data: jupiterClasses.map((jupiterClass) => {
              return {
                details: jupiterClass.details,
                professorName: jupiterClass.professorName,
                subjectId: subjectId,
                availableDays: jupiterClass.availableDays,
              }
            }),
          }),
        ])

        console.log(
          `${jupiterClasses.length} classes synced from jupiter web of subject ${subject.code} ${subject.name}`,
        )
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

export default syncClassesJupiterBySubjectWorker
