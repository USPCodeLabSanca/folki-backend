import { Request, Response } from 'express'
import prisma from '../../db'

const getAllCampuses = async (req: Request, res: Response) => {
  try {
    const campuses = await prisma.campus.findMany()
    return res.send(campuses)
  } catch (error) {
    res.status(500).send({ error: 'Error getting all campuses' })
  }
}

export { getAllCampuses }
