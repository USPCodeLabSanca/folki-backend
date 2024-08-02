import express from 'express'
import controller from './subject.controller'
import absencesController from '../absence/absence.controller'
import driveController from '../drive/drive.controller'
import auth from '../middleware/auth'

const router = express.Router()

router.route('/').get(controller.getSubjects)

router.route('/jupiter').post(controller.getSubjectsByJupiterWebLogin)

router.route('/:id/absences').all(auth).get(absencesController.getAllFromSubject)
router.route('/:id/absences').all(auth).post(absencesController.post)

router.route('/:id/drive').all(auth).get(driveController.getDriveItems)

export default router
