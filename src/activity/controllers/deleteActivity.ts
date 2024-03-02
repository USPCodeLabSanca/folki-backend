import { Request, Response } from 'express'
import prisma from '../../db'
import mixpanel from '../../utils/mixpanel'

const deleteActivity = async (req: Request, res: Response) => {
  // @ts-ignore
  const { user, params } = req
  const { id } = params

  try {
    const activity = await prisma.activity.findUnique({ where: { id: Number(id) } })

    if (!activity)
      return res.status(400).send({ title: 'Atividade não encontrada', message: 'Atividade não encontrada' })

    if (activity.userId !== user!.id)
      return res
        .status(403)
        .send({ title: 'Permissão negada', message: 'Você não tem permissão para deletar essa atividade' })

    mixpanel.track('Delete Activity', {
      // @ts-ignore
      distinct_id: req.user!.email,
      activity,
    })

    await prisma.activity.delete({ where: { id: Number(id) } })
    res.send({ succesful: true })
  } catch (error: any) {
    console.error(`[ERROR] [Delete Activity] Unexpected Error: ${error.message}`)
    res
      .status(500)
      .send({ title: 'Erro inesperado', message: 'Erro inesperado ao deletar atividade - Tente novamente depois' })
  }
}

export { deleteActivity }
