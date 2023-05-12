import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
const modle = require('../models/axiosmodel.js')

function UserQuestion ({ question }) {
  return (
    <>
    <tr className="pRow">
      <td className="pTD pAns">{question.asked_by_email}</td>
      <td className="pTD pTitle">{question.title}</td>
      <td className="pTD pDate">{question.text}</td>
    </tr>
    </>
  )
}
UserQuestion.propTypes = {
  question: PropTypes.object.isRequired
}

function UserQuestionList ({ email, page }) {
  const [questionList, setQuestionList] = useState([])

  useEffect(() => {
    async function fetchQuestions () {
      const questions = await modle.getQuestionsByEmail(email)
      setQuestionList(questions)
    }
    fetchQuestions()
  }, [email, page])

  return (
    <>
    <table id="pro_questions">
      <tbody>
        <tr className="pRow">
          <td className="pTD pAns"></td>
          <td className="pTD pTitle"></td>
          <td className="pTD pDate"></td>
        </tr>
        {questionList.map((question) => (
          <UserQuestion key={question._id} question={question}/>
        ))}
      </tbody>
    </table>
    </>
  )
}
UserQuestionList.propTypes = {
  email: PropTypes.string.isRequired,
  page: PropTypes.number.isRequired
}

export default function Profile ({ email }) {
  const [user, setUser] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)

  function handleNextPage () {
    setCurrentPage(p => p + 1)
  }

  function handlePrevPage () {
    setCurrentPage(p => p - 1)
  }

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
      <UserQuestionList email={user.email} page={currentPage}/>
      <button onClick={handlePrevPage}>Prev</button>
      <button onClick={handleNextPage}>Next</button>
    </>
  )
}
Profile.propTypes = {
  email: PropTypes.string.isRequired
}
