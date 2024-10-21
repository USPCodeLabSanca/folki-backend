import { NextFunction, Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import prisma from '../db'

const auth = async (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization

  if (!authHeader) {
    return res.status(401).send({ title: 'Erro de Autorização', message: 'Header de Autorização não existe' })
  }

  const parts = authHeader.split(' ')

  if (!(parts.length === 2)) {
    return res.status(401).send({ title: 'Erro de Autorização', message: 'Header de Autorização mal formatado' })
  }

  const [scheme, token] = parts

  if (!/^Bearer$/i.test(scheme)) {
    return res.status(401).send({ title: 'Erro de Autorização', message: 'Header de Autorização mal formatado' })
  }

  try {
    const tokenData: any = jwt.verify(token, process.env.JWT_SECRET || 'secret')
    const user = await prisma.user.findUnique({
      where: { id: tokenData.id },
      select: {
        email: true,
        id: true,
        name: true,
        securePin: true,
        isAdmin: true,
        instituteId: true,
        courseId: true,
        institute: true,
        userVersion: true,
        isBlocked: true,
        university: true,
        universityId: true,
      },
    })

    if (!user) return res.status(401).send({ title: 'Erro de Autorização', message: 'Usuário não Existe' })

    if (user.securePin !== tokenData.securePin)
      return res.status(401).send({ title: 'Erro de Autorização', message: 'Usuário Impedido de Fazer Login' })

    // @ts-ignore
    delete user.securePin

    // @ts-ignore
    req.user = user

    next()
  } catch (err: any) {
    /* istanbul ignore next */
    console.error(`[ERROR] [Auth Middleware] Unexpected Auth Error: ${err.message}`)
    /* istanbul ignore next */
    return res
      .status(500)
      .send({ title: 'Erro de Autorização', message: 'Erro Inesperado de Autenticação - Tente Novamente mais Tarde' })
  }
}

export default auth
