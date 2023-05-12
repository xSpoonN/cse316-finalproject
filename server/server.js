// Run this script to launch the server.
// The server should run on localhost port 8000.
// This is where you should start writing server-side code for this application.
const express = require('express')
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const session = require('express-session')
const Questions = require('./models/questions')
const Answers = require('./models/answers')
const Tags = require('./models/tags')
const Comments = require('./models/comments') // eslint-disable-line no-unused-vars
const Users = require('./models/users')

const saltRounds = 10

// Create a new Express app
const app = express()
app.use(express.json())

/* Session */
app.use(session({
  secret: 'hehexd',
  resave: false,
  saveUninitialized: false
}))

/* Allow Same Host */
app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', 'http://localhost:3000')
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept'
  )
  next()
})

/* Default Response */
app.get('/', (req, res) => {
  res.send('Hello, world!')
})

/* Get All Questions */
app.get('/questions', async (req, res) => {
  try {
    const posts = await Questions.find()
    res.json(posts)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

/* Add new Question */
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

/* Add view to Question */
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

/* Remove view from Question */
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

/* Add answer to Question */
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

/* Get Question by ID */
app.get('/questions/:questionId', async (req, res) => {
  console.log('Question/:questionId GET request received')
  try {
    const question = await Questions.findById(req.params.questionId)
    res.json(question)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

/* Add new Answer */
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

/* Get All Answers */
app.get('/answers', async (req, res) => {
  try {
    const answers = await Answers.find()
    res.json(answers)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

/* Get Answer by ID */
app.get('/answers/:answerId', async (req, res) => {
  console.log('Answer/:answerId GET request received')
  try {
    const answer = await Answers.findById(req.params.answerId)
    res.json(answer)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

/* Get tag by ID */
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

/* Get Tag by Name*/
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

/* Get All Tags */
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

/* Add new Tag */
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

/* Login User */
app.post('/userLogin', async (req, res) => {
  console.log('User GET login request received')
  try {
    const user = await Users.findOne({email: req.body.email})
    console.log(user);
    if (!user) {
      return res.status(400).json({ message: 'Cannot find user' })
    } else {
      bcrypt.compare(req.body.password, user.password, async function (err, result) {
        if (err) {
          return res.status(400).json({ message: err.message })
        } else if (result == true) {
          return res.status(200).json({ message: 'User logged in', token: hashUser })
        } else {
          return res.status(400).json({ message: 'Incorrect password' })
        }
      })
    }
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

/* Add User */
app.post('/users', async (req, res) => {
  console.log('User POST request received')
  bcrypt.hash(req.body.password, saltRounds, async function (err, hash) {
    if (err) return res.status(400).json({ message: err.message })
    const user = new Users({
      username: req.body.username,
      email: req.body.email,
      password: hash,
      created_date_time: Date.now()
    })
    try {
      const newUser = await user.save()
      res.status(201).json(newUser)
    } catch (err) {
      res.status(400).json({ message: err.message })
    }
  })
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
