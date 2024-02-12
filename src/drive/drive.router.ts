import express from 'express'
import auth from '../middleware/auth'
import controller from './drive.controller'

const router = express.Router()

router.route('/').all(auth).post(controller.addDriveItem)
router.route('/:id').all(auth).delete(controller.removeDriveItem)

export default router
