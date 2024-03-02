import { Request, Response } from 'express'
import prisma from '../../db'
import mixpanel from '../../utils/mixpanel'

const updateMe = async (req: Request, res: Response) => {
  // @ts-ignore
  const { user, body } = req

  delete body.email
  delete body.id
  delete body.securePin
  delete body.isAdmin

  try {
    const updatedUser = await prisma.user.update({ where: { id: user!.id }, data: body })

    // @ts-ignore
    delete updatedUser.securePin

    mixpanel.track('Update User', {
      // @ts-ignore
      distinct_id: req.user!.email,
    })

    res.send({ user: updatedUser })
  } catch (error: any) {
    console.error(`[ERROR] [User Update Me] Unexpected User Update: ${error.message}`)
    res.status(500).send({
      title: 'Erro Inesperado',
      message: 'Erro inesperado ao atualizar usuário - Tente novamente mais tarde',
    })
  }
}

export default updateMe
