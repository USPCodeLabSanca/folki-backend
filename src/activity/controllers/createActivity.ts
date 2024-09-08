import { Request, Response } from 'express'
import prisma from '../../db'
import mixpanel from '../../utils/mixpanel'
import getActivityDate from '../../utils/getActivityDate'
import sendPushNotifications from '../../utils/sendPushNotifications'
import { activity } from '@prisma/client'
import SubjectClass from '../../types/SubjectClass'
import createToken from '../../utils/createToken'

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

    if (alreadyCreatedActivity && !body.isPrivate) {
      return res.status(400).send({
        title: 'Atividade já existente!',
        message: 'Atividade já existente - Verifique se a atividade já foi adicionada',
      })
    }

    if (user?.isBlocked) {
      return res.status(403).send({
        title: 'Permissão negada',
        message: 'Você foi bloqueado do Folki não tem permissão para criar atividades',
      })
    }

    const activity = await prisma.activity.create({
      data: {
        ...body,
        userId: user!.id,
      },
    })

    //if (!body.isPrivate) await sendNewActivityNotification(subjectClass, activity)

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

const sendNewActivityNotification = async (subjectClass: SubjectClass, activity: activity) => {
  const usersToSendNotifications = await prisma.user.findMany({
    where: { user_subject: { some: { subjectClassId: subjectClass.id } }, notificationId: { not: null } },
  })
  const pushIds: string[] = usersToSendNotifications.map((user) => user.notificationId || '')

  const title = `Nova Atividade de ${subjectClass.subject!.name}`
  const textBody = `A Atividade "${activity.name}" Foi Adicionada para ${getActivityDate(
    activity.finishDate.toString(),
  )}.`

  await sendPushNotifications(pushIds, title, textBody)
}

export { createActivity }
