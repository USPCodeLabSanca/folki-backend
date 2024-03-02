import { Request, Response } from 'express'
import prisma from '../../db'
import authSettings from '../../settings/auth'
import createToken from '../services/createToken'
import mixpanel from '../../utils/mixpanel'

const validateAuthCode = async (req: Request, res: Response) => {
  const { userId, authCode } = req.body

  if (!userId || !authCode)
    return res.status(400).send({ title: 'Dados inválidos', message: 'userId e authCode são obrigatórios' })

  try {
    const user = await prisma.user.findUnique({ where: { id: Number(userId) } })

    if (!user) return res.status(404).send({ title: 'Usuário não encontrado', message: 'Usuário não encontrado' })

    if (user.authTimesTried === authSettings.tryLimits) {
      const intervalFromLastTry = new Date().getTime() - user.lastAuthTry!.getTime()
      if (intervalFromLastTry < authSettings.tryInterval)
        return res.status(400).send({
          title: 'Erro de Autenticação',
          message: 'Você excedeu o limite de tentativas - Tente novamente mais tarde',
        })
      else {
        await prisma.user.update({ where: { id: user.id }, data: { authTimesTried: 0 } })
        user.authTimesTried = 0
      }
    }

    await prisma.user.update({
      where: { id: user.id },
      data: { authTimesTried: user.authTimesTried + 1, lastAuthTry: new Date() },
    })

    const userAuth = await prisma.user_auth.findFirst({
      where: { userId: Number(userId), authCode },
      orderBy: { createdAt: 'desc' },
    })

    if (!userAuth)
      return res.status(400).send({ title: 'Erro de Autenticação', message: 'Código de Autenticação Inválido' })

    mixpanel.track('Email Validated', {
      distinct_id: user.email,
    })

    await prisma.user_auth.deleteMany({ where: { userId: Number(userId) } })
    await prisma.user.update({
      where: { id: user.id },
      data: { authTimesTried: 0, isVerified: true, lastLogin: new Date() },
    })

    const token = createToken(user.id, user.securePin!)

    // @ts-ignore
    delete user.securePin

    return res.send({ token, user })
  } catch (error: any) {
    console.error(`[ERROR] [Validate Auth Code] Unexpected Auth Error: ${error.message}`)
    res.status(500).send({
      title: 'Erro de Autenticação',
      message: 'Erro inesperado ao validar código de verificação - Tente novamente depois',
    })
  }
}

export { validateAuthCode }
