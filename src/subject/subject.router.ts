import express from 'express'
import controller from './subject.controller'
import absencesController from '../absence/absence.controller'
import gradesController from '../grade/grade.controller'
import auth from '../middleware/auth'

const router = express.Router()

router.route('/').get(controller.getSubjects)

router.route('/:id/absences').all(auth).get(absencesController.getAllFromSubject)
router.route('/:id/absences').all(auth).post(absencesController.post)
router.route('/:id/absences/:absenceId').all(auth).delete(absencesController.deleteAbsence)

router.route('/:id/grades').all(auth).get(gradesController.getAllFromSubject)

export default router
