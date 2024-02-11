import { Request, Response } from 'express'
import prisma from '../../db'

const getMeSubjects = async (req: Request, res: Response) => {
  // @ts-ignore
  const { user, body } = req

  delete body.email
  delete body.id
  delete body.securePin

  try {
    const userSubjects = await prisma.user_subject.findMany({ where: { userId: user!.id } })
    res.send({ userSubjects })
  } catch (error: any) {
    console.error(`[ERROR] [User Get Me Subjects] Unexpected User Get: ${error.message}`)
    res.status(500).send({
      title: 'Erro Inesperado',
      message: 'Erro inesperado ao obter disiciplinas do usuário - Tente novamente mais tarde',
    })
  }
}

export default getMeSubjects
