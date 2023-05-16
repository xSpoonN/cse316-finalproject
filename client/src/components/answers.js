import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
const modle = require('../models/axiosmodel.js')

function replaceLinks (text) {
  if (!text) return ''
  return text.replace(/\[(.*?)\]\((.*?)\)/g, (full, name, link) => {
    return (link.match(/^https?:\/\//)) ? `<a href='${link}'>${name}</a>` : full
  })
}

export default function Answers ({ qid, gotoPostAnswerPage, email, setError }) {
  const [questionData, setQuestionData] = useState(null)
  const [tagNames, setTagNames] = useState([])
  const [answers, setAnswers] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [voteStatus, setVoteStatus] = useState(0)

  const isFirstPage = currentPage === 1
  const isLastPage = answers === undefined ? true : currentPage * 5 >= answers.length

  useEffect(() => {
    async function fetchData () {
      const question = await modle.getQuestion(qid)
      setQuestionData(question)
      const tagNames = await Promise.all(question.tags.map(async (tag) => {
        const tagData = await modle.getTagName(tag)
        return tagData
      }))
      setTagNames(tagNames)
      console.log(tagNames)
      setAnswers((await modle.getAnswersByQID(qid)).sort((a, b) => {
        return new Date(b.ans_date_time) - new Date(a.ans_date_time)
      }))
      // modle.addViews(qid)
    }
    fetchData()
  }, [qid, currentPage])

  useEffect(() => {
    async function fetchVoteStatus () {
      const user = await modle.getUser(email)
      if (user) {
        if (questionData?.upvoters?.includes(user._id)) setVoteStatus(1)
        else if (questionData?.downvoters?.includes(user._id)) setVoteStatus(-1)
        else setVoteStatus(0)
      }
    }
    fetchVoteStatus()
  }, [email, questionData])

  function handleNextPage () { setCurrentPage(p => p + 1) }
  function handlePrevPage () { setCurrentPage(p => p - 1) }

  const handleUpvote = async () => {
    const resp = await modle.addRep('question', qid, 1, email)
    if (resp?.err) {
      setError(resp.err)
      setTimeout(() => setError(''), 3000)
    }
    setVoteStatus(1)
    setQuestionData((data) => ({
      ...data,
      rep: resp.updated.rep,
      upvoters: resp.updated.upvoters,
      downvoters: resp.updated.downvoters
    }))
  }

  const handleDownvote = async () => {
    const resp = await modle.addRep('question', qid, -1, email)
    if (resp?.err) {
      setError(resp.err)
      setTimeout(() => setError(''), 3000)
    }
    setVoteStatus(-1)
    setQuestionData((data) => ({
      ...data,
      rep: resp.updated.rep,
      upvoters: resp.updated.upvoters,
      downvoters: resp.updated.downvoters
    }))
  }

  if (!questionData) return <p>Loading...</p>

  const textWithLinks = replaceLinks(questionData.text)

  return (
    <>
      <p id="ap_answercount"><b>{questionData.answers.length} answers</b></p>
      <p id="ap_questiontitle"><b>{questionData.title}</b></p>
      <br/>
      <p id="ap_views"><b>{questionData.views} views</b></p>
      <p id="ap_rep">
        <button className={voteStatus === 1 ? 'avote upvoted' : 'avote'} onClick={handleUpvote}>▲</button>
        <br />
        {questionData.rep}
        <br />
        <button className={voteStatus === -1 ? 'avote downvoted' : 'avote'} onClick={handleDownvote}>▼</button>
      </p>
      <p id="ap_questiontext" dangerouslySetInnerHTML={{ __html: textWithLinks }}/>
      <p id="ap_askedby">
        <b>{questionData.asked_by}</b> asked<br />
        {modle.formatDate(new Date(questionData.ask_date_time))}
      </p>
      <br/>
      {tagNames.map((name, i) => (<button key={tagNames[i]} className="qtag">{name}</button>))}
      <br />
      <table className="ap_answers">
        <tbody>
          <tr className="aRow">
            <td className="aTD aAns"></td>
            <td className="aTD aCred"></td>
          </tr>
          {answers.slice((currentPage - 1) * 5, (currentPage - 1) * 5 + 5).map((answer) => (
            <Answer key={answer._id} answer={answer} email={email} setError={setError}/>
          ))}
        </tbody>
      </table>
      <br />
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
  email: PropTypes.string.isRequired,
  setError: PropTypes.func.isRequired
}

export function Answer ({ answer, email, setError }) {
  const [comments, setComments] = useState([])
  const [commentData, setCommentData] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [newComment, setNewComment] = useState('')
  const [answerData, setAnswerData] = useState(answer)
  const [voteStatus, setVoteStatus] = useState(0)

  const isFirstPage = currentPage === 1
  const isLastPage = comments === undefined ? true : currentPage * 3 >= comments.length

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const answerData = await modle.getAnswerFromId(answer._id)
        setAnswerData(answerData)

        const comments = await modle.getCommentsByAID(answer._id)
        setComments(comments.data)
        const fetchedCommentData = await Promise.all(
          comments.data.map(async (comment) => {
            const commentData = await modle.getCommentByID(comment)
            const user = await modle.getUser(commentData.data.cum_by)
            const author = user ? user.username : 'Unknown'
            return {
              ...commentData.data,
              cum_by: author
            }
          })
        )
        setCommentData(fetchedCommentData)
      } catch (error) {
        console.error('Error fetching comments:', error)
      }
    }

    fetchComments()
  }, [answer._id, comments.length, currentPage])

  useEffect(() => {
    async function fetchVoteStatus () {
      const user = await modle.getUser(email)
      if (user) {
        if (answerData?.upvoters?.includes(user._id)) setVoteStatus(1)
        else if (answerData?.downvoters?.includes(user._id)) setVoteStatus(-1)
        else setVoteStatus(0)
      }
    }
    fetchVoteStatus()
  }, [email, answerData])

  function handleNextPage () { setCurrentPage(p => p + 1) }
  function handlePrevPage () { setCurrentPage(p => p - 1) }

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

  const handleUpvote = async () => {
    const resp = await modle.addRep('answer', answer._id, 1, email)
    if (resp?.err) {
      setError(resp.err)
      setTimeout(() => setError(''), 3000)
    }
    setVoteStatus(1)
    setAnswerData((data) => ({
      ...data,
      reputation: resp.updated.reputation,
      upvoters: resp.updated.upvoters,
      downvoters: resp.updated.downvoters
    }))
    /* console.log(resp.updated.reputation) */
  }

  const handleDownvote = async () => {
    const resp = await modle.addRep('answer', answer._id, -1, email)
    if (resp?.err) {
      setError(resp.err)
      setTimeout(() => setError(''), 3000)
    }
    setVoteStatus(-1)
    setAnswerData((data) => ({
      ...data,
      reputation: resp.updated.reputation,
      upvoters: resp.updated.upvoters,
      downvoters: resp.updated.downvoters
    }))
    /* console.log(resp.updated.reputation) */
  }

  const textWithLinks = replaceLinks(answer.text)
  return (
    <>
      <tr className="aRow">
        <td className="aV">
          <button className={voteStatus === 1 ? 'avote upvoted' : 'avote'} onClick={handleUpvote}>▲</button>
          <br/>
          {answerData.reputation}
          <br/>
          <button className={voteStatus === -1 ? 'avote downvoted' : 'avote'} onClick={handleDownvote}>▼</button>
        </td>
        <td className="aTD aAns" dangerouslySetInnerHTML={{ __html: textWithLinks }}/>
        <td className="aTD aCred">
          <b>{answer.ans_by}</b> answered
          <br />
          {modle.formatDate(new Date(answer.ans_date_time))}
        </td>
      </tr>
      {
        commentData.slice((currentPage - 1) * 3, (currentPage - 1) * 3 + 3).map((comment) => (
          <Comment key={comment._id} comment={comment} email={email}/>
        ))
      }
      {(comments.length > 0)
        ? (<tr>
          <td></td>
          <td>
            <button id="prevbutt2" className="commentsort" onClick={handlePrevPage} disabled={isFirstPage}>Prev</button>
            <button id="nextbutt" className="commentsort" onClick={handleNextPage} disabled={isLastPage}>Next</button>
          </td>
        </tr>)
        : <></>}
      {(email !== '')
        ? (<tr className="aRow">
          <td></td>
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
  email: PropTypes.string.isRequired,
  setError: PropTypes.func.isRequired
}

export function Comment ({ comment, email }) {
  const [voteStatus, setVoteStatus] = useState(0)
  const [commentData, setCommentData] = useState(comment)

  useEffect(() => {
    async function fetchVoteStatus () {
      const user = await modle.getUser(email)
      if (user) {
        if (commentData?.voters?.includes(user._id)) setVoteStatus(1)
        else setVoteStatus(0)
      }
    }
    fetchVoteStatus()
  }, [email, commentData])

  const handleUpvote = async () => {
    const resp = await modle.addRep('comment', comment._id, 1, email)
    /* console.log(resp) */
    setVoteStatus(1)
    setCommentData((data) => ({
      ...data,
      rep: resp.updated.rep,
      voters: resp.updated.voters
    }))
  }

  return (
    <tr className="aRow">
      <td className="acV">
        <button className={voteStatus === 1 ? 'avote upvoted' : 'avote'} onClick={handleUpvote}>▲</button>
        <br/>
        {commentData.rep}
        <br/>
      </td>
      <td className="aComment aComSize" dangerouslySetInnerHTML={{ __html: comment.text }} />
      <td className="aComSize">
        <b>{comment.cum_by}</b> commented
        <br />
        {modle.formatDate(new Date(comment.cum_date_time))}
      </td>
    </tr>
  )
}
Comment.propTypes = {
  comment: PropTypes.object.isRequired,
  email: PropTypes.string.isRequired
}
