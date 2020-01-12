import express from 'express'
import cors from 'cors'

import HTTP from 'http'

import IO from 'socket.io'

const app = express()

const corsMiddleware = cors({
  origin: 'http://localhost:3000',
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization'],
  preflightContinue: false,
})

app.use(corsMiddleware)
const server = HTTP.createServer(app)
const io = IO.listen(server)
const port = 5000

const requestsArray = []

app.use((req, res, next) => {
  console.log('middleware')
  req.testing = 'testing'
  next()
})

// app.ws('/echo', (ws, req) => {
//   ws.on /
//     ('message',
//     msg => {
//       console.log('Hi there we got a message?' + req)
//       console.log('Message! ', msg)
//       ws.send(msg)
//     })
// })

io.on('connection', client => {
  console.log('client connected ')

  client.on('event', data => {
    console.log('event ', data)
    /* … */
  })

  client.on('message', data => {
    console.log('message ', data)
    io.emit('message', data)
  })

  client.on('disconnect', () => {
    console.log('client disconnected')
    /* … */
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

server.listen(port, () => console.log(`Example app listening on port ${port}!`))
