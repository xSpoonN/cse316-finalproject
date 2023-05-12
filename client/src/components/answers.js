import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
const modle = require('../models/axiosmodel.js')

function replaceLinks (text) {
  if (!text) return ''
  return text.replace(/\[(.*?)\]\((.*?)\)/g, (full, name, link) => {
    return (link.match(/^https?:\/\//)) ? `<a href='${link}'>${name}</a>` : full
  })
}

export default function Answers ({ qid, gotoPostAnswerPage }) {
  const [questionData, setQuestionData] = useState(null)
  const [answers, setAnswers] = useState([])
  const [currentPage, setCurrentPage] = useState(1) // eslint-disable-line no-unused-vars

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
            <Answer key={answer._id} answer={answer} />
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
  gotoPostAnswerPage: PropTypes.func.isRequired
}

export function Answer ({ answer }) {
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
    </>
  )
}
Answer.propTypes = {
  answer: PropTypes.object.isRequired
}
