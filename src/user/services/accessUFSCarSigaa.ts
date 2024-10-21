import prisma from '../../db'

const weekDays = {
  SEGUNDA: 'seg',
  TERCA: 'ter',
  QUARTA: 'qua',
  QUINTA: 'qui',
  SEXTA: 'sex',
  SABADO: 'sab',
  DOMINGO: 'dom',
}
const UFSCAR_INSTITUTE_ID = 2

interface ResponseUfscar {
  email: string
  nome: string
  vinculosInternos: {
    descricaoRelacionamento?: string
    fimVinculo?: string
    unidadeOrganizacional?: {
      text: string
      id: number
    }
  }[]
}

interface ResponseUfscarSubject {
  atividade: string
  ano: number
  periodo: number
  horarios: {
    dia: string
    inicio: string
    fim: string
    sala: string
  }[]
}

function toTitleCase(str: string) {
  return str.replace(/\w\S*/g, (text: string) => text.charAt(0).toUpperCase() + text.substring(1).toLowerCase())
}

const generateSubjectData = (subject: ResponseUfscarSubject) => {
  return {
    subjectCode: toTitleCase(subject.atividade),
    subjectName: toTitleCase(subject.atividade),
    year: subject.ano,
    semester: subject.periodo,
    time: subject.horarios
      .map((time) => {
        // @ts-ignore
        const day = weekDays[time.dia]
        return {
          day,
          start: time.inicio.slice(0, 5),
          end: time.fim.slice(0, 5),
          classRoom: time.sala,
        }
      })
      .sort((a, b) => {
        if (a.day < b.day) {
          return -1
        }
        if (a.day > b.day) {
          return 1
        }
        return 0
      }),
  }
}

// Yes, this code is totally a mess
// Yes, I know SOLID
const accessUFSCarSigaa = async (sigaaCode: string, password: string) => {
  try {
    const call = await fetch(`https://sistemas.ufscar.br/sagui-api/core/perfil/${sigaaCode}/detalhes`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Basic ${Buffer.from(`${sigaaCode}:${password}`).toString('base64')}`,
      },
    })
    if (call.status !== 200) throw new Error('Invalid credentials')
    // @ts-ignore
    const response: ResponseUfscar = await call.json()

    let user = await prisma.user.findUnique({
      where: { email: response.email },
    })

    if (!user) {
      let courseName = ''
      let instituteName = ''

      for (const vinculo of response.vinculosInternos) {
        if (!vinculo.fimVinculo) {
          courseName = vinculo.descricaoRelacionamento!
          instituteName = vinculo.unidadeOrganizacional!.text
          break
        }
      }

      let course = await prisma.course.findFirst({ where: { name: courseName, universityId: UFSCAR_INSTITUTE_ID } })
      let institute = await prisma.institute.findFirst({
        where: { name: instituteName, universityId: UFSCAR_INSTITUTE_ID },
      })

      if (!course) {
        course = await prisma.course.create({
          data: {
            name: courseName,
            universityId: UFSCAR_INSTITUTE_ID,
          },
        })
      }

      if (!institute) {
        institute = await prisma.institute.create({
          data: {
            name: instituteName,
            universityId: UFSCAR_INSTITUTE_ID,
          },
        })
      }

      user = await prisma.user.create({
        data: {
          email: response.email,
          name: response.nome,
          courseId: course.id,
          instituteId: institute.id,
          universityId: UFSCAR_INSTITUTE_ID,
        },
      })
    }

    const subjectsCall = await fetch(`https://sistemas.ufscar.br/sagui-api/siga/deferimento`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Basic ${Buffer.from(`${sigaaCode}:${password}`).toString('base64')}`,
      },
    })
    if (subjectsCall.status !== 200) throw new Error('Invalid credentials')

    // @ts-ignore
    const subjectsResponse: ResponseUfscarSubject[] = (await subjectsCall.json()).data
    const hash: any = {}
    const semester = subjectsResponse[0].periodo
    const year = subjectsResponse[0].ano

    for (const subject of subjectsResponse) {
      const subjectCode = toTitleCase(subject.atividade)
      hash[subjectCode] = generateSubjectData(subject)
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
      newSubjectsInfo.push({ subjectCode, subjectName: hash[subjectCode].subjectName })
    }

    for (const newSubjectInfo of newSubjectsInfo) {
      const newSubject = await prisma.subject.create({
        data: {
          code: newSubjectInfo.subjectCode,
          name: newSubjectInfo.subjectName,
          universityId: UFSCAR_INSTITUTE_ID,
        },
      })
      subjectsAlreadyRegistered.push(newSubject)
    }

    const subjectClasses = Object.keys(hash).map((subjectCode: string) => {
      const subject = subjectsAlreadyRegistered.find((subject) => subject.code === subjectCode)
      return {
        subjectId: subject!.id,
        availableDays: hash[subjectCode].time,
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
          year: year,
          semester: semester,
          universityId: UFSCAR_INSTITUTE_ID,
        },
      })

      subjectClassesIds.push(newSubjectClass.id)
    }

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
    throw error
  }
}

export { accessUFSCarSigaa }
