import { Request, Response } from 'express'
import prisma from '../../db'

const getCourseDefaultSubjects = async (req: Request, res: Response) => {
  const { id } = req.params
  const { period } = req.query

  if (!period) return res.status(400).send({ error: 'Period is required' })

  try {
    const course = await prisma.course.findUnique({ where: { id: Number(id) } })

    if (!course) return res.status(404).send({ error: 'Course not found' })

    const subjectsResult = await prisma.default_subject.findMany({
      where: { period: Number(period), courseId: Number(id) },
      include: { subject: { include: { subjectClass: true } } },
    })

    console.log(subjectsResult)

    const subjects = subjectsResult.map((subject) => subject.subject)

    return res.send(subjects)
  } catch (error) {
    res.status(500).send({ error: 'Error getting all default subjects of course' })
  }
}

export { getCourseDefaultSubjects }
