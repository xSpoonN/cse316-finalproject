import React from 'react'
import PropTypes from 'prop-types' // eslint-disable-line no-unused-vars
import '../stylesheets/profile.css'
const modle = require('../models/axiosmodel.js')

export default function Profile ({ user }) {
  console.log('Showing user profile:')
  console.log(user)
  return (
    <>
      <h2>{user.username}</h2>
      <p id="pro_age">{'Account created: ' + modle.formatDate(new Date(user.created_date_time))}</p>
      <p id="pro_rep">{'Reputation: ' + user.reputation}</p>
    </>
  )
}
Profile.propTypes = {
  user: PropTypes.object.isRequired
}
