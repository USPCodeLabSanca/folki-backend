import express from 'express'

import campusesRouter from '../campus/campus.router'
import institutesRouter from '../institute/institute.router'
import coursesRouter from '../course/course.router'
import subjectsRouter from '../subject/subject.router'
import authRouter from '../auth/auth.router'
import usersRouter from '../user/user.router'

const router = express.Router()

router.use('/campuses', campusesRouter)
router.use('/institutes', institutesRouter)
router.use('/courses', coursesRouter)
router.use('/subjects', subjectsRouter)
router.use('/auth', authRouter)
router.use('/users', usersRouter)

export default router
