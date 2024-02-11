import AWS from 'aws-sdk'

const SES = new AWS.SES({
  accessKeyId: process.env.AWS_SES_ID,
  secretAccessKey: process.env.AWS_SES_KEY,
  region: 'sa-east-1',
})

async function sendEmail(email: string, authCode: string) {
  const from = 'Yuri, do Folki <yuri@folki.com.br>'

  const params = {
    Destination: {
      ToAddresses: [email],
    },
    Message: {
      Body: {
        Html: {
          Charset: 'UTF-8',
          Data: `<p>Olá! Seu código de verificação é: <strong>${authCode}</strong></p>`,
        },
      },
      Subject: {
        Charset: 'UTF-8',
        Data: 'Email de Verificação do Folki',
      },
    },
    Source: from,
  }

  try {
    await SES.sendEmail(params).promise()
  } catch (error) {
    throw error
  }
}

export { sendEmail }
