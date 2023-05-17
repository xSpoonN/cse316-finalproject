// Run this script to launch the server.
// The server should run on localhost port 8000.
// This is where you should start writing server-side code for this application.
const express = require('express')
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const Questions = require('./models/questions')
const Answers = require('./models/answers')
const Tags = require('./models/tags')
const Comments = require('./models/comments')
const Users = require('./models/users')

const saltRounds = 10
const secretKey = 'hehexdd'

// Create a new Express app
const app = express()
app.use(express.json())

/* Session */

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

/* Get All Questions by Email */
app.get('/questionEmail/:email', async (req, res) => {
  try {
    const posts = await Questions.find({asked_by_email: req.params.email})
    res.json(posts)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

/* Get all questions answered by user with specified email */
app.get('/questionsAnsweredBy/:email', async (req, res) => {
  console.log('Questions Answered By GET request received')
  try {
    const user = await Users.findOne({ email: req.params.email }).exec()
    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    const questions = await Questions.find({}).populate({
      path: 'answers',
      match: { ans_by_email: user.email }
    }).exec()

    const answeredQuestions = questions.filter(question => question.answers.length > 0)

    res.json(answeredQuestions)
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Error retrieving questions', error: err.message })
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
    asked_by_email: req.body.email,
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

/* Edit a question */
app.post('/editquestion/:qid', async (req, res) => {
  console.log('Question PUT request received')
  try {
    const question = await Questions.findById(req.params.qid)
    if (!question) {
      return res.status(404).json({ message: 'Question not found' })
    }
    question.title = req.body.title
    question.text = req.body.text
    question.tags = req.body.tags
    const updatedQuestion = await question.save()
    res.json(updatedQuestion)
  } catch (err) {
    console.log(err)
    res.status(400).json({ message: err.message })
  }
})

/* Delete a question */
app.post('/deletequestion/:qid', async (req, res) => {
  console.log('Question DELETE request received')
  try {
    const deletedQuestion = await Questions.findByIdAndRemove(req.params.qid)
    if (!deletedQuestion) {
      return res.status(404).json({ message: 'Question not found' })
    }

    // Delete associated answers
    const answerIds = deletedQuestion.answers
    const commentIds = await Answers.distinct('comments', { _id: { $in: answerIds } })
    await Comments.deleteMany({ _id: { $in: commentIds } })
    await Answers.deleteMany({ _id: { $in: answerIds } })

    res.json({ message: 'Question deleted' })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Server error' })
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
    ans_date_time: Date.now(),
    ans_by_email: req.body.email
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

/* Edit Answer */
app.post('/editanswer/:aid', async (req, res) => {
  console.log('Answer EDIT request received')
  const aid = req.params.aid
  const text = req.body.text

  try {
    const updatedAnswer = await Answers.findByIdAndUpdate(
      aid,
      { text },
      { new: true }
    )

    if (!updatedAnswer) {
      return res.status(404).json({ message: 'Answer not found' })
    }

    res.json({ message: 'Answer updated', updatedAnswer })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Server error' })
  }
})

app.post('/deleteanswer/:aid', async (req, res) => {
  console.log('Answer DELETE request received')
  const aid = req.params.aid

  try {
    // Find the answer to be deleted
    const answer = await Answers.findById(aid)

    if (!answer) {
      return res.status(404).json({ message: 'Answer not found' })
    }

    // Delete the associated comments
    await Comments.deleteMany({ _id: { $in: answer.comments } })

    // Delete the answer from questions.answers array
    await Questions.updateMany({}, { $pull: { answers: aid } })

    // Delete the answer
    await answer.deleteOne()

    res.json({ message: 'Answer deleted' })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Server error' })
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
  /* console.log('Tag/:tagId GET request received') */
  try {
    const tag = await Tags.findById(req.params.tagId)
    res.json(tag)
  } catch (err) {
    console.log(err)
    res.status(500).json({ message: err.message })
  }
})

/* Get tags by User Email */
app.get('/tagsby/:email', async (req, res) => {
  console.log('Tags by Email GET request received')
  try {
    const user = await Users.findOne({ email: req.params.email })
    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    const tags = await Tags.find({ createdBy: user._id })
    res.json(tags)
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Error retrieving tags', error: err.message })
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
    name: req.body.name,
    createdBy: req.body.creator
  })
  try {
    const newTag = await tag.save()
    res.status(201).json(newTag)
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
})

/* Rename a Tag */
app.post('/renameTag/:tagId', async (req, res) => {
  console.log('Tag PUT request received')
  try {
    const tag = await Tags.findByIdAndUpdate(req.params.tagId, { name: req.body.name })
    if (!tag) {
      return res.status(404).json({ message: 'Tag not found' })
    }
    res.json(tag)
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
})

/* Remove a Tag */
app.post('/removeTag/:tagId', async (req, res) => {
  console.log('Tag DELETE request received')
  try {
    const deletedTag = await Tags.findByIdAndRemove(req.params.tagId)
    if (!deletedTag) {
      return res.status(404).json({ message: 'Tag not found' })
    }
    // Remove the tag from the questions
    await Questions.updateMany(
      { tags: req.params.tagId },
      { $pull: { tags: req.params.tagId } }
    )
    res.json({ message: 'Tag deleted' })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Server error' })
  }
})


/* Login User */
app.post('/userLogin', async (req, res) => {
  console.log('User GET login request received')
  try {
    const user = await Users.findOne({email: req.body.email})
    console.log(user)
    if (!user) {
      return res.status(400).json({ message: 'Cannot find user' })
    } else {
      bcrypt.compare(req.body.password, user.password, async function (err, result) {
        if (err) {
          return res.status(400).json({ message: err.message })
        } else if (result == true) {
          const token = jwt.sign({ email: user.email }, secretKey, { expiresIn: '1h' })
          return res.status(200).json({ message: 'User logged in', user: user, token: token })
        } else {
          return res.status(400).json({ message: 'Incorrect password' })
        }
      })
    }
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

app.post('/auth', async (req, res) => {
  console.log('User AUTH request received')
  console.log(req.body.token)
  try {
    const token = req.body.token
    const decoded = jwt.verify(token, secretKey)
    console.log(decoded)
    const user = await Users.findOne({ email: decoded.email })
    if (!user) {
      return res.status(400).json({ message: 'Cannot find user' })
    } else {
      console.log(user)
      return res.status(200).json({ message: 'User logged in', user: user, email: decoded.email })
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

/* Delete User */
app.post('/deluser/:id', async (req, res) => {
  console.log('User DELETE request received')
  try {
    const userId = req.params.id

    // Remove user
    const deletedUser = await Users.findById(userId)
    if (!deletedUser) {
      return res.status(404).json({ message: 'User not found' })
    }
    
    // Remove user's questions
    const questions = await Questions.find({ asked_by_email: deletedUser.email })
    for (const question of questions) {
      // Remove question's answers
      const answers = await Answers.find({ _id: { $in: question.answers } })
      for (const answer of answers) {
        // Remove answer's comments
        const answerComments = await Comments.find({ _id: { $in: answer.comments } })
        for (const comment of answerComments) {
          await comment.deleteOne()
        }
      }
      // Remove question's answers
      await Answers.deleteMany({ _id: { $in: question.answers } })
      // Remove question
      await question.deleteOne()
    }
    
    // Remove user's answers
    const answers = await Answers.find({ ans_by_email: deletedUser.email })
    for (const answer of answers) {
      // Remove answer's comments
      const answerComments = await Comments.find({ _id: { $in: answer.comments } })
      for (const comment of answerComments) {
        await comment.deleteOne()
      }
      // Remove answer
      await answer.deleteOne()
    }

    // Remove user's comments
    await Comments.deleteMany({ cum_by: deletedUser.username }) // update comments to store user id instead of username

    await deletedUser.deleteOne()
    
    res.json({ message: 'User and associated data deleted' })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Server error' })
  }
})

/* Get User by Email */
app.get('/users/:email', async (req, res) => {
  console.log('User GET request received')
  try {
    const user = await Users.findOne({email: req.params.email})
    // console.log(user)
    res.status(201).json(user)
  }
  catch (err) {
    res.status(500).json({ message: err.message })
  }
})

/* Get Users */
app.get('/users', async (req, res) => {
  console.log('Users GET request received')
  try {
    const users = await Users.find()
    res.status(201).json(users)
  }
  catch (err) {
    res.status(500).json({ message: err.message })
  }
})

/* Get Comments by Answer ID */
app.get('/comments/:aid', async (req, res) => {
  console.log('Comments GET request received')
  try {
    /* const comments = await Comments.find({ans_id: req.params.aid}) */
    const ans = await Answers.findById(req.params.aid)
    res.json(ans.comments)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

/* Get Comment by ID */
app.get('/comment/:cid', async (req, res) => {
  console.log('Comment GET request received')
  try {
    const comment = await Comments.findById(req.params.cid)
    res.json(comment)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

/* Add new Comment */
app.post('/comments', async (req, res) => {
  console.log('Comment POST request received')
  console.log(req.body)
  const user = await Users.findOne({email: req.body.user})
  if (!user || user?.reputation < 50) return res.status(400).json({ ...req.body, err: 'Your reputation is too low' })
  const comment = new Comments({
    text: req.body.text,
    ans_id: req.body.aid,
    cum_by: req.body.user,
    cum_date_time: Date.now()
  })
  try {
    const newComment = await comment.save()
    await Answers.findOneAndUpdate(
      {_id: req.body.aid},
      {$push: {comments: newComment._id}}
    )
    res.status(201).json(newComment)
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
})

/* Modify the rep of something */
app.post('/rep', async (req, res) => {
  console.log('Rep POST request received')
  try {
    console.log('reqbody: ', req.body)
    let updated, user
    const rep = req.body.rep

    const reqUser = await Users.findOne({email: req.body.email})
    if (req.body.type == 'answer' || req.body.type == 'question') {
      updated = await (req.body.type == 'answer' ? Answers : Questions).findOne({_id: req.body.id})
      console.log(updated)
      user = await Users.findOne({email: updated[req.body.type == 'answer' ? 'ans_by_email' : 'asked_by_email']})
      console.log(user)
      if (reqUser.reputation < 50 && !reqUser.isadmin) return res.status(400).json({ updated: updated, err: 'You do not have enough reputation' })
      if (rep > 0 && updated.upvoters.includes(reqUser._id)) { /* If user has already upvoted, remove that vote */
        updated.upvoters.splice(updated.upvoters.indexOf(reqUser._id), 1)
        updated[req.body.type == 'answer' ? 'reputation' : 'rep'] -= 1
        user.reputation -= 5
      } else if (rep < 0 && updated.downvoters.includes(reqUser._id)) { /* If user has already downvoted, remove that vote */
        updated.downvoters.splice(updated.downvoters.indexOf(reqUser._id), 1)
        updated[req.body.type == 'answer' ? 'reputation' : 'rep'] += 1
        user.reputation += 10
      } else {
        /* If user has voted in the other direction, remove that vote and add this one */
        const indIfInOther = updated[rep > 0 ? 'downvoters' : 'upvoters'].indexOf(reqUser._id)
        if (indIfInOther != -1) {
          updated[rep > 0 ? 'downvoters' : 'upvoters'].splice(indIfInOther, 1)
          updated[req.body.type == 'answer' ? 'reputation' : 'rep'] += rep
          user.reputation += (rep > 0 ? 10 : -5)
        }

        /* Add this vote */
        updated[rep > 0 ? 'upvoters' : 'downvoters'].push(reqUser._id)
        updated[req.body.type == 'answer' ? 'reputation' : 'rep'] += rep
        user.reputation += (rep > 0 ? 5 : -10)
      }
    } else if (req.body.type == 'comment') {
      updated = await Comments.findOneAndUpdate({_id: req.body.id}, {$inc: {rep: rep}})
      user = await Users.findOne({email: updated.cum_by})
      if (updated.voters.includes(reqUser._id)) {
        updated.voters.splice(updated.voters.indexOf(reqUser._id), 1)
        updated.rep -= rep
      } else {
        updated.voters.push(reqUser._id)
        updated.rep += rep
      }
    } else {
      console.log('Invalid type')
      return res.status(400).json({ message: 'Invalid type' })
    }
    updated.save()
    user.save()
    res.status(200).json({ message: 'Rep updated', updated: updated })

    console.log('updated user: ', user)
    console.log('requesting user: ', reqUser)
    console.log('updated object: ', updated)
  } catch (err) {
    console.error(err)
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
