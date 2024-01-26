import express from 'express'
import controller from './institute.controller'

const router = express.Router()

router.route('/:id/courses').get(controller.getInstituteCourses)

export default router
