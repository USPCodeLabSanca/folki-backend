import { Request, Response } from 'express'

import { getScrapJupiter } from '../services/scrapJupiter'
import createToken from '../../utils/createToken'
import { accessUFSCarSigaa } from '../services/accessUFSCarSigaa'

const VALID_UNIVERSITY_IDS = [1, 2]

const authFromJupiter = async (req: Request, res: Response) => {
  const { uspCode, password } = req.body
  const universityId = req.body.universityId || 1

  if (VALID_UNIVERSITY_IDS.indexOf(universityId) === -1)
    return res.status(400).send({ title: 'Erro interno', message: 'Universidade não encontrada' })

  try {
    const user =
      universityId === 1 ? await getScrapJupiter(uspCode, password) : await accessUFSCarSigaa(uspCode, password)
    const token = createToken(user.id, user.securePin!)

    // @ts-ignore
    delete user.securePin

    return res.send({ token, user })
  } catch (error: any) {
    if (
      error.message ===
        "Waiting for selector `a[href='gradeHoraria?codmnu=4759']` failed: Waiting failed: 5000ms exceeded" ||
      error.message === 'Invalid credentials'
    ) {
      return res.status(401).send({
        title: 'Credenciais Inválidas',
        message: 'Credenciais inválidas - Verifique seu usuário e senha e tente novamente',
      })
    }

    if (error.message.includes('Waiting failed: 30000ms exceeded'))
      return res.status(400).send({
        title: 'Ei, tente novamente mais tarde!',
        message:
          'Esse é um erro de comunicação com o sistema da universidade! Entre em comunicação com yfaria@usp.br para reportar o erro.',
      })
    
    console.log(error.message, error.message.includes('Navigation timeout')) 

    if (error.message.includes('Navigation timeout'))
      return res.status(400).send({
        title: 'Ei, tente novamente mais tarde!',
        message:
          'Esse é um erro de comunicação com o sistema da universidade! O JupiterWeb pode estar offline. Tente novamente mais tarde.',
      })
    
    console.error(`[ERROR] [Auth] Unexpected User Get: ${error.message}`)
    res.status(500).send({
      title: 'Erro Inesperado',
      message: 'Erro inesperado ao obter disiciplinas do usuário - Tente novamente mais tarde',
    })
  }
}

export { authFromJupiter }
