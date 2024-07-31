import { Request, Response } from 'express'
import { createActivity } from './controllers/createActivity'
import { getAllActivities } from './controllers/getAllActivities'
import { updateActivity } from './controllers/updateActivity'
import { deleteActivity } from './controllers/deleteActivity'
import { checkActivity } from './controllers/checkActivity'
import { uncheckActivity } from './controllers/uncheckActivity'

interface Controller {
  getAllActivities: (req: Request, res: Response) => void
  createActivity: (req: Request, res: Response) => void
  updateActivity: (req: Request, res: Response) => void
  deleteActivity: (req: Request, res: Response) => void
  checkActivity: (req: Request, res: Response) => void
  uncheckActivity: (req: Request, res: Response) => void
}

const controller: Controller = {
  getAllActivities,
  createActivity,
  updateActivity,
  deleteActivity,
  checkActivity,
  uncheckActivity,
}

export default controller
