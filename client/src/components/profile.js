import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
const modle = require('../models/axiosmodel.js')

export default function Profile ({ email }) {
  const [user, setUser] = useState(null)

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const fetchedUser = await modle.getUser(email)
        setUser(fetchedUser)
      } catch (error) {
        console.error('Error fetching user:', error)
      }
    }
    fetchUser()
  }, [email])

  if (!user) {
    return <p>Loading user profile...</p>
  }

  return (
    <>
      <h2>{user.username}</h2>
      <p id="pro_age">{'Account created: ' + modle.formatDate(new Date(user.created_date_time))}</p>
      <p id="pro_rep">{'Reputation: ' + user.reputation}</p>
    </>
  )
}

Profile.propTypes = {
  email: PropTypes.string.isRequired
}
