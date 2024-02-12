import { Request, Response } from 'express'
import prisma from '../../db'

const createGroup = async (req: Request, res: Response) => {
  // @ts-ignore
  const { user, body } = req

  if (!user?.isAdmin)
    return res.status(401).send({ title: 'Não autorizado', message: 'Você não tem permissão para criar grupos' })

  try {
    const groupData = {
      name: body.name,
      fullDescription: body.fullDescription,
      shortDescription: body.shortDescription,
      logo: body.logo,
      importanceWeight: body.importanceWeight,
    }

    const group = await prisma.group.create({
      data: {
        ...groupData,
        links: { create: body.links || [] },
        tags: {
          connect: [
            ...(body.tags || []).map((tagId: number) => ({
              id: tagId,
            })),
          ],
        },
        campuses: {
          connect: [
            ...(body.campuses || []).map((campusId: number) => ({
              id: campusId,
            })),
          ],
        },
      },
    })

    res.send({ group })
  } catch (error: any) {
    console.error(`[ERROR] [Create Group] Unexpected Error: ${error.message}`)
    res.status(500).send({
      title: 'Erro inesperado',
      message: 'Erro inesperado ao criar grupo - Tente novamente mais tarde',
    })
  }
}

export { createGroup }
