// Run this script to launch the server.
// The server should run on localhost port 8000.
// This is where you should start writing server-side code for this application.
const express = require('express')
const mongoose = require('mongoose')
const Questions = require('./models/questions')
const Answers = require('./models/answers') // eslint-disable-line no-unused-vars
const Tags = require('./models/tags')

// Create a new Express app
const app = express()
app.use(express.json())

app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', 'http://localhost:3000')
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept'
  )
  next()
})

app.get('/', (req, res) => {
  res.send('Hello, world!')
})

app.get('/questions', async (req, res) => {
  try {
    const posts = await Questions.find()
    res.json(posts)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

app.post('/questions', async (req, res) => {
  console.log('Question POST request received')
  const question = new Questions({
    title: req.body.title,
    text: req.body.text,
    tags: req.body.tags,
    asked_by: req.body.user,
    ask_date_time: Date.now()
  })
  console.log(question)
  try {
    const newQuestion = await question.save()
    res.status(201).json(newQuestion)
  } catch (err) {
    console.log(err)
    res.status(400).json({ message: err.message })
  }
})

app.post('/answers', async (req, res) => {
  console.log('Answer POST request received')
  const answer = new Answers({
    text: req.body.text,
    ans_by: req.body.ans_by,
    ans_date_time: Date.now()
  })
  console.log(answer)
  try {
    const newAnswer = await answer.save()
    res.status(201).json(newAnswer._id)
  } catch (err) {
    console.log(err)
    res.status(400).json({ message: err.message })
  }
})

app.post('/questions/:qid/views', async (req, res) => {
  console.log('Answer VIEW POST request received')
  const question = await Questions.findById(req.params.qid)
  question.views += 1
  try {
    const newQuestion = await question.save()
    res.status(201).json(newQuestion)
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
})

app.post('/questions/:qid/removeviews', async (req, res) => {
  console.log('Answer VIEW POST request received')
  const question = await Questions.findById(req.params.qid)
  question.views -= 1
  try {
    const newQuestion = await question.save()
    res.status(201).json(newQuestion)
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
})

app.post('/questions/:qid/answers', async (req, res) => {
  console.log('Question update answer POST request received')
  const question = await Questions.findById(req.params.qid)
  question.answers.push(req.body.aid)
  try {
    const newQuestion = await question.save()
    res.status(201).json(newQuestion)
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
})

app.get('/questions/:questionId', async (req, res) => {
  console.log('Question/:questionId GET request received')
  try {
    const question = await Questions.findById(req.params.questionId)
    res.json(question)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

app.get('/tags/:tagId', async (req, res) => {
  console.log('Tag/:tagId GET request received')
  try {
    const tag = await Tags.findById(req.params.tagId)
    res.json(tag)
  } catch (err) {
    console.log(err)
    res.status(500).json({ message: err.message })
  }
})

app.get('/tagNames/:tagName', async (req, res) => {
  console.log('Tag/:tagName GET request received')
  try {
    const tag = await Tags.find({ name: req.params.tagName })
    res.json(tag)
  } catch (err) {
    console.log(err)
    res.status(500).json({ message: err.message })
  }
})

app.get('/tags', async (req, res) => {
  console.log('Tag GET request received')
  try {
    const tags = await Tags.find()
    res.json(tags)
  } catch (err) {
    console.log(err)
    res.status(500).json({ message: err.message })
  }
})

app.post('/tags', async (req, res) => {
  console.log('Tag POST request received')
  const tag = new Tags({
    name: req.body.name
  })
  try {
    const newTag = await tag.save()
    res.status(201).json(newTag)
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
})

app.get('/answers', async (req, res) => {
  try {
    const answers = await Answers.find()
    res.json(answers)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

app.get('/answers/:answerId', async (req, res) => {
  console.log('Answer/:answerId GET request received')
  try {
    const answer = await Answers.findById(req.params.answerId)
    res.json(answer)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// Connect to the database
mongoose.connect('mongodb://127.0.0.1:27017/fake_so')
const db = mongoose.connection
db.on('error', console.error.bind(console, 'MongoDB connection error:'))

// Start the server and listen on port 8000
/* const server =  */app.listen(8000, () => {
  console.log('Server listening on https://localhost:8000')
})

// Handle server shutdown
process.on('SIGINT', () => {
  mongoose.connection.close(() => {
    console.log('Server closed. Database instance disconnected.')
    process.exit(0)
  })
})
