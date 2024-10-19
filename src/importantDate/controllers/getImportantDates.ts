import { Request, Response } from 'express'
import prisma from '../../db'

const getImportantDates = async (req: Request, res: Response) => {
  try {
    // @ts-ignore
    const { user } = req
    const startOfYear = new Date(new Date().getFullYear(), 0, 1)
    const userInstitute = await prisma.institute.findUnique({ where: { id: user!.instituteId! } })
    const importantDates = await prisma.important_date.findMany({
      orderBy: { date: 'asc' },
      where: {
        date: { gte: startOfYear },
        AND: { OR: [{ campusId: null, universityId: user?.universityId }, { campusId: userInstitute?.campusId }] },
      },
    })

    return res.send({ importantDates })
  } catch (error: any) {
    console.error(`[ERROR] [Get Important Dates] Unexpected Error: ${error.message}`)
    res.status(500).send({
      title: 'Erro inesperado',
      message: 'Erro inesperado ao obter datas importantes - Tente novamente mais tarde',
    })
  }
}

export { getImportantDates }
