import { Request, Response } from 'express'
import prisma from '../../db'

const getDriveItems = async (req: Request, res: Response) => {
  const { id } = req.params

  try {
    const driveItems = await prisma.drive_item.findMany({
      where: { subjectId: Number(id), approved: true },
    })

    return res.send({ driveItems })
  } catch (error: any) {
    console.error(`[ERROR] [Get Drive Items] Unexpected Error: ${error.message}`)
    res.status(500).send({
      title: 'Erro inesperado',
      message: 'Erro inesperado ao obter itens do drive - Tente novamente mais tarde',
    })
  }
}

export { getDriveItems }
