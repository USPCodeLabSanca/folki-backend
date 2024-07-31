import express from 'express'
import controller from './importantDate.controller'
import auth from '../middleware/auth'

const router = express.Router()

router.route('/').all(auth).get(controller.getImportantDates)
router.route('/').all(auth).post(controller.createImportantDate)
router.route('/:id').all(auth).delete(controller.deleteImportantDate)

export default router
