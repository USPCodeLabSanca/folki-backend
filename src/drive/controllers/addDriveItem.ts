import { Request, Response } from 'express'
import prisma from '../../db'

const addDriveItem = async (req: Request, res: Response) => {
  // @ts-ignore
  const { user, body } = req

  if (!body) return res.status(400).send({ title: 'Requisição inválida', message: 'Dados inválidos' })

  if (!user?.isAdmin && body.approved === true)
    return res
      .status(401)
      .send({ title: 'Não autorizado', message: 'Você não tem permissão para aprovar itens do drive' })

  try {
    const driveItemData = {
      name: body.name,
      link: body.link,
      subjectId: body.subjectId,
      approved: body.approved,
    }

    const driveItem = await prisma.drive_item.create({
      data: driveItemData,
    })

    if (driveItemData.approved) {
      await prisma.subject.update({
        where: { id: driveItemData.subjectId },
        data: { driveItemsNumber: { increment: 1 } },
      })
    }

    res.send({ driveItem })
  } catch (error: any) {
    console.error(`[ERROR] [Create Drive Item] Unexpected Error: ${error.message}`)
    res.status(500).send({
      title: 'Erro inesperado',
      message: 'Erro inesperado ao criar item do drive - Tente novamente mais tarde',
    })
  }
}

export { addDriveItem }
