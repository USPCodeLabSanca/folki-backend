import { Request, Response } from 'express'
import prisma from '../../db'
import mixpanel from '../../utils/mixpanel'

const getGroup = async (req: Request, res: Response) => {
  const { id } = req.params

  try {
    const group = await prisma.group.findUnique({
      where: { id: Number(id) },
      include: { tags: true, links: true, campuses: true },
    })

    if (!group) return res.status(404).send({ title: 'Grupo não encontrado', message: 'Grupo não encontrado' })

    mixpanel.track('Get Group', {
      // @ts-ignore
      distinct_id: req.user!.email,
      groupId: group.id,
      groupName: group.name,
    })

    res.send({ group })
  } catch (error: any) {
    console.error(`[ERROR] [Get Group] Unexpected Error: ${error.message}`)
    res.status(500).send({
      title: 'Erro inesperado',
      message: 'Erro inesperado ao obter grupo - Tente novamente mais tarde',
    })
  }
}

export { getGroup }
