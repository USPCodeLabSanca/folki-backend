import express from 'express'
import controller from './subject.controller'
import absencesController from '../absence/absence.controller'
import auth from '../middleware/auth'

const router = express.Router()

router.route('/').get(controller.getSubjects)

router.route('/sync').post(controller.runSyncSubjectsJupiterByInstitute)
router.route('/default/sync').post(controller.runSyncDefaultSubjectsJupiterByCourse)
router.route('/classes/sync').post(controller.runSyncClassesJupiterBySubject)

router.route('/:id/absences').all(auth).get(absencesController.getAllFromSubject)
router.route('/:id/absences').all(auth).post(absencesController.post)

export default router
