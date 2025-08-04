import puppeteer from 'puppeteer-extra'
import prisma from '../../db'
import { user } from '@prisma/client'

const weekDays = ['seg', 'ter', 'qua', 'qui', 'sex', 'sab', 'dom']
const loginJupiterLink = `https://uspdigital.usp.br/jupiterweb/webLogin.jsp`
const userInfoJupiterLink = `https://uspdigital.usp.br/jupiterweb/uspDadosPessoaisMostrar?codmnu=4543`

const USP_INSTITUTE_ID = 1

// Yes, this code is totally a mess
// Yes, I know SOLID
const getScrapJupiter = async (nUsp: string, password: string, retry: number = 0): Promise<user> => {
  let browser

  try {
    if (retry === 10) {
      throw new Error('Max retries reached')
    }

    browser = await puppeteer.launch({ args: ['--no-sandbox'], headless: true })
    const page = await browser.newPage()
    await page.setUserAgent(
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/69.0.3497.100 Safari/537.36',
    )

    console.log('Test - Go to login page')
    await page.goto(loginJupiterLink, { timeout: 15000 })

    console.log('Test - N USP')
    await page.waitForSelector("input[name='codpes']")
    await page.focus('input[name="codpes"]')
    await page.keyboard.type(nUsp)

    console.log('Test - Senha')
    await page.focus('input[name="senusu"]')
    await page.keyboard.type(password)
    await page.keyboard.press('Enter')


    await page.waitForSelector("a[href='gradeHoraria?codmnu=4759']", {
      timeout: 5000,
    })
    console.log('Test - Grade Horária')
    await page.click("a[href='gradeHoraria?codmnu=4759']")
    console.log('Test - Grade Horária - 2')

    await page.waitForSelector('select')
    await page.waitForSelector('option:nth-child(2)')
    console.log('Test - Select')

    const options = await page.evaluate(() =>
      // @ts-ignore
      Array.from(document.querySelectorAll('option')).map((element: any) => element.value),
    )

    options.sort()
    await page.select(`select`, options[options.length - 1])

    console.log('Test - Buscar')

    await page.click('input[type="button"][value="Buscar"]')

    await page.waitForSelector("tr[id='1']")

    console.log('Test - Curso')

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

    let institute = await prisma.institute.findFirst({
      where: { name: jupiterWebInstitute, universityId: USP_INSTITUTE_ID },
    })
    let course = await prisma.course.findFirst({ where: { name: jupiterWebCourse, universityId: USP_INSTITUTE_ID } })

    if (!course) {
      course = await prisma.course.create({ data: { name: jupiterWebCourse, universityId: USP_INSTITUTE_ID } })
    }

    if (!institute) {
      institute = await prisma.institute.create({ data: { name: jupiterWebInstitute, universityId: USP_INSTITUTE_ID } })
    }

    const courseId = course!.id
    const instituteId = institute!.id

    let firstTime = true;
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

          // click on the subject
          element = await page.$(`span.${subject}`)
          await element?.click();

          // wait for the overlay to disappear
          await page.waitForSelector('.blockOverlay', { hidden: true })

          // treating some bug that makes the first click not work
          if (firstTime) {
            await element?.click();
            await page.waitForSelector('.blockOverlay', { hidden: true })
            firstTime = false
          }

          // click on the "oferecimento" tab
          await page.click('a[href="#div_oferecimento"]');
          await page.waitForSelector('.blockOverlay', { hidden: true })

          // get the observations and print them
          // we could use this to get any detail we want about the subject
          let observationsElement = await page.$('div[class="adicionado"] > table > tbody > tr > td[class="obstur"]')
          let observationsText = await page.evaluate((el: any) => el?.textContent?.replace(/\n/g, ' '), observationsElement);
          if (observationsText) {
            console.log(subject, '- observações:', observationsText);
          }

          // store data
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
      page.$eval(`span[class="${subjectCode}"]`, (element: any) => element.click())
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
          universityId: USP_INSTITUTE_ID,
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

    const subjectClassesIds: number[] = []

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
          universityId: USP_INSTITUTE_ID,
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

    // For edge cases (we can't find the user email), we'll use "Estudante USP" as name
    // This edge case occur when the user is children of an employee
    const name = all77WidthFontTexts[1] || 'Estudante USP'
    const emails = allFontsTexts.filter((text: string) => text!.includes('@'))
    // For edge cases (we can't find the user email), we'll use the nusp as email
    // This edge case occur when the user is children of an employee
    const email = emails.find((email: string) => email!.includes('usp.br')) || emails[0] || nUsp

    await browser.close()

    let user = await prisma.user.findFirst({ where: { email } })

    if (user) {
      const userSubjectClasses = await prisma.user_subject.findMany({
        where: { userId: user.id },
      })
      const userSubjectClassesIds = userSubjectClasses.map((userSubjectClass) => userSubjectClass.subjectClassId)
      const userSubjectClassesToRemove = userSubjectClassesIds.filter(
        (userSubjectClassId) => !subjectClassesIds.includes(userSubjectClassId),
      )

      if (userSubjectClassesToRemove.length) {
        await prisma.user_subject.updateMany({
          where: {
            userId: user.id,
            subjectClassId: {
              in: userSubjectClassesToRemove,
            },
          },
          data: {
            deletedAt: new Date(),
          },
        })
      }

      if (name != user.name) {
        await prisma.user.update({
          where: {
            id: user.id,
          },
          data: {
            name: name
          },
        })
      }
    }

    if (!user) {
      user = await prisma.user.create({
        data: {
          email,
          name,
          courseId,
          instituteId,
          universityId: USP_INSTITUTE_ID,
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
  } catch (error: any) {
    if (browser) await browser.close()

    if (error.message.includes('Failed to launch the browser process!')) {
      console.log('[ERROR] Error Scraping Jupiter: Memory Error - Retry ')
      await new Promise((resolve) => setTimeout(resolve, 1500))
      return getScrapJupiter(nUsp, password, retry + 1)
    }

    throw error
  }
}

export { getScrapJupiter }
