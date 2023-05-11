import React, { useState } from 'react'
import PropTypes from 'prop-types'

export default function LoginPage ({ setIsLoggedIn }) {
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [passwordVerification, setPasswordVerification] = useState('')
  const [error, setError] = useState('')

  const handleUsernameChange = (event) => {
    setUsername(event.target.value)
  }

  const handleEmailChange = (event) => {
    setEmail(event.target.value)
  }

  const handlePasswordChange = (event) => {
    setPassword(event.target.value)
  }

  const handlePasswordVerificationChange = (event) => {
    setPasswordVerification(event.target.value)
  }

  const handleSignUp = () => {
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

    // Save user information in a database
    // Replace with your own logic to save user information

    // Set the login status to true
    setIsLoggedIn(true)
  }

  return (
    <div>
      <h2>Login Page</h2>
      <div>
        <label>Username:</label>
        <input type="text" value={username} onChange={handleUsernameChange} />
      </div>
      <div>
        <label>Email:</label>
        <input type="email" value={email} onChange={handleEmailChange} />
      </div>
      <div>
        <label>Password:</label>
        <input type="password" value={password} onChange={handlePasswordChange} />
      </div>
      <div>
        <label>Password Verification:</label>
        <input
          type="password"
          value={passwordVerification}
          onChange={handlePasswordVerificationChange}
        />
      </div>
      <button onClick={handleSignUp}>Sign Up</button>
      {error && <p>{error}</p>}
    </div>
  )
}
LoginPage.propTypes = {
  setIsLoggedIn: PropTypes.func.isRequired
}
