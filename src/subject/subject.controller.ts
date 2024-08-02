import { Request, Response } from 'express'
import { getSubjects } from './controllers/getSubjects'
import { getSubjectsByJupiterWebLogin } from './controllers/getSubjectsByJupiterWebLogin'

interface Controller {
  getSubjects: (req: Request, res: Response) => void
  getSubjectsByJupiterWebLogin: (req: Request, res: Response) => void
}

const controller: Controller = {
  getSubjects,
  getSubjectsByJupiterWebLogin,
}

export default controller
