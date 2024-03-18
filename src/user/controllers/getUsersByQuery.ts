import { Request, Response } from 'express'
import prisma from '../../db'

const getUsersByQuery = async (req: Request, res: Response) => {
  // @ts-ignore
  const { user } = req
  const { sql } = req.query

  if (!user?.isAdmin)
    return res
      .status(401)
      .send({ title: 'Acesso Negado', message: 'Você não tem permissão para acessar essa funcionalidade' })

  if (!sql) return res.status(400).send({ title: 'Query inválida', message: 'Por favor, insira uma query válida' })

  try {
    const users = await prisma.$queryRawUnsafe(sql.toString())

    res.send({ users })
  } catch (error: any) {
    console.error(`[ERROR] [User Get Users By Query] Unexpected Get Users By Query: ${error.message}`)
    res.status(500).send({
      title: 'Erro Inesperado',
      message: `Erro inesperado ao buscar usuários: ${error.message}`,
    })
  }
}

export default getUsersByQuery
