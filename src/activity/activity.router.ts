import express from 'express'
import controller from './activity.controller'
import auth from '../middleware/auth'

const router = express.Router()

router.route('/').all(auth).get(controller.getAllActivities)
router.route('/').all(auth).post(controller.createActivity)
router.route('/:id/check').all(auth).post(controller.checkActivity)
router.route('/:id/check').all(auth).delete(controller.uncheckActivity)
router.route('/:id').all(auth).patch(controller.updateActivity)
router.route('/:id').all(auth).delete(controller.deleteActivity)

export default router
