//Setup database with initial test data.
// Include an admin user.
// Script should take admin credentials as arguments as described in the requirements doc.
const bcrypt = require('bcrypt')
const userArgs = process.argv.slice(2)
if (!userArgs[0] || !userArgs[1]) {
  console.log('Usage: node init.js <admin_email> <admin_password>')
  process.exit()
}

const adminEmail = userArgs[0]
const adminPassword = userArgs[1]
let adminUser
adminPassword = bcrypt.hashSync(adminPassword, 10)

const Tag = require('./models/tags')
const User = require('./models/users')
const Comment = require('./models/comments')
const Answer = require('./models/answers')
const Question = require('./models/questions')

const mongoose = require('mongoose')
const mongoDB = 'mongodb://localhost:27017/fake_so'
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true })
const db = mongoose.connection
db.on('error', console.error.bind(console, 'MongoDB connection error:'))

async function createTag (name, user) {
  const tag = new Tag({
    name: name,
    createdBy: (user) ? user._id : adminUser._id
  })
  const ntag = await tag.save((err) => {
    if (err) {
      console.log(err)
    }
    console.log('New tag: ' + tag)
  })
  return ntag
}
async function createUser (email, username, password, isAdmin = false) {
  const user = new User({
    email: email,
    username: username,
    password: password,
    created_date_time: Date.now(),
    reputation: (isAdmin) ? 9999 : 0,
    isAdmin: isAdmin
  })
  const nuser = await user.save((err) => {
    if (err) {
      console.log(err)
    }
    console.log('New user: ' + user)
  })
  return nuser
}
async function createQuestion (title, text, tags, answers, asked_by, ask_time, views, rep, upvoters = [], downvoters = []) {
  const question = new Question({
    title: title,
    text: text,
    tags: tags,
    answers: [],
    asked_by: asked_by._id,
    asked_by_email: asked_by.email,
    ask_date_time: ask_time,
    views: views,
    rep: rep,
    upvoters: upvoters,
    downvoters: downvoters
  })
  const nquestion = await question.save((err) => {
    if (err) {
      console.log(err)
    }
    console.log('New question: ' + question)
  })
  return nquestion
}
async function createAnswer(text, answered_by, answer_time, comments, reputation, upvoters = [], downvoters = []) {
  const answer = new Answer({
    text: text,
    ans_by: answered_by._id,
    ans_by_email: answered_by.email,
    ans_date_time: answer_time,
    comments: comments,
    reputation: reputation,
    upvoters: upvoters,
    downvoters: downvoters
  })
  const nanswer = await answer.save((err) => {
    if (err) {
      console.log(err)
    }
    console.log('New answer: ' + answer)
  })
  return nanswer
}
async function createComment(text, cum_by, cum_date_time, rep, voters = []) {
  const comment = new Comment({
    text: text,
    cum_by: cum_by.email,
    cum_date_time: cum_date_time,
    rep: rep,
    voters: voters
  })
  const ncomment = await comment.save((err) => {
    if (err) {
      console.log(err)
    }
    console.log('New comment: ' + comment)
  })
  return ncomment
}

adminuser = await createUser(adminEmail, 'admin', adminPassword, true)
const u1 = await createUser('mikeymike@gmail.com', 'mikeymike', 'dumbpass123')
const u2 = await createUser('jhuh@gmail.com', 'jason', 'passypasspass')
const u3 = await createUser('brickAboma@whitehouse.gov', 'Bricc', 'briccbricc')
const u4 = await createUser('tepstertomsper@outlook.com', 'Tom', 'uwuowo')

const t1 = await createTag('javascript')
const t2 = await createTag('python')
const t3 = await createTag('java')
const t4 = await createTag('c++', u1)
const t5 = await createTag('c#')
const t6 = await createTag('html', u2)
const t7 = await createTag('css', u4)
const t8 = await createTag('react', u2)
const t9 = await createTag('angular', u3)
const t10 = await createTag('vue', u4)
const t11 = await createTag('nodejs', u1)
const t12 = await createTag('express', u2)
const t13 = await createTag('mongodb', u2)
const t14 = await createTag('sql', u2)

const q1 = await createQuestion('How do I make a for loop in javascript?', 'I want to make a for loop in javascript, but I don\'t know how. Can someone help me?', [t1, t11], [], u1, Date.now(), 0, 0)
const q2 = await createQuestion('How do I make a for loop in python?', 'I want to make a for loop in python, but I don\'t know how. Can someone help me?', [t2], [], u2, Date.now(), 0, 0)
const q3 = await createQuestion('How do I make a for loop in java?', 'I want to make a for loop in java, but I don\'t know how. Can someone help me?', [t3], [], u3, Date.now(), 0, 0)
const q4 = await createQuestion('How do I make a for loop in c++?', 'I want to make a for loop in c++, but I don\'t know how. Can someone help me?', [t4], [], u4, Date.now(), 0, 0)
const q5 = await createQuestion('Why doesn\'t my for loop work?', 'I want to make a for loop, but it doesn\'t work. Can someone help me?', [], [], u1, Date.now(), 0, 0)
const q6 = await createQuestion('How do I make a for loop in html?', 'I want to make a for loop in html, but I don\'t know how. Can someone help me?', [t6], [], u2, Date.now(), 0, 0)
const q7 = await createQuestion('How do I make a for loop in css?', 'I want to make a for loop in css, but I don\'t know how. Can someone help me?', [t7], [], u3, Date.now(), 0, 0)
const q8 = await createQuestion('How do I make a for loop in react?', 'I want to make a for loop in react, but I don\'t know how. Can someone help me?', [t8], [], u4, Date.now(), 0, 0)
const q9 = await createQuestion('Why are there so many for loops?', 'I want to make a for loop, but there are so many. Can someone help me?', [], [], u1, Date.now(), 0, 0)
const q10 = await createQuestion('How do I make a for loop in express?', 'I want to make a for loop in express, but I don\'t know how. Can someone help me?', [t12], [], u4, Date.now(), 0, 0)
const q11 = await createQuestion('Where do I find the for loop in mongodb?', 'I can\t find the for loop in mongodb. My life is over. Can someone help me?', [t13], [], u1, Date.now(), 0, 0)