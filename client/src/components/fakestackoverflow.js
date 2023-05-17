/* import Model from '../models/model.js' */
import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import Questions from './questions.js'
import PostQuestion from './questionform.js'
import Answers from './answers.js'
import AllTags from './alltags.js'
import AnswerForm from './answerform.js'
import SignupPage from './signup.js'
import LoginPage from './login.js'
import LandingPage from './landing.js'
import Profile from './profile.js'
import '../stylesheets/fakeStackOverflow.css'
import '../stylesheets/questions.css'
import '../stylesheets/answerform.css'
import '../stylesheets/answers.css'
import '../stylesheets/alltags.css'
const modle = require('../models/axiosmodel.js')

export function Header ({ searchQueryChange, loggedIn }) {
  const [searchQuery, setSearchQuery] = useState('')
  const handleKeyDown = (e) => {
    if (e.keyCode === 13) searchQueryChange(searchQuery)
  }
  return (
    <div className="header" id="header">
      {/* <img src="../../QueueUnderflow.png" alt="logo" style={{ height: '8%', width: 'auto', position: 'fixed', left: '10px' }}/> */}
      <h1 id="title">Queue Underflow</h1>
      {loggedIn &&
        <input type="text"
          id="search"
          placeholder="Search ..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={handleKeyDown}
        />
      }
    </div>
  )
}
Header.propTypes = {
  searchQueryChange: PropTypes.func.isRequired,
  loggedIn: PropTypes.bool.isRequired
}

export function Sidebar ({ pageChange, activePage, setSearchQuery, email, logout }) {
  const handlePageChange = (page) => {
    if (page === 'Questions') setSearchQuery('')
    pageChange(page)
  }
  return (
    <div id="sidebar">
      <a className={activePage === 'Questions' ? 'sidebutt active' : 'sidebutt'} id="questiontab" onClick={() => handlePageChange('Questions')}>Questions</a>
      <a className={activePage === 'AllTags' ? 'sidebutt active' : 'sidebutt'} id="tagtab" onClick={() => handlePageChange('AllTags')}>Tags</a>
      {email !== '' &&
        <a className={activePage === 'Profile' ? 'sidebutt active' : 'sidebutt'} id="profiletab" onClick={() => handlePageChange('Profile')}>Profile</a>
      }
      <a className={'sidebutt'} id="logouttab" onClick={logout}>Logout</a>
    </div>
  )
}
Sidebar.propTypes = {
  pageChange: PropTypes.func.isRequired,
  activePage: PropTypes.string.isRequired,
  setSearchQuery: PropTypes.func.isRequired,
  email: PropTypes.string,
  logout: PropTypes.func.isRequired
}

