import express from 'express'
import controller from './auth.controller'

const router = express.Router()

router.route('/email').post(controller.sendAuthEmail)
router.route('/verify').post(controller.validateAuthCode)

export default router
