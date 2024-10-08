import { Request, Response } from 'express'
import prisma from '../../db'
import mixpanel from '../../utils/mixpanel'
import sendPushNotifications from '../../utils/sendPushNotifications'
import { activity } from '@prisma/client'
import SubjectClass from '../../types/SubjectClass'
import Activity from '../../types/Activity'

const deleteActivity = async (req: Request, res: Response) => {
  // @ts-ignore
  const { user, params } = req
  const { id } = params

  try {
    const activity = await prisma.activity.findUnique({
      where: { id: Number(id) },
      include: { subjectClass: { include: { subject: true } } },
    })

    if (!activity)
      return res.status(400).send({ title: 'Atividade não encontrada', message: 'Atividade não encontrada' })

    const isUserInTheActivitySubjectClass = await prisma.user_subject.findFirst({
      where: { userId: user!.id, subjectClassId: activity.subjectClassId },
    })
    const isUserOwner = activity.userId === user!.id
    const canUserDelete = (isUserInTheActivitySubjectClass && !activity.isPrivate) || isUserOwner

    if (!canUserDelete)
      return res
        .status(403)
        .send({ title: 'Permissão negada', message: 'Você não tem permissão para deletar essa atividade' })

    if (user?.isBlocked) {
      return res.status(403).send({
        title: 'Permissão negada',
        message: 'Você foi bloqueado do Folki não tem permissão para deletar atividades',
      })
    }

    mixpanel.track('Delete Activity', {
      // @ts-ignore
      distinct_id: req.user!.email,
      activity,
    })

    await prisma.activity.update({ where: { id: Number(id) }, data: { deletedAt: new Date() } })

    if (!activity.isPrivate) await sendDeleteActivityNotification(activity.subjectClass, activity)

    res.send({ succesful: true })
  } catch (error: any) {
    console.error(`[ERROR] [Delete Activity] Unexpected Error: ${error.message}`)
    res
      .status(500)
      .send({ title: 'Erro inesperado', message: 'Erro inesperado ao deletar atividade - Tente novamente depois' })
  }
}

const sendDeleteActivityNotification = async (subjectClass: SubjectClass, activity: Activity) => {
  const usersToSendNotifications = await prisma.user.findMany({
    where: { user_subject: { some: { subjectClassId: activity.subjectClassId } }, notificationId: { not: null } },
  })
  const pushIds: string[] = usersToSendNotifications.map((user) => user.notificationId || '')

  const title = `Atividade de ${activity.subjectClass!.subject!.name} Deletada`
  const textBody = `A Atividade "${activity.name}" Foi Deletada.`

  await sendPushNotifications(pushIds, title, textBody)
}

export { deleteActivity }
