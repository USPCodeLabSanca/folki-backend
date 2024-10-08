import { Request, Response } from 'express'
import prisma from '../../db'

const getAllActivities = async (req: Request, res: Response) => {
  // @ts-ignore
  const { user } = req

  try {
    let activities = await prisma.activity.findMany({
      where: {
        OR: [
          {
            subjectClass: { user_subject: { some: { userId: user!.id } } },
            isPrivate: false,
          },
          {
            subjectClass: { user_subject: { some: { userId: user!.id } } },
            userId: user!.id,
          },
        ],
      },
      orderBy: { finishDate: 'asc' },
      include: {
        subjectClass: { include: { subject: { select: { id: true, name: true } } } },
        user: { select: { name: true } },
      },
    })

    const activityChecks = await prisma.user_activity_check.findMany({
      where: { userId: user!.id },
    })

    const activityIgnore = await prisma.user_activity_ignore.findMany({
      where: { userId: user!.id },
    })

    activities = activities.map((activity) => {
      const checked = activityChecks.find((check) => check.activityId === activity.id)
      return {
        ...activity,
        finishDate: new Date(activity.finishDate.setHours(15)),
        checked: !!checked,
      }
    })

    activities = activities.filter((activity) => {
      const ignored = activityIgnore.find((ignore) => ignore.activityId === activity.id)
      return !ignored
    })

    // verify if user is using the new activities version
    if (user?.userVersion !== '2.3.0') {
      activities = activities.filter((activity) => {
        return activity.deletedAt === null
      })
    }

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
