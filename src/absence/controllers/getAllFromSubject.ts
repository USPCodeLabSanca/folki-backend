import { Request, Response } from 'express'
import prisma from '../../db'

const getAllFromSubject = async (req: Request, res: Response) => {
  // @ts-ignore
  const { user, params } = req
  const { id } = params

  try {
    const absences = await prisma.user_absence.findMany({
      where: { userId: user!.id, subjectId: Number(id) },
      orderBy: { date: 'desc' },
    })
    res.send({ absences })
  } catch (error: any) {
    console.error(`[ERROR] [Get All From Subject] Unexpected Error: ${error.message}`)
    res.status(500).send({
      title: 'Erro inesperado',
      message: 'Erro inesperado ao obter faltas - Tente novamente mais tarde',
    })
  }
}

export { getAllFromSubject }
