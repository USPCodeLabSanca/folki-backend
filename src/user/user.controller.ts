import { Request, Response } from 'express'
import getMe from './controllers/getMe'

interface Controller {
  getMe: (req: Request, res: Response) => void
}

const controller: Controller = {
  getMe,
}

export default controller
