import { Request, Response } from 'express'
import { getAllCampuses } from './controllers/getAllCampuses'
import { getCampusInstitutes } from './controllers/getCampusInstitutes'

interface Controller {
  get: (req: Request, res: Response) => void
  getCampusInstitutes: (req: Request, res: Response) => void
}

const controller: Controller = {
  get: getAllCampuses,
  getCampusInstitutes,
}

export default controller
