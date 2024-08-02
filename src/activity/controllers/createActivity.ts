import { Request, Response } from 'express'
import prisma from '../../db'
import mixpanel from '../../utils/mixpanel'

const createActivity = async (req: Request, res: Response) => {
  // @ts-ignore
  const { user, body } = req

  if (!body || !body.name || !body.finishDate || !body.subjectClassId || !body.type) {
    return res.status(400).send({
      title: 'Dados inválidos',
      message: 'Dados inválidos - Verifique se os campos estão preenchidos corretamente',
    })
  }

  try {
    const activity = await prisma.activity.create({
      data: {
        ...body,
        userId: user!.id,
      },
    })

    mixpanel.track('Add Activity', {
      // @ts-ignore
      distinct_id: req.user!.email,
      activity,
    })

    res.send({ activity })
  } catch (error: any) {
    console.error(`[ERROR] [Create Activity] Unexpected Error: ${error.message}`)
    res.status(500).send({
      title: 'Erro inesperado',
      message: 'Erro inesperado ao criar atividade - Tente novamente mais tarde',
    })
  }
}

export { createActivity }
