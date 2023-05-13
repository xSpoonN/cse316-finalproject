/* import Model from '../models/model.js' */
import React, { useState } from 'react'
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

export function Page ({ searchQuery, activePage, setActivePage, setSearchQuery, email, setEmail }) {
  const switchToPage = (page) => () => setActivePage(page)
  const showAnswer = () => (id) => {
    setQid(id)
    setActivePage('Answers')
  }
  const setSearch = (query) => () => {
    setSearchQuery(query)
    setActivePage('Questions')
  }
  const [currentQid, setQid] = useState('q1')

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
          <button className="askqbutt" onClick={switchToPage('PostQuestion')}>Ask Question</button>
          <Questions key={ searchQuery } searchQuery={ searchQuery } fun={ showAnswer(currentQid) }/>
        </>
      )
    case 'PostQuestion': /* console.log('Switching to PostQuestion') */
      return (
        <PostQuestion setActivePage={setActivePage} email={email}/>
      )
    case 'Answers': /* console.log('Switching to Answers') */
      return (
        <>
        <button className="askqbutt" onClick={switchToPage('PostQuestion')}>Ask Question</button>
        <br />
        <Answers qid={currentQid} gotoPostAnswerPage={switchToPage('PostAnswer')} email={email}/>
        </>
      )
    case 'PostAnswer': /* console.log('Switching to PostAnswer') */
      return (
        <AnswerForm setActivePage={setActivePage} qid={currentQid} email={email}/>
      )
    case 'AllTags': /* console.log('Switching to AllTags') */
      return (
        <>
        <button className="askqbutt" onClick={switchToPage('PostQuestion')}>Ask Question</button>
        <AllTags setSearchQuery={setSearch} />
        </>
      )
    case 'Profile': /* console.log('Switching to Profile') */
      return (
        <>
        <Profile email={email} setPage={showAnswer('!/^((?<=[\\w+?#.])-?(?=[\\w+?#.])|[\\w+?#.]){1,10}(\\s((?<=[\\w+?#.])-?(?=[\\w+?#.])|[\\w+?#.]){1,10}){0,4}$/')}/>
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
  setEmail: PropTypes.func.isRequired
}

export default function fakeStackOverflow () {
  const [searchQuery, setSearchQuery] = useState('')
  const [activePage, setActivePage] = useState('Landing')
  const [email, setEmail] = useState(undefined)

  const logout = () => {
    setEmail(undefined)
    setActivePage('Landing')
  }

  return (
    <div>
      {<Header
        searchQueryChange={setSearchQuery}
        loggedIn={email !== undefined}
        className="header"
      />}
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
        />
      </div>
    </div>
  )
}
