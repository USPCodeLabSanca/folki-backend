import express, { Express } from 'express'
import cors from 'cors'
import router from './router'
import startJobs from './jobs'

const app: Express = express()
const port = process.env.PORT || 3000

app.use(
  cors({
    origin: '*',
  }),
)
app.use(express.json())
app.use('/api/', router)

startJobs()

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`)
})
