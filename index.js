import express from 'express'
import ExpressWs from 'express-ws'
import cors from 'cors'

const app = express()

const corsMiddleware = cors({
  origin: 'http://localhost:3000',
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization'],
  preflightContinue: false,
})

app.use(corsMiddleware)
const expresssWs = ExpressWs(app)
const port = 5000

const requestsArray = []

app.use((req, res, next) => {
  console.log('middleware')
  req.testing = 'testing'
  next()
})

app.ws('/echo', (ws, req) => {
  ws.on /
    ('message',
    msg => {
      console.log('Hi there we got a message?' + req)
      console.log('Message! ', msg)
      ws.send(msg)
    })
})

app.get('/results', (req, res) => {
  const response = `Number of hits to hello world: ${requestsArray.length}`

  res.status(200).send(response)
})

app.get('/', (req, res) => {
  requestsArray.push('item')
  res.status(200).send('Hello World!')
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))
