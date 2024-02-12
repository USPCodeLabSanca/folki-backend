import { Request, Response } from 'express'
import prisma from '../../db'

const getGroupsByCampusAndTags = async (req: Request, res: Response) => {
  const { campusId, tags } = req.query

  if (!campusId) {
    return res.status(400).send({ title: 'Dados inválidos', message: 'É necessário enviar o campus' })
  }

  try {
    let groups = []
    if (tags) {
      groups = await prisma.group.findMany({
        include: { tags: true, links: true },
        where: {
          campuses: {
            some: {
              id: Number(campusId),
            },
          },
          tags: {
            some: {
              id: {
                in: tags
                  ? String(tags)
                      .split(',')
                      .map((tag: string) => Number(tag))
                  : [],
              },
            },
          },
        },
      })
    } else {
      groups = await prisma.group.findMany({
        include: { tags: true, links: true },
        where: {
          campuses: {
            some: {
              id: Number(campusId),
            },
          },
        },
      })
    }
    return res.send({ groups })
  } catch (error: any) {
    console.error(`[ERROR] [Get Groups By Campus and Tags] Unexpected Error: ${error.message}`)
    res.status(500).send({
      title: 'Erro inesperado',
      message: 'Erro inesperado ao obter grupos - Tente novamente mais tarde',
    })
  }
}

export { getGroupsByCampusAndTags }
