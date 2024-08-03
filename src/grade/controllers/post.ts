import { Request, Response } from 'express'
import prisma from '../../db'
import mixpanel from '../../utils/mixpanel'

const post = async (req: Request, res: Response) => {
  // @ts-ignore
  const { user, body } = req
  const { userSubjectId, name, percentage, value } = body

  if (!userSubjectId || !name || !percentage || !value)
    return res.status(400).send({ title: 'Dados inválidos', message: 'Por favor, insira os dados corretamente' })

  try {
    const userSubject = await prisma.user_subject.findFirst({
      where: { userId: user!.id, id: Number(userSubjectId) },
    })
    if (!userSubject)
      return res.status(404).send({ title: 'Matéria não encontrada', message: 'Matéria não encontrada' })

    await prisma.$transaction([
      prisma.grade.create({
        data: { userSubjectId: userSubject.id, name, percentage, value },
      }),
      prisma.user_subject.update({
        where: { id: userSubject.id },
        data: { grading: { increment: value * (percentage / 100) } },
      }),
    ])

    mixpanel.track('Add Grade', {
      // @ts-ignore
      distinct_id: req.user!.email,
      userSubject,
    })

    res.status(201).send({ succesful: true })
  } catch (error: any) {
    console.error(`[ERROR] [Post Grade] Unexpected Error: ${error.message}`)
    res
      .status(500)
      .send({ title: 'Erro inesperado', message: 'Erro inesperado ao criar nota - Tente novamente mais tarde' })
  }
}

export { post }
