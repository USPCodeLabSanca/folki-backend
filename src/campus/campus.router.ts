import express from 'express'
import controller from './campus.controller'

const router = express.Router()

router.route('/').get(controller.get)
router.route('/:id/institutes').get(controller.getCampusInstitutes)

export default router
