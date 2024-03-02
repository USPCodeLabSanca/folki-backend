import { Request, Response } from 'express'
import { verifyUSPEmail } from '../auth.utils'
import prisma from '../../db'
import authSettings from '../../settings/auth'
import { sendEmail } from '../services/sendEmail'
import mixpanel from '../../utils/mixpanel'

const sendAuthEmail = async (req: Request, res: Response) => {
  const { email } = req.body

  if (!email) return res.status(400).send({ title: 'Email inválido', message: 'Por favor, insira um email válido' })

  if (!verifyUSPEmail(email))
    return res.status(400).send({ title: 'Email inválido', message: 'Por favor, insira um email da USP' })

  try {
    let user = await prisma.user.findUnique({ where: { email } })

    if (!user) user = await prisma.user.create({ data: { name: email, email } })

    mixpanel.track('Send Auth Email', {
      // @ts-ignore
      distinct_id: user!.email,
    })

    if (user.authTimesTried === authSettings.tryLimits) {
      const intervalFromLastTry = new Date().getTime() - user.lastAuthTry!.getTime()
      if (intervalFromLastTry < authSettings.tryInterval)
        return res.status(400).send({
          title: 'Erro de Autenticação',
          message: 'Você excedeu o limite de tentativas - Tente novamente mais tarde',
        })
      else await prisma.user.update({ where: { id: user.id }, data: { authTimesTried: 0 } })
    }

    const authCode = String(Math.floor(100000 + Math.random() * 900000))

    await prisma.user_auth.deleteMany({ where: { userId: user.id } })
    await prisma.user_auth.create({ data: { userId: user.id, authCode } })

    await sendEmail(email, authCode)

    return res.send({ userId: user.id })
  } catch (error: any) {
    console.error(`[ERROR] [Send Auth Email] Unexpected Auth Error: ${error.message}`)
    res.status(500).send({
      title: 'Erro de Autenticação',
      message: 'Erro inesperado ao enviar erro de verificação - Tente novamente depois',
    })
  }
}

export { sendAuthEmail }
