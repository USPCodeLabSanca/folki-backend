import express from 'express'
import controller from './grade.controller'
import auth from '../middleware/auth'

const router = express.Router()

router.route('').all(auth).post(controller.post)
router.route('/:id').all(auth).delete(controller.deleteGrade)

export default router
