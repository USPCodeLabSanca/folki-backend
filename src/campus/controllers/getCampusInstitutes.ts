import { Request, Response } from 'express'
import prisma from '../../db'

const getCampusInstitutes = async (req: Request, res: Response) => {
  const { id } = req.params
  try {
    const campus = await prisma.campus.findUnique({ where: { id: Number(id) } })

    if (!campus) return res.status(404).send({ error: 'Campus not found' })

    const institutes = await prisma.institute.findMany({ where: { campusId: Number(id), isVisible: true } })
    return res.send(institutes)
  } catch (error) {
    res.status(500).send({ error: 'Error getting institutes of campus' })
  }
}

export { getCampusInstitutes }
