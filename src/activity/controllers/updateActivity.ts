import { Request, Response } from 'express'
import prisma from '../../db'

const updateActivity = async (req: Request, res: Response) => {
  // @ts-ignore
  const { user, body } = req
  const { id } = req.params

  delete body.userId

  try {
    const activity = await prisma.activity.findUnique({ where: { id: Number(id) } })

    if (!activity)
      return res.status(400).send({ title: 'Atividade não encontrada', message: 'Atividade não encontrada' })

    const isUserInTheActivitySubjectClass = await prisma.user_subject.findFirst({
      where: { userId: user!.id, subjectClassId: activity.subjectClassId },
    })

    if (!isUserInTheActivitySubjectClass)
      return res
        .status(403)
        .send({ title: 'Permissão negada', message: 'Você não tem permissão para atualizar essa atividade' })

    await prisma.activity.update({ where: { id: Number(id) }, data: { ...body } })

    if (body.completed) {
      await prisma.activity.update({ where: { id: Number(id) }, data: { completedAt: new Date() } })
    }

    res.send({ succesful: true })
  } catch (error: any) {
    console.error(`[ERROR] [Update Activity] Unexpected Error: ${error.message}`)
    res.status(500).send({
      title: 'Erro inesperado',
      message: 'Erro inesperado ao atualizar atividade - Tente novamente mais tarde',
    })
  }
}

export { updateActivity }
