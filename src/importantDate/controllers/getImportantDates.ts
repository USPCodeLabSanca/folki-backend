import { Request, Response } from 'express'
import prisma from '../../db'

const getImportantDates = async (req: Request, res: Response) => {
  try {
    const startOfYear = new Date(new Date().getFullYear(), 0, 1)
    const importantDates = await prisma.important_date.findMany({
      orderBy: { date: 'asc' },
      where: { date: { gte: startOfYear } },
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
