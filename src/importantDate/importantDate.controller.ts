import { Request, Response } from 'express'
import { getImportantDates } from './controllers/getImportantDates'
import { createImportantDate } from './controllers/createImportantDate'
import { deleteImportantDate } from './controllers/deleteImportantDate'

interface Controller {
  getImportantDates: (req: Request, res: Response) => void
  createImportantDate: (req: Request, res: Response) => void
  deleteImportantDate: (req: Request, res: Response) => void
}

const controller: Controller = {
  getImportantDates,
  createImportantDate,
  deleteImportantDate,
}

export default controller
