import React from 'react'
import PropTypes from 'prop-types'
import '../stylesheets/landing.css'

export default function LandingPage ({ handleLogin, handleSignup, handleGuest }) {
  return (
    <div className="landingdiv">
      <button className="landingbutt" onClick={ handleLogin }>{'Login'}</button>
      <button className="landingbutt" onClick={ handleSignup }>{'Sign Up'}</button>
      <button className="landingbutt" onClick={ handleGuest }>{'Continue as Guest'}</button>
    </div>
  )
}
LandingPage.propTypes = {
  handleLogin: PropTypes.func.isRequired,
  handleSignup: PropTypes.func.isRequired,
  handleGuest: PropTypes.func.isRequired
}
