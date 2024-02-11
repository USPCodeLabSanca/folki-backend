import express from 'express'
import controller from './user.controller'
import auth from '../middleware/auth'

const router = express.Router()

router.route('/me').all(auth).get(controller.getMe)

export default router
