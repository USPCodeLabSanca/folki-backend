import { Request, Response } from 'express'
import prisma from '../../db'
import mixpanel from '../../utils/mixpanel'

const ignoreActivity = async (req: Request, res: Response) => {
  // @ts-ignore
  const { user, params } = req
  const { id } = params

  try {
    const activity = await prisma.activity.findUnique({
      where: { id: Number(id) },
    })

    if (!activity) {
      return res.status(404).send({
        title: 'Atividade não encontrada',
        message: 'Atividade não encontrada - Verifique se o ID da atividade está correto',
      })
    }

    const ignore = await prisma.user_activity_ignore.create({
      data: {
        userId: user!.id,
        activityId: activity.id,
      },
    })

    mixpanel.track('Ignore Activity', {
      // @ts-ignore
      distinct_id: req.user!.email,
      activity,
    })

    res.send({ ignore })
  } catch (error: any) {
    console.error(`[ERROR] [Ignore Activity] Unexpected Error: ${error.message}`)
    res.status(500).send({
      title: 'Erro inesperado',
      message: 'Erro inesperado ao marcar atividade como ignorada - Tente novamente mais tarde',
    })
  }
}

export { ignoreActivity }
