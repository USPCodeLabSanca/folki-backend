import { Request, Response } from 'express'
import prisma from '../../db'
import sendPushNotifications from '../../utils/sendPushNotifications'

const sendUserNotifications = async (req: Request, res: Response) => {
  // @ts-ignore
  const { user } = req
  const { userIds, title, body } = req.body

  if (!user?.isAdmin)
    return res
      .status(401)
      .send({ title: 'Acesso Negado', message: 'Você não tem permissão para acessar essa funcionalidade' })

  try {
    const users = await prisma.user.findMany({ where: { id: { in: userIds }, notificationId: { not: null } } })
    const pushIds: string[] = users.map((user) => user.notificationId || '')

    await sendPushNotifications(pushIds, title, body)
    res.send({ succesful: true })
  } catch (error: any) {
    console.error(`[ERROR] [User Send User Notifications] Unexpected Send User Notifications: ${error.message}`)
    res.status(500).send({
      title: 'Erro Inesperado',
      message: `Erro inesperado ao enviar notificações: ${error.message}`,
    })
  }
}

export default sendUserNotifications
