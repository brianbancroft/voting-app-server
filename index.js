import express from 'express'
import cors from 'cors'
import bodyParser from 'body-parser'

import HTTP from 'http'

import IO from 'socket.io'

const app = express()
app.use(cors())

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

// app.use(function(req, res, next) {
//   res.header('Access-Control-Allow-Origin', '*')
//   res.header(
//     'Access-Control-Allow-Headers',
//     'Origin, X-Requested-With, Content-Type, Accept',
//   )
//   next()
// })

const server = HTTP.createServer(app)
const io = IO(server)
io.origins('*:*') // for latest version

const port = 4000

let questions = [
  {
    question: 'Superman or Batman',
    answers: ['Superman', 'Batman'],
  },
]

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

/*
 ! Retrieves poll questions and answer stored in local memory
*/
app.get('/poll', (req, res) => {
  console.log('Questions endpoint triggered')
  res.status(200).send(questions)
})

/*
  ! Replaces poll questions and answers stored in local memory
*/
app.post('/poll', (req, res) => {
  const data = req.body

  if (
    Array.isArray(data) &&
    (data.length === 0 ||
      (data[0]['question'] &&
        typeof data[0].question === 'string' &&
        Array.isArray(data[0].answers)))
  )
    questions = data
  res.status(200).send('ok')
})

app.get('/', (req, res) => {
  res.status(200).send('ok')
})

server.listen(port, () => console.log(`Example app listening on port ${port}!`))
