import { Request, Response } from 'express'
import prisma from '../../db'
import mixpanel from '../../utils/mixpanel'

const updateMeSubjects = async (req: Request, res: Response) => {
  // @ts-ignore
  const { user, body } = req
  const { subjectClassIds } = body

  if (!subjectClassIds)
    return res.status(400).send({ title: 'Disciplinas inválidas', message: 'Por favor, insira disciplinas válidas' })

  try {
    const subjectClasses = await prisma.subject_class.findMany({ where: { id: { in: subjectClassIds } } })

    if (subjectClasses.length !== subjectClassIds.length)
      return res.status(400).send({ title: 'Disciplinas inválidas', message: 'Por favor, insira disciplinas válidas' })

    const userSubjects = await prisma.user_subject.findMany({ where: { userId: user!.id } })

    const subjectsIds = subjectClasses.map((subjectClass) => subjectClass.subjectId)
    const userSubjectsIds = userSubjects.map((userSubject) => userSubject.subjectId)

    const subjectsClassRemoved = userSubjects.filter((userSubject) => !subjectsIds.includes(userSubject.subjectId))
    const subjectsClassRemovedIds = subjectsClassRemoved.map((subject) => subject.subjectId)

    const subjectClassesToCreate = subjectClasses.filter(
      (subjectClass) => !userSubjectsIds.includes(subjectClass.subjectId),
    )

    console.log(subjectClassesToCreate)
    console.log(subjectsClassRemovedIds)

    await prisma.$transaction([
      prisma.user_absence.deleteMany({ where: { userId: user!.id, subjectId: { in: subjectsClassRemovedIds } } }),
      prisma.activity.deleteMany({ where: { userId: user!.id, subjectId: { in: subjectsClassRemovedIds } } }),
      prisma.user_subject.deleteMany({ where: { userId: user!.id, subjectId: { in: subjectsClassRemovedIds } } }),
      ...subjectClassesToCreate.map((subjectClass) =>
        prisma.user_subject.create({
          data: { userId: user!.id, subjectId: subjectClass.subjectId, availableDays: subjectClass.availableDays! },
        }),
      ),
    ])

    mixpanel.track('Update User Subjects', {
      // @ts-ignore
      distinct_id: req.user!.email,
    })

    res.send({ succesful: true })
  } catch (error: any) {
    console.error(`[ERROR] [User Update Me Subjects] Unexpected User Subjects Update: ${error.message}`)
    res.status(500).send({
      title: 'Erro Inesperado',
      message: 'Erro inesperado ao atualizar disciplinas do usuário - Tente novamente mais tarde',
    })
  }
}

export default updateMeSubjects
