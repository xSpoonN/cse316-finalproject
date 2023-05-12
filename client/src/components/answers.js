import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
const modle = require('../models/axiosmodel.js')

function replaceLinks (text) {
  if (!text) return ''
  return text.replace(/\[(.*?)\]\((.*?)\)/g, (full, name, link) => {
    return (link.match(/^https?:\/\//)) ? `<a href='${link}'>${name}</a>` : full
  })
}

export default function Answers ({ qid, gotoPostAnswerPage, email }) {
  const [questionData, setQuestionData] = useState(null)
  const [answers, setAnswers] = useState([])
  const [currentPage, setCurrentPage] = useState(1)

  const isFirstPage = currentPage === 1
  const isLastPage = answers === undefined ? true : currentPage * 5 >= answers.length

  useEffect(() => {
    async function fetchData () {
      setQuestionData(await modle.getQuestion(qid))
      setAnswers((await modle.getAnswersByQID(qid)).sort((a, b) => {
        return new Date(b.ans_date_time) - new Date(a.ans_date_time)
      }))
      // modle.addViews(qid)
    }
    fetchData()
  }, [qid, currentPage])

  function handleNextPage () {
    // modle.removeView(qid)
    setCurrentPage(p => p + 1)
  }

  function handlePrevPage () {
    // modle.removeView(qid)
    setCurrentPage(p => p - 1)
  }

  if (!questionData) return <p>Loading...</p>

  const textWithLinks = replaceLinks(questionData.text)

  return (
    <>
      <p id="ap_answercount"><b>{questionData.answers.length} answers</b></p>
      <p id="ap_questiontitle"><b>{questionData.title}</b></p>
      <br />
      <p id="ap_views"><b>{questionData.views} views</b></p>
      <p id="ap_questiontext" dangerouslySetInnerHTML={{ __html: textWithLinks }}/>
      <p id="ap_askedby">
        <b>{questionData.asked_by}</b> asked<br />
        {modle.formatDate(new Date(questionData.ask_date_time))}
      </p>
      <br />
      <table id="ap_answers">
        <tbody>
          <tr className="aRow">
            <td className="aTD aAns"></td>
            <td className="aTD aCred"></td>
          </tr>
          {answers.slice((currentPage - 1) * 5, (currentPage - 1) * 5 + 5).map((answer) => (
            <Answer key={answer._id} answer={answer} email={email}/>
          ))}
        </tbody>
      </table>
      <div>
        <button id="prevbutt" className="answersort" onClick={handlePrevPage} disabled={isFirstPage}>Prev</button>
        <button id="nextbutt" className="answersort" onClick={handleNextPage} disabled={isLastPage}>Next</button>
      </div>
      <br />
      {answers.length === 0 && (<p id="ap_noanswers"><i>No Answers Yet...</i></p>)}
      <button id="ap_answerbutton" onClick={gotoPostAnswerPage}>Answer Question</button>
    </>
  )
}
Answers.propTypes = {
  qid: PropTypes.string.isRequired,
  gotoPostAnswerPage: PropTypes.func.isRequired,
  email: PropTypes.string.isRequired
}

export function Answer ({ answer, email }) {
  const [comments, setComments] = useState([])
  const [commentData, setCommentData] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [newComment, setNewComment] = useState('')

  const isFirstPage = currentPage === 1
  const isLastPage = comments === undefined ? true : currentPage * 3 >= comments.length

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const comments = await modle.getCommentsByAID(answer._id)
        setComments(comments.data)
        const fetchedCommentData = await Promise.all(
          comments.data.map(async (comment) => {
            const commentData = await modle.getCommentByID(comment)
            return commentData.data
          })
        )
        setCommentData(fetchedCommentData)
      } catch (error) {
        console.error('Error fetching comments:', error)
      }
    }

    fetchComments()
  }, [answer._id, comments.length]) // Add comments.length as a dependency

  function handleNextPage () {
    setCurrentPage(p => p + 1)
  }

  function handlePrevPage () {
    setCurrentPage(p => p - 1)
  }

  const handleAddComment = async () => {
    try {
      console.log(email)
      await modle.addComment(answer._id, newComment, email)
      const fetchedComments = await modle.getCommentsByAID(answer._id)
      setComments(fetchedComments)
      setNewComment('')
      console.log(comments)
    } catch (error) {
      console.error('Error adding comment:', error)
    }
  }

  const textWithLinks = replaceLinks(answer.text)
  return (
    <>
      <tr className="aRow">
        <td className="aTD aAns" dangerouslySetInnerHTML={{ __html: textWithLinks }}/>
        <td className="aTd aCred">
          <b>{answer.ans_by}</b> answered
          <br />
          {modle.formatDate(new Date(answer.ans_date_time))}
        </td>
      </tr>
      {
        commentData.slice((currentPage - 1) * 3, (currentPage - 1) * 3 + 3).map((comment) => (
          <tr key={comment._id} className="aRow">
            <td className="aComment aComSize" dangerouslySetInnerHTML={{ __html: comment.text }} />
            <td className="aComSize">
              <b>{comment.cum_by}</b> commented
              <br />
              {modle.formatDate(new Date(comment.cum_date_time))}
            </td>
          </tr>
        ))
      }
      {(comments.length > 0)
        ? (<tr>
          <td>
            <button id="prevbutt2" className="commentsort" onClick={handlePrevPage} disabled={isFirstPage}>Prev</button>
            <button id="nextbutt" className="commentsort" onClick={handleNextPage} disabled={isLastPage}>Next</button>
          </td>
        </tr>)
        : <></>}
      {(email !== '')
        ? (<tr className="aRow">
          <td className="addComment" style={{ paddingBottom: '15px' }}>
            <textarea id="ap_commenttext" value={newComment} placeholder="Add new comment" onChange={(e) => setNewComment(e.target.value)} />
          </td>
          <td className="addComment">
            <button id="ap_commentbutton" onClick={handleAddComment}>Add Comment</button>
          </td>
        </tr>)
        : <></>}
    </>
  )
}
Answer.propTypes = {
  answer: PropTypes.object.isRequired,
  email: PropTypes.string.isRequired
}
