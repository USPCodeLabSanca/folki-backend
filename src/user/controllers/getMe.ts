import { Request, Response } from 'express'
import prisma from '../../db'
import mixpanel from '../../utils/mixpanel'

const getMe = async (req: Request, res: Response) => {
  // @ts-ignore
  const { user } = req
  await prisma.user.update({ where: { id: user!.id }, data: { lastAccess: new Date() } })

  mixpanel.track('Access', {
    // @ts-ignore
    distinct_id: req.user!.email,
  })

  res.send({ user })
}

export default getMe
