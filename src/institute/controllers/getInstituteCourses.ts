import { Request, Response } from 'express'
import prisma from '../../db'

const getInstituteCourses = async (req: Request, res: Response) => {
  const { id } = req.params

  try {
    const institute = await prisma.institute.findUnique({ where: { id: Number(id) } })

    if (!institute) return res.status(404).send({ error: 'Institute not found' })

    const courses = await prisma.course.findMany({
      where: { instituteId: Number(id) },
    })

    return res.send(courses)
  } catch (error) {
    res.status(500).send({ error: 'Error getting all courses of institute' })
  }
}

export { getInstituteCourses }
