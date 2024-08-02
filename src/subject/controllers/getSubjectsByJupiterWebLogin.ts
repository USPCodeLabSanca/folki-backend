import { Request, Response } from 'express'

import prisma from '../../db'
import { getScrapJupiter } from '../../user/services/scrapJupiter'

const getSubjectsByJupiterWebLogin = async (req: Request, res: Response) => {
  const { uspCode, password } = req.body

  try {
    const returnValue = await getScrapJupiter(uspCode, password)
    return res.send(returnValue)
  } catch (error: any) {
    if (
      error.message ===
      "Waiting for selector `a[href='gradeHoraria?codmnu=4759']` failed: Waiting failed: 5000ms exceeded"
    ) {
      return res.status(401).send({
        title: 'Credenciais Inválidas',
        message: 'Credenciais inválidas - Verifique seu número USP e senha e tente novamente',
      })
    }

    console.error(`[ERROR] [Get Subjects By Jupiter Web] Unexpected User Get: ${error.message}`)
    res.status(500).send({
      title: 'Erro Inesperado',
      message: 'Erro inesperado ao obter disiciplinas do usuário - Tente novamente mais tarde',
    })
  }
}

export { getSubjectsByJupiterWebLogin }
