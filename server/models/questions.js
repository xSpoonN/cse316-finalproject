// Question Document Schema
// Question Document Schema
const mongoose = require('mongoose')
// eslint-disable-next-line no-unused-vars
const Tag = require('./tags')
// eslint-disable-next-line no-unused-vars
const Answer = require('./answers')
// Define a schema
const QuestionSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  text: {
    type: String,
    required: true
  },
  tags: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Tag',
    required: true
  }],
  answers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Answer'
  }],
  asked_by: {
    type: String,
    default: 'Anonymous'
  },
  ask_date_time: {
    type: Date,
    default: Date.now
  },
  views: {
    type: Number,
    default: 0
  },
  url: String
})
module.exports = mongoose.model('Question', QuestionSchema)
