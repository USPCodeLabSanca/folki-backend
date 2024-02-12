import { Request, Response } from 'express'
import { post } from './controllers/post'
import { getAllFromSubject } from './controllers/getAllFromSubject'
import { deleteAbsence } from './controllers/deleteAbsence'

interface Controller {
  getAllFromSubject: (req: Request, res: Response) => void
  post: (req: Request, res: Response) => void
  deleteAbsence: (req: Request, res: Response) => void
}

const controller: Controller = {
  getAllFromSubject,
  post,
  deleteAbsence,
}

export default controller
