import express from 'express'
import controller from './subject.controller'

const router = express.Router()

router.route('/').get(controller.getSubjects)

export default router
