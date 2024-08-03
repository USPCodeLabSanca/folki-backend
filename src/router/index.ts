import express from 'express'

import campusesRouter from '../campus/campus.router'
import subjectsRouter from '../subject/subject.router'
import usersRouter from '../user/user.router'
import absencesRouter from '../absence/absence.router'
import activitiesRouter from '../activity/activity.router'
import groupsRouter from '../group/group.router'
import gradesRouter from '../grade/grade.router'
import importantDatesRouter from '../importantDate/importantDate.router'

const router = express.Router()

router.use('/campuses', campusesRouter)
router.use('/subjects', subjectsRouter)
router.use('/users', usersRouter)
router.use('/absences', absencesRouter)
router.use('/activities', activitiesRouter)
router.use('/groups', groupsRouter)
router.use('/grades', gradesRouter)
router.use('/important-dates', importantDatesRouter)

export default router
