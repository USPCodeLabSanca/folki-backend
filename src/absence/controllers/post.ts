import { Request, Response } from 'express'
import prisma from '../../db'

const post = async (req: Request, res: Response) => {
  // @ts-ignore
  const { user, body, params } = req
  const { date } = body
  const { id: subjectId } = params

  if (!subjectId || !date)
    return res.status(400).send({ title: 'Dados inválidos', message: 'Por favor, insira os dados corretamente' })

  try {
    const userSubject = await prisma.user_subject.findFirst({
      where: { userId: user!.id, subjectId: Number(subjectId) },
    })
    if (!userSubject)
      return res.status(404).send({ title: 'Matéria não encontrada', message: 'Matéria não encontrada' })

    await prisma.$transaction([
      prisma.user_absence.create({
        data: { userSubjectId: userSubject.id, subjectId: Number(subjectId), date, userId: user!.id },
      }),
      prisma.user_subject.update({
        where: { id: userSubject.id },
        data: { absences: { increment: 1 } },
      }),
    ])
    res.status(201).send({ succesful: true })
  } catch (error: any) {
    console.error(`[ERROR] [Post Absence] Unexpected Error: ${error.message}`)
    res
      .status(500)
      .send({ title: 'Erro inesperado', message: 'Erro inesperado ao criar falta - Tente novamente depois' })
  }
}

export { post }
