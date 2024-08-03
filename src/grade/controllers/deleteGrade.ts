import { Request, Response } from 'express'
import prisma from '../../db'
import mixpanel from '../../utils/mixpanel'

const deleteGrade = async (req: Request, res: Response) => {
  // @ts-ignore
  const { user, params } = req
  const { id } = params

  try {
    const grade = await prisma.grade.findUnique({ where: { id: Number(id) } })

    if (!grade) return res.status(400).send({ title: 'Nota não encontrada', message: 'Nota não encontrada' })

    const userSubject = await prisma.user_subject.findFirst({
      where: { userId: user!.id, id: grade.userSubjectId },
    })

    if (!userSubject)
      return res.status(404).send({ title: 'Matéria não encontrada', message: 'Matéria não encontrada' })

    if (userSubject.userId !== user!.id)
      return res
        .status(403)
        .send({ title: 'Permissão negada', message: 'Você não tem permissão para deletar essa NOTA' })

    await prisma.grade.delete({ where: { id: Number(id) } })

    await prisma.user_subject.update({
      where: { id: grade.userSubjectId },
      data: { grading: { decrement: grade.value * (grade.percentage / 100) } },
    })

    mixpanel.track('Delete Grade', {
      // @ts-ignore
      distinct_id: req.user!.email,
      grade,
    })

    res.send({ succesful: true })
  } catch (error: any) {
    console.error(`[ERROR] [Delete Grade] Unexpected Error: ${error.message}`)
    res
      .status(500)
      .send({ title: 'Erro inesperado', message: 'Erro inesperado ao deletar nota - Tente novamente mais tarde' })
  }
}

export { deleteGrade }
