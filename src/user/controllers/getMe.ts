import { Request, Response } from 'express'
import prisma from '../../db'

const getMe = (req: Request, res: Response) => {
  // @ts-ignore
  const { user } = req
  prisma.user.update({ where: { id: user!.id }, data: { lastAccess: new Date() } })
  res.send({ user })
}

export default getMe
