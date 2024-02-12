import express from 'express'
import controller from './absence.controller'
import auth from '../middleware/auth'

const router = express.Router()

router.route('/:id').all(auth).delete(controller.deleteAbsence)

export default router
