import React, { useState } from 'react'
import PropTypes from 'prop-types'
import '../stylesheets/login.css'
const modle = require('../models/axiosmodel.js')

export default function SignupPage ({ gotoLogin }) {
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [passwordVerification, setPasswordVerification] = useState('')
  const [error, setError] = useState('')

  const handleUsernameChange = (e) => setUsername(e.target.value)
  const handleEmailChange = (e) => setEmail(e.target.value)
  const handlePasswordChange = (e) => setPassword(e.target.value)
  const handlePasswordVerificationChange = (e) => setPasswordVerification(e.target.value)

  const handleSignUp = async () => {
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      setError('Invalid email format')
      return
    }

    if (password !== passwordVerification) {
      setError('Passwords do not match')
      return
    }

    // Check if password contains username or email
    if (password.includes(username) || password.includes(email)) {
      setError('Password should not contain username or email')
      return
    }

    try {
      // Save user information in the database
      await modle.addUser(email, username, password)
      // Set the login status to true
      gotoLogin()
    } catch (error) {
      if (error.response && error.response.status === 400) {
        // Duplicate email error occurred
        setError('Email already exists')
      } else {
        // Handle other errors
        setError('An error occurred')
        console.error(error)
      }
    }
  }

  return (
    <div>
      <h2>Signup Page</h2>
      <div>
        <label>Username: </label>
        <input type="text" value={username} onChange={handleUsernameChange} />
      </div>
      <div>
        <label>Email: </label>
        <input type="email" value={email} onChange={handleEmailChange} />
      </div>
      <div>
        <label>Password: </label>
        <input type="password" value={password} onChange={handlePasswordChange} />
      </div>
      <div>
        <label>Password Verification: </label>
        <input
          type="password"
          value={passwordVerification}
          onChange={handlePasswordVerificationChange}
        />
      </div>
      <button onClick={handleSignUp} className="loginbutt">Sign Up</button>
      {error && <p>{error}</p>}
    </div>
  )
}
SignupPage.propTypes = {
  gotoLogin: PropTypes.func.isRequired
}
