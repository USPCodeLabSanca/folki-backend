import { Request, Response } from 'express'
import prisma from '../../db'
import { Subject } from '../subject.entity'

const getSubjects = async (req: Request, res: Response) => {
  const { search, preferenceCampus, preferenceInstitute } = req.query

  try {
    let subjects: Subject[] = []

    subjects = await prisma.subject.findMany({ include: { subjectClass: true } })

    return res.send(subjects)
  } catch (error) {
    res.status(500).send({ error: 'Error getting subjects' })
  }
}

export { getSubjects }
