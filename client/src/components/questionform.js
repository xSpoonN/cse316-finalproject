import React, { useState } from 'react'
import PropTypes from 'prop-types'
const modle = require('../models/axiosmodel.js')

export function validateLinks (text) {
  const matches = text.match(/\[(.*?)\]\((.*?)\)/g)
  if (matches) {
    for (const match of matches) {
      const [full, , link] = match.match(/\[(.*?)\]\((.*?)\)/)
      if (!link.match(/^https?:\/\//)) return full
    }
  }

  return null
}

export default function QuestionForm ({ setActivePage }) {
  const [title, setTitle] = useState('')
  const [text, setText] = useState('')
  const [tags, setTags] = useState('')
  const [user, setUser] = useState('')

  const [titleError, setTitleError] = useState('')
  const [textError, setTextError] = useState('')
  const [tagsError, setTagsError] = useState('')
  const [userError, setUserError] = useState('')

  const handleTitleChange = (event) => { setTitle(event.target.value) }
  const handleTextChange = (event) => { setText(event.target.value) }
  const handleTagsChange = (event) => { setTags(event.target.value) }
  const handleUserChange = (event) => { setUser(event.target.value) }

  async function handleSubmit (event) {
    event.preventDefault()

    if (checkQuestionForm()) {
      const tagsList = tags.split(' ')
      const tagIds = await Promise.all(tagsList.map(async (tag) => {
        const tagExists = await modle.tagExists(tag.toLowerCase())
        console.log(tagExists)
        return (tagExists.length) ? tagExists[0]._id : modle.addTag(tag.toLowerCase())
      }))

      await modle.addQuestion(title, text, tagIds, user)
      setActivePage('Questions')
    }
  }

  function checkQuestionForm () {
    let errFound = false

    /* Validate Title */
    if (title.length > 100) {
      setTitleError('Title must be 100 characters or less!'); errFound = true
    } else if (!title.length) {
      setTitleError('A title is required!'); errFound = true
    } else setTitleError('')

    /* Validate Description */
    if (!text.length) {
      setTextError('A description is required!'); errFound = true
    } else setTextError('')

    const invalidLink = validateLinks(text)
    /* console.log(invalidLink) */
    if (invalidLink) {
      setTextError(`Invalid hyperlink: '${invalidLink}'. Hyperlink must begin with 'http://' or 'https://'`)
      errFound = true
    }

    setText(text)

    /* Validate Tags */ /* regex auuuuuggghhhhhhh */
    if (!/^((?<=[\w+?#.])-?(?=[\w+?#.])|[\w+?#.]){1,10}(\s((?<=[\w+?#.])-?(?=[\w+?#.])|[\w+?#.]){1,10}){0,4}$/.test(tags)) {
      setTagsError('Between 1-5 tags of length 1-10 are required!'); errFound = true
    } else setTagsError('')

    /* Validate Username */
    if (!user.length) {
      setUserError('A username is required!'); errFound = true
    } else setUserError('')

    return !errFound
  }

  return (
    <form onSubmit={handleSubmit}>
      <div id="askquestion">
        <h2>Question Title*</h2>
        <p style={{ fontStyle: 'italic' }}>Limit title to 100 characters or less</p>
        <input type="text" name="questiontitle" value={title} onChange={handleTitleChange} maxLength={100} required />
        <p className="errormsg" id="qtitleerror">{titleError}</p>

        <h2>Question Text*</h2>
        <p style={{ fontStyle: 'italic' }}>Add details</p>
        <textarea name="questiondesc" value={text} onChange={handleTextChange} cols={80} rows={10}></textarea>
        <p className="errormsg" id="qtexterror">{textError}</p>

        <h2>Tags*</h2>
        <p style={{ fontStyle: 'italic' }}>Add keywords separated by whitespace</p>
        <input type="text" name="questiontags" value={tags} onChange={handleTagsChange} />
        <p className="errormsg" id="qtagserror">{tagsError}</p>

        <h2>Username*</h2>
        <input type="text" name="questionasker" value={user} onChange={handleUserChange} />
        <p className="errormsg" id="qusererror">{userError}</p>
        <br /><br /><br /><br /><br />

        <input type="submit" id="postqbutt" value="Post Question" />
        <p style={{ textAlign: 'right' }}>* indicates mandatory fields</p>
      </div>
    </form>
  )
}
QuestionForm.propTypes = {
  setActivePage: PropTypes.func.isRequired
}
