// Comment Document Schema
const mongoose = require('mongoose')
// Define a schema
const CommentSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true
  },
  cum_by: {
    type: String,
    required: true
  },
  cum_date_time: {
    type: Date,
    default: Date.now
  },
  url: String
})
module.exports = mongoose.model('Comment', CommentSchema)
