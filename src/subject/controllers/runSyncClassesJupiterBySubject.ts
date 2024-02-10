import { Request, Response } from 'express'

import { Queue } from 'bullmq'
import redisSettings from '../../settings/redis'
import prisma from '../../db'

const myQueue = new Queue('SyncClassesJupiter', {
  connection: {
    host: redisSettings.redisHost,
    port: redisSettings.redisPort,
  },
  defaultJobOptions: {
    attempts: 4,
    backoff: {
      type: 'exponential',
      delay: 1000,
    },
  },
})

const runSyncClassesJupiterBySubject = async (req: Request, res: Response) => {
  let { subjectIds } = req.body
  const { all } = req.query

  if (all) {
    const subjects = await prisma.subject.findMany()
    subjectIds = subjects.map((subject) => subject.id)
  }

  if (!subjectIds) return res.status(400).send({ error: 'Missing subjectIds param' })

  subjectIds.forEach(async (subjectId: Number) => await myQueue.add('SyncClassesJupiter', { subjectId }))

  return res.send(true)
}

export { runSyncClassesJupiterBySubject }
