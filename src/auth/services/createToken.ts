import jwt from 'jsonwebtoken'

const createToken = (id: number, securePin: string) => {
  const token = jwt.sign({ id, securePin }, process.env.JWT_SECRET || 'secret')
  return token
}

export default createToken
