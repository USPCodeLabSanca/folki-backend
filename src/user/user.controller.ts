import { Request, Response } from 'express'
import getMe from './controllers/getMe'
import updateMe from './controllers/updateMe'
import getMeSubjects from './controllers/getMeSubjects'
import getCoolNumbers from './controllers/getCoolNumbers'
import getUsersByQuery from './controllers/getUsersByQuery'
import sendUserNotifications from './controllers/sendUserNotifications'
import { authFromJupiter } from './controllers/auth'

interface Controller {
  getCoolNumbers: (req: Request, res: Response) => void
  getUsers: (req: Request, res: Response) => void
  sendUserNotifications: (req: Request, res: Response) => void
  getMe: (req: Request, res: Response) => void
  getMeSubjects: (req: Request, res: Response) => void
  updateMe: (req: Request, res: Response) => void
  auth: (req: Request, res: Response) => void
}

const controller: Controller = {
  getCoolNumbers,
  getUsers: getUsersByQuery,
  sendUserNotifications,
  getMe,
  getMeSubjects,
  updateMe,
  auth: authFromJupiter,
}

export default controller
