import React from 'react'
import PropTypes from 'prop-types' // eslint-disable-line no-unused-vars
import '../stylesheets/profile.css'

export default function Profile ({ username }) {
  return (
    <>
      <h2>{username}</h2>
    </>
  )
}
Profile.propTypes = {
  username: PropTypes.string.isRequired
}
