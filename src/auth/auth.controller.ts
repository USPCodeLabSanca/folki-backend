import { Request, Response } from 'express'
import { sendAuthEmail } from './controllers/sendAuthEmail'
import { validateAuthCode } from './controllers/validateAuthCode'

interface Controller {
  sendAuthEmail: (req: Request, res: Response) => void
  validateAuthCode: (req: Request, res: Response) => void
}

const controller: Controller = {
  sendAuthEmail,
  validateAuthCode,
}

export default controller
