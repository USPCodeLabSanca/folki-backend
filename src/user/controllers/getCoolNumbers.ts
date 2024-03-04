import { Request, Response } from 'express'
import prisma from '../../db'

const getCoolNumbers = async (req: Request, res: Response) => {
  const coolNumbers = await prisma.user.count()
  res.send({ coolNumbers })
}

export default getCoolNumbers
