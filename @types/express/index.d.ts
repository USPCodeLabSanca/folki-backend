import { user } from '@prisma/client'
import express from 'express'

declare global {
  namespace Express {
    interface Request {
      user?: user
    }
  }
}
