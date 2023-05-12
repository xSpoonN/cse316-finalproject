// Answer Document Schema
const mongoose = require('mongoose')
// Define a schema
const AnswerSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true
  },
  ans_by: {
    type: String,
    required: true
  },
  ans_by_email: {
    type: String,
    required: true
  },
  ans_date_time: {
    type: Date,
    default: Date.now
  },
  url: String,
  comments: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Comment'
  }]
})
module.exports = mongoose.model('Answer', AnswerSchema)
