import puppeteer from 'puppeteer-extra'
import prisma from '../../db'
import { user } from '@prisma/client'

const weekDays = ['seg', 'ter', 'qua', 'qui', 'sex', 'sab', 'dom']
const loginJupiterLink = `https://uspdigital.usp.br/jupiterweb/webLogin.jsp`
const userInfoJupiterLink = `https://uspdigital.usp.br/jupiterweb/uspDadosPessoaisMostrar?codmnu=4543`

// Yes, this code is totally a mess
// Yes, I know SOLID
const getScrapJupiter = async (nUsp: string, password: string): Promise<user> => {
  const browser = await puppeteer.launch({ args: ['--no-sandbox'], headless: true })

  try {
    const page = await browser.newPage()
    await page.setUserAgent(
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/69.0.3497.100 Safari/537.36',
    )
    await page.goto(loginJupiterLink)

    await page.waitForSelector("input[name='codpes']")
    await page.focus('input[name="codpes"]')
    await page.keyboard.type(nUsp)

    await page.focus('input[name="senusu"]')
    await page.keyboard.type(password)
    await page.keyboard.press('Enter')

    await page.waitForSelector("a[href='gradeHoraria?codmnu=4759']", {
      timeout: 5000,
    })
    await page.click("a[href='gradeHoraria?codmnu=4759']")

    await page.waitForSelector("select[name='codpgm']")
    await page.waitForSelector("select[name='codpgm'] option[value='1']")

    const options = await page.evaluate(() =>
      // @ts-ignore
      Array.from(document.querySelectorAll("select[name='codpgm'] option")).map((element: any) => element.value),
    )

    await page.select(`select[name='codpgm']`, options[options.length - 1])

    await page.click('#buscar')

    await page.waitForSelector("tr[id='1']")

    const courseElement = await page.$('#curso')
    const brokeCourseText = (await page.evaluate((el: any) => el?.textContent, courseElement))?.split(' - ')

    const instituteElement = await page.$('#unidade')
    const jupiterWebInstitute = (await page.evaluate((el: any) => el?.textContent, instituteElement))?.split(' - ')[1]
    let jupiterWebCourse = ''

    for (const text of brokeCourseText!) {
      if (isNaN(text)) {
        jupiterWebCourse = text
        break
      }
    }

    let institute = await prisma.institute.findFirst({ where: { name: jupiterWebInstitute } })
    let course = await prisma.course.findFirst({ where: { name: jupiterWebCourse } })

    if (!course) {
      course = await prisma.course.create({ data: { name: jupiterWebCourse } })
    }

    if (!institute) {
      institute = await prisma.institute.create({ data: { name: jupiterWebInstitute } })
    }

    const courseId = course!.id
    const instituteId = institute!.id

    let rowIndex = 1
    const hash: any = {}

    while (!!(await page.$(`tr[id='${rowIndex}']`))) {
      let element = await page.$(`tr[id='${rowIndex}'] > td:nth-child(1)`)
      let startHour = await page.evaluate((el: any) => el?.textContent, element)

      element = await page.$(`tr[id='${rowIndex}'] > td:nth-child(2)`)
      let lastHour = await page.evaluate((el: any) => el?.textContent, element)

      for (let tdIndex = 3; tdIndex <= 8; tdIndex++) {
        element = await page.$(`tr[id='${rowIndex}'] > td:nth-child(${tdIndex})`)
        let subject = await page.evaluate((el: any) => el?.textContent, element)

        if (subject) {
          subject = subject.split('-')[0]
          if (!hash[subject]) {
            hash[subject] = [
              {
                day: weekDays[tdIndex - 3],
                start: startHour,
                end: lastHour,
              },
            ]
          } else {
            hash[subject].push({
              day: weekDays[tdIndex - 3],
              start: startHour,
              end: lastHour,
            })
          }
        }
      }

      rowIndex++
    }

    const newSubjectsInfo: any = []

    const subjectsAlreadyRegistered = await prisma.subject.findMany({
      where: {
        code: {
          in: Object.keys(hash),
        },
      },
    })

    const notRegisteredSubjectCodes = Object.keys(hash).filter(
      (subjectCode) => !subjectsAlreadyRegistered.find((subject) => subject.code === subjectCode),
    )

    for (let subjectCode of notRegisteredSubjectCodes) {
      page.$eval(`.${subjectCode}`, (element: any) => element.click())
      //await page.waitForSelector(".conteudo[style='display: block;']")
      await page.waitForSelector(`xpath///*[@class="coddis" and text()="${subjectCode}"]`)
      const subjectName = await page.evaluate(
        // @ts-ignore
        () => document.querySelector('.nomdis')?.textContent,
      )
      const description = await page.evaluate(
        // @ts-ignore
        () => document.querySelector('#div_disciplina')?.innerHTML,
      )
      newSubjectsInfo.push({ subjectCode, subjectName, description })
    }

    for (const newSubjectInfo of newSubjectsInfo) {
      const newSubject = await prisma.subject.create({
        data: {
          code: newSubjectInfo.subjectCode,
          name: newSubjectInfo.subjectName,
          content: newSubjectInfo.description,
        },
      })
      subjectsAlreadyRegistered.push(newSubject)
    }

    const subjectClasses = Object.keys(hash).map((subjectCode: string) => {
      const subject = subjectsAlreadyRegistered.find((subject) => subject.code === subjectCode)
      return {
        subjectId: subject!.id,
        availableDays: hash[subjectCode],
      }
    })

    const subjectClassesIds = []

    for (const subjectClass of subjectClasses) {
      const dbSubjectClass = await prisma.subject_class.findFirst({
        where: {
          subjectId: subjectClass.subjectId,
          availableDays: { equals: subjectClass.availableDays },
        },
      })

      if (dbSubjectClass) {
        subjectClassesIds.push(dbSubjectClass.id)
        continue
      }

      const newSubjectClass = await prisma.subject_class.create({
        data: {
          subjectId: subjectClass.subjectId,
          availableDays: subjectClass.availableDays,
          year: new Date().getFullYear(),
          semester: 1 + Math.floor(new Date().getMonth() / 6),
        },
      })

      subjectClassesIds.push(newSubjectClass.id)
    }

    await page.goto(userInfoJupiterLink, { waitUntil: 'load' })

    const allFontsTexts = await page.evaluate(() =>
      // @ts-ignore
      Array.from(document.querySelectorAll('font')).map((element: any) => element.textContent),
    )

    const all77WidthFontTexts = await page.evaluate(() =>
      // @ts-ignore
      Array.from(document.querySelectorAll("td[width='77%'] font")).map((element: any) => element.textContent),
    )

    const name = all77WidthFontTexts[1]
    const emails = allFontsTexts.filter((text: string) => text!.includes('@'))
    const email = emails.find((email: string) => email!.includes('usp.br')) || emails[0]

    await browser.close()

    let user = await prisma.user.findFirst({ where: { email } })

    if (!user) {
      user = await prisma.user.create({
        data: {
          email,
          name,
          courseId,
          instituteId,
        },
      })
    }

    for (const subjectClassId of subjectClassesIds) {
      const userSubject = await prisma.user_subject.findFirst({
        where: {
          userId: user!.id,
          subjectClassId,
        },
      })

      if (!userSubject) {
        await prisma.user_subject.create({
          data: {
            userId: user!.id,
            subjectClassId,
          },
        })
      }
    }

    return user
  } catch (error) {
    await browser.close()
    throw error
  }
}

export { getScrapJupiter }
