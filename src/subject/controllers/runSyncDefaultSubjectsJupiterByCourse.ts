import { Request, Response } from 'express'

import { Queue } from 'bullmq'
import redisSettings from '../../settings/redis'
import prisma from '../../db'

const myQueue = new Queue('SyncDefaultSubjectsJupiter', {
  connection: {
    host: redisSettings.redisHost,
    port: redisSettings.redisPort,
  },
})

const runSyncDefaultSubjectsJupiterByCourse = async (req: Request, res: Response) => {
  let { courseIds } = req.body
  const { all } = req.query

  if (all) {
    const courses = await prisma.course.findMany()
    courseIds = courses.map((course) => course.id)
  }

  if (!courseIds) return res.status(400).send({ error: 'Missing courseIds param' })

  courseIds.forEach(async (courseId: Number) => await myQueue.add('SyncDefaultSubjectsJupiter', { courseId }))

  return res.send(true)
}

export { runSyncDefaultSubjectsJupiterByCourse }
