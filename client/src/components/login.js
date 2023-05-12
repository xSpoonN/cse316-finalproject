import React, { useState } from 'react'
import PropTypes from 'prop-types'
const modle = require('../models/axiosmodel.js')

export default function LoginPage ({ setIsLoggedIn, setUsername, setUserEmail }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleEmailChange = (e) => setEmail(e.target.value)
  const handlePasswordChange = (e) => setPassword(e.target.value)

  const handleLogin = async () => {
    try {
      // Perform login action using user credentials
      const resp = await modle.loginUser(email, password)
      /* console.log(resp) */
      if (resp.status === 200) {
        // Set the login status to true
        setIsLoggedIn(true)
      } else {
        setError(resp.data.message)
      }
    } catch (error) {
      console.log(error)
      if (error.response && error.response.status === 401) {
        // Unauthorized login error occurred
        setError('Invalid email or password')
      } else if (error.response && error.response.status === 400) {
        setError('Invalid User')
      } else {
        // Handle other errors
        setError('An error occurred')
      }
    }
  }

  return (
    <div>
      <h2>Login Page</h2>
      <div>
        <label>Email:</label>
        <input type="email" value={email} onChange={handleEmailChange} />
      </div>
      <div>
        <label>Password:</label>
        <input type="password" value={password} onChange={handlePasswordChange} />
      </div>
      <button onClick={handleLogin}>Log In</button>
      {error && <p>{error}</p>}
    </div>
  )
}
LoginPage.propTypes = {
  setIsLoggedIn: PropTypes.func.isRequired,
  setUsername: PropTypes.func.isRequired,
  setUserEmail: PropTypes.func.isRequired
}
