import { Request, Response } from 'express'
import getMe from './controllers/getMe'
import updateMe from './controllers/updateMe'
import updateMeSubjects from './controllers/updateMeSubjects'
import getMeSubjects from './controllers/getMeSubjects'
import getCoolNumbers from './controllers/getCoolNumbers'

interface Controller {
  getCoolNumbers: (req: Request, res: Response) => void
  getMe: (req: Request, res: Response) => void
  getMeSubjects: (req: Request, res: Response) => void
  updateMe: (req: Request, res: Response) => void
  updateMeSubjects: (req: Request, res: Response) => void
}

const controller: Controller = {
  getCoolNumbers,
  getMe,
  getMeSubjects,
  updateMe,
  updateMeSubjects,
}

export default controller
