import { Request, Response } from 'express'
import { getSubjects } from './controllers/getSubjects'
import { runSyncSubjectsJupiterByInstitute } from './controllers/runSyncSubjectsJupiterByInstitute'
import { runSyncDefaultSubjectsJupiterByCourse } from './controllers/runSyncDefaultSubjectsJupiterByCourse'
import { runSyncClassesJupiterBySubject } from './controllers/runSyncClassesJupiterBySubject'

interface Controller {
  getSubjects: (req: Request, res: Response) => void
  runSyncSubjectsJupiterByInstitute: (req: Request, res: Response) => void
  runSyncDefaultSubjectsJupiterByCourse: (req: Request, res: Response) => void
  runSyncClassesJupiterBySubject: (req: Request, res: Response) => void
}

const controller: Controller = {
  getSubjects,
  runSyncSubjectsJupiterByInstitute,
  runSyncDefaultSubjectsJupiterByCourse,
  runSyncClassesJupiterBySubject,
}

export default controller
