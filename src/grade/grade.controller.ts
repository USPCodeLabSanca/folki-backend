import { Request, Response } from 'express'
import { post } from './controllers/post'
import { getAllFromSubject } from './controllers/getAllFromSubject'
import { deleteGrade } from './controllers/deleteGrade'

interface Controller {
  getAllFromSubject: (req: Request, res: Response) => void
  post: (req: Request, res: Response) => void
  deleteGrade: (req: Request, res: Response) => void
}

const controller: Controller = {
  getAllFromSubject,
  post,
  deleteGrade,
}

export default controller
