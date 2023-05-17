import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import AllTags from './alltags.js'
import '../stylesheets/profile.css'
const modle = require('../models/axiosmodel.js')

/* Question entry into the table */
function UserQuestion ({ question, setPage, setUpdateQid }) {
  const [answers, setAnswers] = useState([])
  const [tagNames, setTagNames] = useState([])
  const tagList = question.tags

  useEffect(() => {
    async function fetchTagNames () {
      const names = await Promise.all(tagList.map(async (tag) => {
        const name = await modle.getTagName(tag)
        return name
      }))
      setTagNames(names)
    }
    fetchTagNames()
  }, [tagList])

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
            <br/>
            {tagNames.map((name, i) => (<button key={tagList[i]} className="qtag">{name}</button>))}
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

/* List of questions asked by the user */
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
        {questionList.length === 0 && <tr className="pRow"><td className="pTD pScore"></td><td className="pTD pInfo"></td><td className="pTD pTitle"><i>No questions asked...</i></td><td className="pTD pDate"></td></tr>}
      </tbody>
    </table>
    <button className="pprevbutt" onClick={handlePrevPage} disabled={isFirstPage}>Prev</button>
    <button className="pnextbutt" onClick={handleNextPage} disabled={isLastPage}>Next</button>
    </>
  )
}
UserQuestionList.propTypes = {
  email: PropTypes.string.isRequired,
  setPage: PropTypes.func.isRequired,
  setUpdateQid: PropTypes.func.isRequired
}

/* Question entry into the table */
function AnsweredQuestion ({ email, question, showPrioAnswer }) {
  const [answers, setAnswers] = useState([])
  const [tagNames, setTagNames] = useState([])
  const tagList = question.tags

  useEffect(() => {
    async function fetchTagNames () {
      const names = await Promise.all(tagList.map(async (tag) => {
        const name = await modle.getTagName(tag)
        return name
      }))
      setTagNames(names)
    }
    fetchTagNames()
  }, [tagList])
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
          <a className='plink' onClick={showPrioAnswer(question._id, email)}>
            {question.title}
            <br/>
            {tagNames.map((name, i) => (<button key={tagList[i]} className="qtag">{name}</button>))}
          </a>
        </td>
        <td className="pTD pDate">{modle.formatDate(new Date(question.ask_date_time))}</td>
      </tr>
    </>
  )
}
AnsweredQuestion.propTypes = {
  email: PropTypes.string.isRequired,
  question: PropTypes.object.isRequired,
  showPrioAnswer: PropTypes.func.isRequired
}

/* List of questions answered by the user */
function AnsweredQuestionList ({ email, showPrioAnswer }) {
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
      const questions = await modle.getQuestionsAnsweredBy(email)
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
          <td className="pTD pTitle"><b>Questions You&apos;ve Answered</b></td>
          <td className="pTD pDate"></td>
        </tr>
        {questionList.slice((currentPage - 1) * 5, (currentPage - 1) * 5 + 5).map((question) => (
          <AnsweredQuestion key={question._id} email={email} question={question} showPrioAnswer={showPrioAnswer}/>
        ))}
        {questionList.length === 0 && <tr className="pRow"><td className="pTD pScore"></td><td className="pTD pInfo"></td><td className="pTD pTitle"><i>No questions answered...</i></td><td className="pTD pDate"></td></tr>}
      </tbody>
    </table>
    <button className="pprevbutt" onClick={handlePrevPage} disabled={isFirstPage}>Prev</button>
    <button className="pnextbutt" onClick={handleNextPage} disabled={isLastPage}>Next</button>
    </>
  )
}
AnsweredQuestionList.propTypes = {
  email: PropTypes.string.isRequired,
  showPrioAnswer: PropTypes.func.isRequired
}