export function Page ({ searchQuery, activePage, setActivePage, setSearchQuery, email, setEmail, setError }) {
  const switchToPage = (page) => () => {
    setUpdateQid('')
    setActivePage(page)
  }
  const showUpdateQuestion = () => {
    setActivePage('PostQuestion')
  }
  const showAnswer = () => (id) => {
    setQid(id)
    setPrioEmail('')
    setActivePage('Answers')
  }
  const showPrioAnswer = (id, email) => () => {
    setQid(id)
    setPrioEmail(email)
    setActivePage('Answers')
  }
  const setSearch = (query) => () => {
    setSearchQuery(query)
    setActivePage('Questions')
  }
  const [currentQid, setQid] = useState('q1')
  const [updateQid, setUpdateQid] = useState('')
  const [prioEmail, setPrioEmail] = useState('')

  const loginGuest = () => {
    setEmail('')
    switchToPage('Questions')()
  }

  const loginUser = (email) => {
    setEmail(email)
    switchToPage('Questions')()
  }

  switch (activePage) {
    case 'Landing': /* console.log('Switching to Landing') */
      return (
        <LandingPage handleLogin={switchToPage('Login')} handleSignup={switchToPage('Signup')} handleGuest={loginGuest} />
      )
    case 'Signup': /* console.log('Switching to Signup') */
      return (
        <SignupPage gotoLogin={switchToPage('Login')} />
      )
    case 'Login': /* console.log('Switching to Login') */
      return (
        <LoginPage login={loginUser}/>
      )
    case 'Questions': /* console.log('Switching to Questions') */
      return (
        <>
          <p className="contentheader">All Questions</p>
          {email && <button className="askqbutt" onClick={switchToPage('PostQuestion')}>Ask Question</button>}
          <Questions key={ searchQuery } searchQuery={ searchQuery } fun={ showAnswer(currentQid)} email={email} setError={setError}/>
        </>
      )
    case 'PostQuestion': /* console.log('Switching to PostQuestion') */
      return (
        <PostQuestion setActivePage={setActivePage} email={email} updateQid={updateQid} setUpdateQid={setUpdateQid} setError={setError}/>
      )
    case 'Answers': /* console.log('Switching to Answers') */
      return (
        <>
        {email && <button className="askqbutt" onClick={switchToPage('PostQuestion')}>Ask Question</button>}
        <br />
        <Answers qid={currentQid} gotoPostAnswerPage={switchToPage('PostAnswer')} email={email} setError={setError} prioEmail={prioEmail}/>
        </>
      )
    case 'PostAnswer': /* console.log('Switching to PostAnswer') */
      return (
        <AnswerForm setActivePage={setActivePage} qid={currentQid} email={email}/>
      )
    case 'AllTags': /* console.log('Switching to AllTags') */
      return (
        <>
        {email && <button className="askqbutt" onClick={switchToPage('PostQuestion')}>Ask Question</button>}
        <AllTags setSearchQuery={setSearch} setError={setError}/>
        </>
      )
    case 'Profile': /* console.log('Switching to Profile') */
      return (
        <>
        <Profile email={email} setUpdateQid={setUpdateQid} setPage={showUpdateQuestion} setSearchQuery={setSearch} showPrioAnswer={showPrioAnswer} setError={setError}/>
        </>
      )
  }
}
Page.propTypes = {
  searchQuery: PropTypes.string,
  activePage: PropTypes.string.isRequired,
  setActivePage: PropTypes.func.isRequired,
  setSearchQuery: PropTypes.func.isRequired,
  email: PropTypes.string,
  setEmail: PropTypes.func.isRequired,
  setError: PropTypes.func.isRequired
}

export default function fakeStackOverflow () {
  const [searchQuery, setSearchQuery] = useState('')
  const [activePage, setActivePage] = useState('Landing')
  const [email, setEmail] = useState(undefined)
  const [error, setError] = useState({ msg: '', duration: 0, green: false })
  const [timeoutFunc, setTimeoutFunc] = useState(undefined)

  const logout = () => {
    setEmail(undefined)
    localStorage.removeItem('token')
    setActivePage('Landing')
  }

  useEffect(() => {
    async function checkLogin () {
      console.log(localStorage.getItem('token'))
      const email = await modle.auth(localStorage.getItem('token'))
      console.log(email)
      if (email?.data?.email) {
        setEmail(email.data.email)
        setActivePage('Questions')
      } else console.log('not logged in')
    }
    checkLogin()
  }, [])

  useEffect(() => {
    if (error.msg) {
      console.log('error msg changed', timeoutFunc)
      if (timeoutFunc) clearTimeout(timeoutFunc)
      const timeFunc = setTimeout(() => {
        setError({ msg: '', duration: 0 })
      }, error.duration)
      setTimeoutFunc(timeFunc)
      console.log('new timeoutfunc - ', timeFunc)
    }
  }, [error])

  return (
    <div>
      {<Header
        searchQueryChange={setSearchQuery}
        loggedIn={email !== undefined}
        className="header"
      />}
      {(
        <div className={`error ${error.msg ? 'fade-in' : 'fade-out'} ${error.green ? 'egreen' : ''}`}>
          {error.msg}
        </div>
      )}
      {email !== undefined &&
        <Sidebar
          pageChange={(page) => setActivePage(page)}
          activePage={activePage}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          email={email}
          logout={logout}
        />}
      <div className="content">
        <Page
          searchQuery={searchQuery}
          activePage={activePage}
          setActivePage={setActivePage}
          setSearchQuery={setSearchQuery}
          email={email}
          setEmail={setEmail}
          setError={setError}
        />
      </div>
    </div>
  )
}
