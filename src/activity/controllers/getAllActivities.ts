import { Request, Response } from 'express'
import prisma from '../../db'

const getAllActivities = async (req: Request, res: Response) => {
  // @ts-ignore
  const { user } = req

  try {
    const activities = await prisma.activity.findMany({
      where: { userId: user!.id },
      orderBy: { finishDate: 'desc' },
    })
    res.send({ activities })
  } catch (error: any) {
    console.error(`[ERROR] [Get All Activities] Unexpected Error: ${error.message}`)
    res.status(500).send({
      title: 'Erro inesperado',
      message: 'Erro inesperado ao obter atividades - Tente novamente mais tarde',
    })
  }
}

export { getAllActivities }
