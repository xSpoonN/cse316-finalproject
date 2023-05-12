// User Document Schema
const mongoose = require('mongoose')
// Define a schema
const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true
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
  reputation: {
    type: Number,
    default: 0
  },
  isadmin: {
    type: Boolean,
    default: false
  },
  url: String
})
module.exports = mongoose.model('User', UserSchema)
