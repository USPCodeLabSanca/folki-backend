import express from 'express'
import campusesRouter from '../campus/campus.router'
import institutesRouter from '../institute/institute.router'
import coursesRouter from '../course/course.router'
import subjectsRouter from '../subject/subject.router'

const router = express.Router()

router.use('/campuses', campusesRouter)
router.use('/institutes', institutesRouter)
router.use('/courses', coursesRouter)
router.use('/subjects', subjectsRouter)

export default router
