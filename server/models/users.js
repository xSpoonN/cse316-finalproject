// Comment Document Schema
const mongoose = require('mongoose')
// Define a schema
const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true
  },
  username: {
    type: String,
    default: 'Anonymous',
    required: true
  },
  password: {
    type: String,
    required: true
  },
  created_date_time: {
    type: Date,
    default: Date.now
  },
  url: String,
  type: {
    type: String,
    default: 'User'
  }
})
module.exports = mongoose.model('User', UserSchema)
