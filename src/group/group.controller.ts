import { Request, Response } from 'express'
import { createGroup } from './controllers/createGroup'
import { deleteGroup } from './controllers/deleteGroup'
import { getGroup } from './controllers/getGroup'
import { getGroupsByCampusAndTags } from './controllers/getGroupsByCampusAndTags'

interface Controller {
  getGroupsByCampusAndTags: (req: Request, res: Response) => void
  getGroup: (req: Request, res: Response) => void
  createGroup: (req: Request, res: Response) => void
  deleteGroup: (req: Request, res: Response) => void
}

const controller: Controller = {
  getGroupsByCampusAndTags,
  getGroup,
  createGroup,
  deleteGroup,
}

export default controller
