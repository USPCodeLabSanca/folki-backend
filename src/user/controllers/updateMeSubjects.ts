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

    await prisma.$transaction([
      prisma.user_subject.deleteMany({ where: { userId: user!.id } }),
      ...subjectClasses.map((subjectClass) =>
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
