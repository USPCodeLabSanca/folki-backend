import express from 'express'
import controller from './course.controller'

const router = express.Router()

router.route('/:id/defaultSubjects').get(controller.getCourseDefaultSubjects)

export default router
