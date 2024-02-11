const verifyUSPEmail = (email: string) => {
  return email.endsWith('@usp.br')
}

export { verifyUSPEmail }