function AdminList ({ setError, setEmailOverride }) {
  const [userList, setUserList] = useState([])
  const [confirmDeleteId, setConfirmDeleteId] = useState('')

  const adminDelete = () => {
    setError({ msg: 'You cannot delete an admin account!', duration: 3000 })
  }

  const deleteUser = async (id) => {
    await modle.deleteUser(id)
    setUserList(userList.filter((user) => user._id !== id))
  }

  const handleDelete = (id) => {
    if (confirmDeleteId === id) {
      deleteUser(id)
      setConfirmDeleteId('')
    } else {
      setConfirmDeleteId(id)
    }
  }

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const fetchedUsers = await modle.getAllUsers()
        setUserList(fetchedUsers)
      } catch (error) {
        console.error('Error fetching users:', error)
      }
    }
    fetchUsers()
  }, [])

  if (!userList) {
    return <p>Loading user list...</p>
  }

  return (
    <>
      <table id="adminTable">
        <tbody>
          <tr className="pRow">
            <td className="pTD paInfo"><b>Type</b></td>
            <td className="pTD paScore"><b>Rep</b></td>
            <td className="pTD paTitle"><b>Username</b></td>
            <td className="pTD paEmail"><b>Email</b></td>
            <td className="pTD paDate"><b>Date Created</b></td>
            <td className="pTD paDel"><b>Delete</b></td>
          </tr>
          {userList.map((user) => (
            <tr className="pRow" key={user._id}>
              <td className="pTD paInfo">{user.isadmin ? 'Admin' : 'User'}</td>
              <td className="pTD paScore">{user.reputation} reputation</td>
              <td className="pTD paTitle"><p className='plink' onClick={() => setEmailOverride(user.email)}>{user.username}</p></td>
              <td className="pTD paEmail">{user.email}</td>
              <td className="pTD paDate">{modle.formatDate(new Date(user.created_date_time))}</td>
              <td className="pTD paDel">
                {confirmDeleteId === user._id
                  ? (
                  <>
                    <button className="usercanbutt" onClick={() => setConfirmDeleteId('')}>
                      Cancel
                    </button>
                    <button className="userdelbutt" onClick={() => handleDelete(user._id)}>
                      Confirm
                    </button>
                  </>
                    )
                  : (
                  <button className="userdelbutt" onClick={user.isadmin ? adminDelete : () => handleDelete(user._id)}>
                    Delete
                  </button>
                    )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  )
}
AdminList.propTypes = {
  setError: PropTypes.func.isRequired,
  setEmailOverride: PropTypes.func.isRequired
}

export default function Profile ({ email, setPage, setUpdateQid, setSearchQuery, showPrioAnswer, setError }) {
  const [user, setUser] = useState(null)
  const [showTags, setShowTags] = useState(false)
  const [showAnswers, setShowAnswers] = useState(false)
  const [emailOverride, setEmailOverride] = useState('')

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const fetchedUser = await modle.getUser(emailOverride || email)
        setUser(fetchedUser)
      } catch (error) {
        console.error('Error fetching user:', error)
      }
    }
    fetchUser()
  }, [email, emailOverride])

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
      {user.isadmin && <p style={{ color: 'red' }}>Admin Account</p>}
      <p id="pro_age">{'Account created: ' + modle.formatDate(new Date(user.created_date_time))}</p>
      <p id="pro_rep">{'Reputation: ' + user.reputation}</p>
      <UserQuestionList email={user.email} setPage={setPage} setUpdateQid={setUpdateQid}/>
      <br/><br/>
      <p className="plink" onClick={toggleAnswers}><u>{showAnswers ? 'Hide' : 'Show'} Answered Questions</u></p>
      {showAnswers && <AnsweredQuestionList email={user.email} showPrioAnswer={showPrioAnswer}/>}
      <br/>
      <p className="plink" onClick={toggleTags}><u>{showTags ? 'Hide' : 'Show'} Tags</u></p>
      {showTags && <AllTags setSearchQuery={setSearchQuery} email={user.email} setError={setError}/>}
      {user.isadmin &&
      <>
        <br/><br/>
        <h3><u>Admin Panel</u></h3>
        <AdminList setError={setError} setEmailOverride={setEmailOverride}/>
      </>
      }
    </>
  )
}
Profile.propTypes = {
  email: PropTypes.string.isRequired,
  setPage: PropTypes.func.isRequired,
  setUpdateQid: PropTypes.func.isRequired,
  setSearchQuery: PropTypes.func.isRequired,
  showPrioAnswer: PropTypes.func.isRequired,
  setError: PropTypes.func.isRequired
}
