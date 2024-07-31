import { Request, Response } from 'express'
import prisma from '../../db'
import mixpanel from '../../utils/mixpanel'

const uncheckActivity = async (req: Request, res: Response) => {
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

    await prisma.user_activity_check.deleteMany({
      where: {
        userId: user!.id,
        activityId: activity.id,
      },
    })

    mixpanel.track('Uncheck Activity', {
      // @ts-ignore
      distinct_id: req.user!.email,
      activity,
    })

    res.send({ activity })
  } catch (error: any) {
    console.error(`[ERROR] [Uncheck Activity] Unexpected Error: ${error.message}`)
    res.status(500).send({
      title: 'Erro inesperado',
      message: 'Erro inesperado ao desmarcar atividade como concluída - Tente novamente mais tarde',
    })
  }
}

export { uncheckActivity }
