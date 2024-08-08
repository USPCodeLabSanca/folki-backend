import { Request, Response } from 'express'
import prisma from '../../db'
import mixpanel from '../../utils/mixpanel'
import getActivityDate from '../../utils/getActivityDate'
import sendPushNotifications from '../../utils/sendPushNotifications'

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
    const subjectClass = await prisma.subject_class.findFirst({
      where: { id: body.subjectClassId, user_subject: { some: { userId: user!.id } } },
      include: { subject: true },
    })

    if (!subjectClass) {
      return res.status(400).send({
        title: 'Disciplina inválida',
        message: 'Disciplina inválida - Verifique se a disciplina selecionada é válida',
      })
    }

    const alreadyCreatedActivity = await prisma.activity.findFirst({
      where: { subjectClassId: body.subjectClassId, type: body.type, finishDate: body.finishDate },
    })

    if (alreadyCreatedActivity) {
      return res.status(400).send({
        title: 'Atividade já existente!',
        message: 'Atividade já existente - Verifique se a atividade já foi adicionada',
      })
    }

    const activity = await prisma.activity.create({
      data: {
        ...body,
        userId: user!.id,
      },
    })

    const usersToSendNotifications = await prisma.user.findMany({
      where: { user_subject: { some: { subjectClassId: body.subjectClassId } }, notificationId: { not: null } },
    })
    const pushIds: string[] = usersToSendNotifications.map((user) => user.notificationId || '')

    const title = `Nova Atividade de ${subjectClass.subject.name}`
    const textBody = `A Atividade "${body.name}" Foi Adicionada para ${getActivityDate(body.finishDate)}.`

    await sendPushNotifications(pushIds, title, textBody)

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
