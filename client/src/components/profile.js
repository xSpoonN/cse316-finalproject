import React from 'react'
import PropTypes from 'prop-types' // eslint-disable-line no-unused-vars
import '../stylesheets/profile.css'

export default function Profile ({ user }) {
  return (
    <>
      <h2>{user.username}</h2>
    </>
  )
}
Profile.propTypes = {
  user: PropTypes.object.isRequired
}
