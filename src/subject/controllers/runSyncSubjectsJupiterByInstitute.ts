import { Request, Response } from 'express'

import { Queue } from 'bullmq'
import redisSettings from '../../settings/redis'
import prisma from '../../db'

const myQueue = new Queue('SyncSubjectsJupiter', {
  connection: {
    host: redisSettings.redisHost,
    port: redisSettings.redisPort,
  },
})

const runSyncSubjectsJupiterByInstitute = async (req: Request, res: Response) => {
  let { instituteIds } = req.body
  const { all } = req.query

  if (all) {
    const institutes = await prisma.institute.findMany()
    instituteIds = institutes.map((institute) => institute.id)
  }

  if (!instituteIds) return res.status(400).send({ error: 'Missing instituteIds param' })

  instituteIds.forEach(async (instituteId: Number) => await myQueue.add('SyncSubjectsJupiter', { instituteId }))

  return res.send(true)
}

export { runSyncSubjectsJupiterByInstitute }
