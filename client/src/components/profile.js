import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import '../stylesheets/profile.css'
const modle = require('../models/axiosmodel.js')

function UserQuestion ({ question, setPage }) {
  const setAPage = (qid) => () => {
    setPage(qid)
  }
  return (
    <>
    <tr className="pRow">
      <td className="pTD pInfo">DO THIS toLocaleDateString</td>
      <td className="pTD pTitle"><a className='plink' onClick={setAPage(question._id)}>{question.title}</a></td>
      <td className="pTD pDate">{modle.formatDate(new Date(question.ask_date_time))}</td>
    </tr>
    </>
  )
}
UserQuestion.propTypes = {
  question: PropTypes.object.isRequired,
  setPage: PropTypes.func.isRequired
}

function UserQuestionList ({ email, setPage }) {
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
          <td className="pTD pInfo"></td>
          <td className="pTD pTitle"><b>Your Questions</b></td>
          <td className="pTD pDate"></td>
        </tr>
        {questionList.slice((currentPage - 1) * 5, (currentPage - 1) * 5 + 5).map((question) => (
          <UserQuestion key={question._id} question={question} setPage={setPage}/>
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
  setPage: PropTypes.func.isRequired
}

export default function Profile ({ email, setPage }) {
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
      <h2>{user.username + ` (${user.email})`}</h2>
      <p id="pro_age">{'Account created: ' + modle.formatDate(new Date(user.created_date_time))}</p>
      <p id="pro_rep">{'Reputation: ' + user.reputation}</p>
      <UserQuestionList email={user.email} setPage={setPage}/>
    </>
  )
}
Profile.propTypes = {
  email: PropTypes.string.isRequired,
  setPage: PropTypes.func.isRequired
}
