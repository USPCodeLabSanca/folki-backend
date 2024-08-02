import { Request, Response } from 'express'
import prisma from '../../db'

const createImportantDate = async (req: Request, res: Response) => {
  // @ts-ignore
  const { user, body } = req

  if (!user?.isAdmin)
    return res.status(401).send({ title: 'Não autorizado', message: 'Você não tem permissão para criar grupos' })

  try {
    const importDate = await prisma.important_date.create({ data: { ...body } })
    res.send({ importDate })
  } catch (error: any) {
    console.error(`[ERROR] [Create Important Date] Unexpected Error: ${error.message}`)
    res.status(500).send({
      title: 'Erro inesperado',
      message: 'Erro inesperado ao criar data importante - Tente novamente mais tarde',
    })
  }
}

export { createImportantDate }
