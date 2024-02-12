import { Request, Response } from 'express'
import { getDriveItems } from './controllers/getDriveItems'
import { addDriveItem } from './controllers/addDriveItem'
import { removeDriveItem } from './controllers/removeDriveItem'

interface Controller {
  addDriveItem: (req: Request, res: Response) => void
  getDriveItems: (req: Request, res: Response) => void
  removeDriveItem: (req: Request, res: Response) => void
}

const controller: Controller = {
  addDriveItem,
  getDriveItems,
  removeDriveItem,
}

export default controller
