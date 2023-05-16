import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import AllTags from './alltags.js'
import '../stylesheets/profile.css'
const modle = require('../models/axiosmodel.js')

function UserQuestion ({ question, setPage, setUpdateQid }) {
  const [answers, setAnswers] = useState([])
  useEffect(() => {
    const fetchAnswers = async () => {
      try {
        const fetchedAnswers = await modle.getAnswersByQID(question._id)
        setAnswers(fetchedAnswers)
      } catch (error) {
        console.error(error)
      }
    }
    fetchAnswers()
  }, [question._id])
  const setAPage = (qid) => () => {
    setUpdateQid(qid)
    setPage()
  }
  return (
    <>
      <tr className="pRow">
        <td className="pTD pScore">{question.rep} votes</td>
        <td className="pTD pInfo">
          {answers.length} answers
          <br />
          {question.views} views
        </td>
        <td className="pTD pTitle">
          <a className='plink' onClick={setAPage(question._id)}>
            {question.title}
          </a>
        </td>
        <td className="pTD pDate">{modle.formatDate(new Date(question.ask_date_time))}</td>
      </tr>
    </>
  )
}

UserQuestion.propTypes = {
  question: PropTypes.object.isRequired,
  setPage: PropTypes.func.isRequired,
  setUpdateQid: PropTypes.func.isRequired
}

function UserQuestionList ({ email, setPage, setUpdateQid }) {
  const [questionList, setQuestionList] = useState([])
  const [currentPage, setCurrentPage] = useState(1)

  const isFirstPage = currentPage === 1
  const isLastPage = questionList === [] ? true : currentPage * 5 >= questionList.length

  function handleNextPage () {
    setCurrentPage(p => p + 1)
  }

  function handlePrevPage () {
    setCurrentPage(p => p - 1)
  }

  useEffect(() => {
    async function fetchQuestions () {
      const questions = await modle.getQuestionsByEmail(email)
      setQuestionList(questions.sort((a, b) => new Date(b.ask_date_time) - new Date(a.ask_date_time)))
    }
    fetchQuestions()
  }, [email])

  return (
    <>
    <table id="pTable">
      <tbody>
        <tr className="pRow">
          <td className="pTD pScore"></td>
          <td className="pTD pInfo"></td>
          <td className="pTD pTitle"><b>Your Questions</b></td>
          <td className="pTD pDate"></td>
        </tr>
        {questionList.slice((currentPage - 1) * 5, (currentPage - 1) * 5 + 5).map((question) => (
          <UserQuestion key={question._id} question={question} setPage={setPage} setUpdateQid={setUpdateQid}/>
        ))}
      </tbody>
    </table>
    <button onClick={handlePrevPage} disabled={isFirstPage}>Prev</button>
    <button onClick={handleNextPage} disabled={isLastPage}>Next</button>
    </>
  )
}
UserQuestionList.propTypes = {
  email: PropTypes.string.isRequired,
  setPage: PropTypes.func.isRequired,
  setUpdateQid: PropTypes.func.isRequired
}

export default function Profile ({ email, setPage, setUpdateQid, setSearchQuery }) {
  const [user, setUser] = useState(null)
  const [showTags, setShowTags] = useState(false)
  const [showAnswers, setShowAnswers] = useState(false)

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

  const toggleTags = () => {
    setShowTags(b => !b)
  }

  const toggleAnswers = () => {
    setShowAnswers(b => !b)
  }

  if (!user) {
    return <p>Loading user profile...</p>
  }

  return (
    <>
      <h2>{user.username + ` (${user.email})`}</h2>
      <p id="pro_age">{'Account created: ' + modle.formatDate(new Date(user.created_date_time))}</p>
      <p id="pro_rep">{'Reputation: ' + user.reputation}</p>
      <UserQuestionList email={user.email} setPage={setPage} setUpdateQid={setUpdateQid}/>
      <br/><br/>
      <p className="plink" onClick={toggleAnswers}><u>{showAnswers ? 'Hide' : 'Show'} Answers</u></p>
      <br/>
      <p className="plink" onClick={toggleTags}><u>{showTags ? 'Hide' : 'Show'} Tags</u></p>
      {showTags && <AllTags setSearchQuery={setSearchQuery} email={user.email}/>}
    </>
  )
}
Profile.propTypes = {
  email: PropTypes.string.isRequired,
  setPage: PropTypes.func.isRequired,
  setUpdateQid: PropTypes.func.isRequired,
  setSearchQuery: PropTypes.func.isRequired
}
