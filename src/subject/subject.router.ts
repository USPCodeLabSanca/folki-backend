import express from 'express'
import controller from './subject.controller'

const router = express.Router()

router.route('/').get(controller.getSubjects)
router.route('/sync').post(controller.runSyncSubjectsJupiterByInstitute)
router.route('/default/sync').post(controller.runSyncDefaultSubjectsJupiterByCourse)
router.route('/classes/sync').post(controller.runSyncClassesJupiterBySubject)

export default router
