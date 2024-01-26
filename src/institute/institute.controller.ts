import { Request, Response } from 'express'
import { getInstituteCourses } from './controllers/getInstituteCourses'

interface Controller {
  getInstituteCourses: (req: Request, res: Response) => void
}

const controller: Controller = {
  getInstituteCourses,
}

export default controller
