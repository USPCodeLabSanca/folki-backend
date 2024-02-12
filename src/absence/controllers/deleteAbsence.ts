import { Request, Response } from 'express'
import prisma from '../../db'

const deleteAbsence = async (req: Request, res: Response) => {
  // @ts-ignore
  const { user, params } = req
  const { id } = params

  try {
    const absence = await prisma.user_absence.findUnique({ where: { id: Number(id) } })

    if (!absence) return res.status(400).send({ title: 'Falta não encontrada', message: 'Falta não encontrada' })

    if (absence.userId !== user!.id)
      return res
        .status(403)
        .send({ title: 'Permissão negada', message: 'Você não tem permissão para deletar essa falta' })

    await prisma.user_absence.delete({ where: { id: Number(id) } })
    res.send({ succesful: true })
  } catch (error: any) {
    console.error(`[ERROR] [Delete Absence] Unexpected Error: ${error.message}`)
    res
      .status(500)
      .send({ title: 'Erro inesperado', message: 'Erro inesperado ao deletar falta - Tente novamente depois' })
  }
}

export { deleteAbsence }
