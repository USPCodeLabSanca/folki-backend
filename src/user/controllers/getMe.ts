import { Request, Response } from 'express'

const getMe = (req: Request, res: Response) => {
  // @ts-ignore
  const { user } = req
  res.send({ user })
}

export default getMe
