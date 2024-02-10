const redisUrl = process.env.REDIS_URL
const redisHost = process.env.REDIS_HOST
const redisPort = Number(process.env.REDIS_PORT)

const redisSettings = {
  redisUrl,
  redisHost,
  redisPort,
}

export default redisSettings
