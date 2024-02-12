import { Request, Response } from 'express'
import prisma from '../../db'

const removeDriveItem = async (req: Request, res: Response) => {
  // @ts-ignore
  const { user, params } = req
  const { id } = params

  if (!user?.isAdmin)
    return res
      .status(401)
      .send({ title: 'Não autorizado', message: 'Você não tem permissão para deletar itens do drive' })

  try {
    const driveItem = await prisma.drive_item.findUnique({ where: { id: Number(id) } })

    if (!driveItem) return res.status(404).send({ title: 'Item não encontrado', message: 'Item não encontrado' })

    if (driveItem.approved) {
      await prisma.$transaction([
        prisma.drive_item.delete({
          where: { id: Number(id) },
        }),
        prisma.subject.update({
          where: { id: Number(driveItem.subjectId) },
          data: { driveItemsNumber: { decrement: 1 } },
        }),
      ])
    } else {
      await prisma.drive_item.delete({
        where: { id: Number(id) },
      })
    }

    res.send({ succesful: true })
  } catch (error: any) {
    console.error(`[ERROR] [Delete Drive Item] Unexpected Error: ${error.message}`)
    res.status(500).send({
      title: 'Erro inesperado',
      message: 'Erro inesperado ao deletar item do drive - Tente novamente mais tarde',
    })
  }
}

export { removeDriveItem }
