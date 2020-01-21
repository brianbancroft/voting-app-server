import express from 'express'
import cors from 'cors'
import bodyParser from 'body-parser'

import HTTP from 'http'

import IO from 'socket.io'

const app = express()

// Open everything to cors
app.use(cors())

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

const server = HTTP.createServer(app)
const io = IO(server)
io.origins('*:*') // for latest version

const port = 4000

let questions = [
  {
    question: 'What is the best colour?',
    answers: ['Orange', 'Red', 'Aqua', 'Blue', 'Yellow', 'Mauve'],
  },
  {
    question: 'Who is the best super-hero',
    answers: [
      'Goku',
      'Superman',
      'Batman',
      'Spider Man',
      'Captain Marvel',
      'You',
    ],
  },
]

let votes = {}
let selectedQuestionIndex = null
let selectedVotingStage = 0

io.on('connection', client => {
  io.to(client.id).emit('initial-context', {
    selectedVotingStage,
    selectedQuestion:
      selectedQuestionIndex === null
        ? { question: '', answers: [] }
        : questions[selectedQuestionIndex],
    votes,
    selectedQuestionIndex,
  })

  client.on('set-active-question', data => {
    selectedQuestionIndex = data.questionIndex
    votes = {}

    const question = questions[selectedQuestionIndex]

    io.emit('change-question', question || { question: '', answers: [] })
  })

  client.on('set-voting-active', () => {
    io.emit('set-voting-active')
  })

  client.on('set-voting-disabled', () => {
    io.emit('set-voting-disabled')
  })

  client.on('set-voting-stage', (stage, somethingElse) => {
    selectedVotingStage = stage
    io.emit('set-voting-stage', stage)
  })

  client.on('admin-enter', () => {
    io.emit('admin-enter')
  })

  client.on('vote', index => {
    votes[index] = votes[index] ? votes[index] + 1 : 1
    io.emit('update-votes', votes)
  })
})

/*
 ! Retrieves poll questions and answer stored in local memory
*/
app.get('/poll', (req, res) => {
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
