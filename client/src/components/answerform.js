import React, { useState } from 'react'
import PropTypes from 'prop-types'
import '../stylesheets/answerform.css' /* I'm not sure if this line even matters but why not ig */
import { validateLinks } from './questionform'
const modle = require('../models/axiosmodel.js')

export default function AnswerForm ({ setActivePage, qid, email }) {
  const [text, setText] = useState('')

  const [textError, setTextError] = useState('')

  const handleTextChange = (event) => { setText(event.target.value) }

  async function handleSubmit (event) {
    event.preventDefault()

    if (checkQuestionForm()) {
      const user = await modle.getUser(email)
      await modle.addAnswer(qid, user.username, text, email)
      // modle.removeView(qid) // Ensure the view is not double-counted
      setActivePage('Answers')
    }
  }

  function checkQuestionForm () {
    let errFound = false

    /* Validate Description */
    if (!text.length) {
      setTextError('A description is required!'); errFound = true
    } else setTextError('')

    /* Validate Any Hyperlinks */
    const invalidLink = validateLinks(text)
    if (invalidLink) {
      setTextError(`Invalid hyperlink: '${invalidLink}'. Hyperlink must begin with 'http://' or 'https://'`)
      errFound = true
    }

    return !errFound
  }

  return (
    <>
    <form onSubmit={handleSubmit}>
      <div>
        <h2>Answer Text*</h2>
        <p style={{ fontStyle: 'italic' }}>Add details</p>
        <textarea name="answerdesc" id="atext" value={text} onChange={handleTextChange} cols={80} rows={10}></textarea>
        <p className="errormsg" id="atexterror">{textError}</p>
        <br /><br /><br /><br /><br />

        <input type="submit" id="postabutt" value="Post Answer" />
        <p style={{ textAlign: 'right' }}>* indicates mandatory fields</p>
      </div>
    </form>
    </>
  )
}
AnswerForm.propTypes = {
  setActivePage: PropTypes.func.isRequired,
  qid: PropTypes.string.isRequired,
  email: PropTypes.string.isRequired
}
