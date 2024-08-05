import { Request, Response } from 'express'

import { getScrapJupiter } from '../services/scrapJupiter'
import createToken from '../../utils/createToken'

const authFromJupiter = async (req: Request, res: Response) => {
  const { uspCode, password } = req.body

  try {
    const user = await getScrapJupiter(uspCode, password)
    const token = createToken(user.id, user.securePin!)

    // @ts-ignore
    delete user.securePin

    return res.send({ token, user })
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

    if (error.message === 'Email not found')
      return res.status(400).send({
        title: 'Login Inválido =/',
        message: 'Não foi possível fazer autenticação porque seu usuário não permite acessar seus dados de Email :|',
      })

    console.error(`[ERROR] [Get Subjects By Jupiter Web] Unexpected User Get: ${error.message}`)
    res.status(500).send({
      title: 'Erro Inesperado',
      message: 'Erro inesperado ao obter disiciplinas do usuário - Tente novamente mais tarde',
    })
  }
}

export { authFromJupiter }
