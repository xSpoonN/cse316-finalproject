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
  ans_date_time: {
    type: Date,
    default: Date.now
  },
  url: String
})
module.exports = mongoose.model('Answer', AnswerSchema)
