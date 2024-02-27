import { Request, Response } from 'express'
import prisma from '../../db'
import { searchSubjects } from '../services/searchSubjects'
import { orderSubjectsByPreferenceCampus } from '../services/orderSubjectsByPreferenceCampus'
import { Subject } from '../subject.entity'
import { orderSubjectsByPreferenceInstitute } from '../services/orderSubjectsByPreferenceInstitute'

const getSubjects = async (req: Request, res: Response) => {
  const { search, preferenceCampus, preferenceInstitute } = req.query

  try {
    let subjects: Subject[] = []

    if (search) {
      subjects = await searchSubjects(String(search))
    } else {
      subjects = await prisma.subject.findMany({ include: { subjectClass: true, institute: true } })
    }

    if (preferenceCampus) {
      subjects = await orderSubjectsByPreferenceCampus(subjects, Number(preferenceCampus))
    }

    if (preferenceInstitute) {
      subjects = await orderSubjectsByPreferenceInstitute(subjects, Number(preferenceInstitute))
    }

    return res.send(subjects)
  } catch (error) {
    res.status(500).send({ error: 'Error getting subjects' })
  }
}

export { getSubjects }
