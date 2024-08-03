import { Request, Response } from 'express'
import prisma from '../../db'

const getAllFromSubject = async (req: Request, res: Response) => {
  // @ts-ignore
  const { user, params } = req
  const { id } = params

  try {
    const userSubject = await prisma.user_subject.findFirst({
      where: { userId: user!.id, id: Number(id) },
    })

    if (!userSubject)
      return res.status(404).send({ title: 'Matéria não encontrada', message: 'Matéria não encontrada' })

    const grades = await prisma.grade.findMany({
      where: { userSubjectId: Number(id) },
    })
    res.send({ grades })
  } catch (error: any) {
    console.error(`[ERROR] [Get All Grades From Subject] Unexpected Error: ${error.message}`)
    res.status(500).send({
      title: 'Erro inesperado',
      message: 'Erro inesperado ao obter notas - Tente novamente mais tarde',
    })
  }
}

export { getAllFromSubject }
