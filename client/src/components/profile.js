import React from 'react'
import PropTypes from 'prop-types' // eslint-disable-line no-unused-vars
import '../stylesheets/profile.css'
const modle = require('../models/axiosmodel.js')

export default function Profile ({ email }) {
  console.log('Showing user profile:')
  console.log(email)
  return (
    <>
      <h2>{email}</h2>
      <p id="pro_age">{'Account created: ' + modle.formatDate(new Date())}</p>
      <p id="pro_rep">{'Reputation: '}</p>
    </>
  )
}
Profile.propTypes = {
  email: PropTypes.string.isRequired
}
