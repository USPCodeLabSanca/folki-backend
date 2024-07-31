import { Request, Response } from 'express'
import prisma from '../../db'

const getAllActivities = async (req: Request, res: Response) => {
  // @ts-ignore
  const { user } = req

  try {
    const activities = await prisma.activity.findMany({
      where: { userId: user!.id },
      orderBy: { finishDate: 'asc' },
      include: { userSubject: { include: { subjectClass: { include: { subject: true } } } } },
    })

    const notFinishedActivities = activities.filter((activity) => {
      const finishDate = new Date(activity.finishDate)
      const today = new Date()
      return finishDate > today
    })

    const finishedActivities = activities.filter((activity) => {
      const finishDate = new Date(activity.finishDate)
      const today = new Date()
      return finishDate <= today
    })

    res.send({ activities: [...notFinishedActivities, ...finishedActivities] })
  } catch (error: any) {
    console.error(`[ERROR] [Get All Activities] Unexpected Error: ${error.message}`)
    res.status(500).send({
      title: 'Erro inesperado',
      message: 'Erro inesperado ao obter atividades - Tente novamente mais tarde',
    })
  }
}

export { getAllActivities }
