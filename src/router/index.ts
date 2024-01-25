import express from 'express'
import campusesRouter from '../campus/campus.router'
import institutesRouter from '../institute/institute.router'
import coursesRouter from '../course/course.router'

const router = express.Router()

router.use('/campuses', campusesRouter)
router.use('/institutes', institutesRouter)
router.use('/courses', coursesRouter)

export default router
