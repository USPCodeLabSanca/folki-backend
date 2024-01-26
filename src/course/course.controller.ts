import { Request, Response } from 'express'
import { getCourseDefaultSubjects } from './controllers/getCourseSubjects'

interface Controller {
  getCourseDefaultSubjects: (req: Request, res: Response) => void
}

const controller: Controller = {
  getCourseDefaultSubjects,
}

export default controller
