import React from 'react'
import '../stylesheets/landing.css'

export default function ButtonGroup () {
  function handleLoginClick () {
    console.log('login clicked')
  }

  function handleSignupClick () {
    console.log('signup click')
  }

  function handleGuestClick () {
    console.log('guest click')
  }

  return (
    <div className="landingdiv">
      <button className="landingbutt" onClick={ handleLoginClick }>{'Login'}</button>
      <button className="landingbutt" onClick={ handleSignupClick }>{'Sign Up'}</button>
      <button className="landingbutt" onClick={ handleGuestClick }>{'Continue as Guest'}</button>
    </div>
  )
}
