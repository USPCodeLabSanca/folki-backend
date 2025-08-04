import { Request, Response } from 'express'
import prisma from '../../db'
import getActivityDate from '../../utils/getActivityDate'
import sendPushNotifications from '../../utils/sendPushNotifications'
import { activity } from '@prisma/client'
import SubjectClass from '../../types/SubjectClass'

const updateActivity = async (req: Request, res: Response) => {
  // @ts-ignore
  const { user, body } = req
  const { id } = req.params

  delete body.userId

  try {
    const activity = await prisma.activity.findUnique({ where: { id: Number(id) } })

    if (!activity)
      return res.status(400).send({ title: 'Atividade não encontrada', message: 'Atividade não encontrada' })

    const subjectClass = await prisma.subject_class.findFirst({
      where: { id: activity.subjectClassId, user_subject: { some: { userId: user!.id } } },
      include: { subject: true },
    })

    if (!subjectClass) {
      return res.status(400).send({
        title: 'Disciplina inválida',
        message: 'Disciplina inválida - Verifique se a disciplina selecionada é válida',
      })
    }

    const isUserInTheActivitySubjectClass = await prisma.user_subject.findFirst({
      where: { userId: user!.id, subjectClassId: activity.subjectClassId },
    })

    if (!isUserInTheActivitySubjectClass)
      return res
        .status(403)
        .send({ title: 'Permissão negada', message: 'Você não tem permissão para atualizar essa atividade' })

    if (user?.isBlocked) {
      return res.status(403).send({
        title: 'Permissão negada',
        message: 'Você foi bloqueado do Folki não tem permissão para atualizar atividades',
      })
    }

    await prisma.activity.update({ where: { id: Number(id) }, data: { ...body } })

    const isSameDate = new Date(activity.finishDate).toDateString() === new Date(body.finishDate).toDateString()
    if (!isSameDate && !activity.isPrivate) {
      await sendUpdateActivityNotification(subjectClass, activity)
    }

    res.send({ succesful: true })
  } catch (error: any) {
    console.error(`[ERROR] [Update Activity] Unexpected Error: ${error.message}`)
    res.status(500).send({
      title: 'Erro inesperado',
      message: 'Erro inesperado ao atualizar atividade - Tente novamente mais tarde',
    })
  }
}

const sendUpdateActivityNotification = async (subjectClass: SubjectClass, activity: activity) => {
  const usersToSendNotifications = await prisma.user.findMany({
    where: {
      user_subject: { some: { subjectClassId: subjectClass.id } },
      notificationId: { not: null },
    },
  })
  const pushIds: string[] = usersToSendNotifications.map((user) => user.notificationId || '')

  const title = `Data da Atividade de ${subjectClass.subject!.name} Atualizada`
  const textBody = `A Atividade "${activity.name}" Foi Atualizada para ${getActivityDate(
    activity.finishDate.toString(),
  )}.`

  await sendPushNotifications(pushIds, title, textBody)
}

export { updateActivity }
