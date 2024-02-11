import express from 'express'
import controller from './user.controller'
import auth from '../middleware/auth'

const router = express.Router()

router.route('/me').all(auth).get(controller.getMe)
router.route('/me/subjects').all(auth).get(controller.getMeSubjects)
router.route('/me').all(auth).patch(controller.updateMe)
router.route('/me/subjects').all(auth).patch(controller.updateMeSubjects)

export default router
