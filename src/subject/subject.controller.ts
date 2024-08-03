import { Request, Response } from 'express'
import { getSubjects } from './controllers/getSubjects'

interface Controller {
  getSubjects: (req: Request, res: Response) => void
}

const controller: Controller = {
  getSubjects,
}

export default controller
