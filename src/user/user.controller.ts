import { Request, Response } from 'express'
import getMe from './controllers/getMe'
import updateMe from './controllers/updateMe'
import updateMeSubjects from './controllers/updateMeSubjects'
import getMeSubjects from './controllers/getMeSubjects'

interface Controller {
  getMe: (req: Request, res: Response) => void
  getMeSubjects: (req: Request, res: Response) => void
  updateMe: (req: Request, res: Response) => void
  updateMeSubjects: (req: Request, res: Response) => void
}

const controller: Controller = {
  getMe,
  getMeSubjects,
  updateMe,
  updateMeSubjects,
}

export default controller
