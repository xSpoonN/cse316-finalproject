import React, { useState, useEffect } from 'react'
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

export default function QuestionForm ({ setActivePage, email, updateQid, setUpdateQid, setError }) {
  const [title, setTitle] = useState('')
  const [text, setText] = useState('')
  const [tags, setTags] = useState('')

  useEffect(() => {
    if (updateQid !== '') {
      modle.getQuestion(updateQid).then(async (question) => {
        setTitle(question.title)
        setText(question.text)
        const tagnames = await Promise.all(question.tags.map(async (tag) => {
          const name = await modle.getTagName(tag)
          return name
        }))
        setTags(tagnames.join(' '))
      })
    }
  }, [])

  const [titleError, setTitleError] = useState('')
  const [textError, setTextError] = useState('')
  const [tagsError, setTagsError] = useState('')

  const handleTitleChange = (event) => { setTitle(event.target.value) }
  const handleTextChange = (event) => { setText(event.target.value) }
  const handleTagsChange = (event) => { setTags(event.target.value) }

  async function handleSubmit (event) {
    event.preventDefault()

    if (checkQuestionForm()) {
      const tagsList = tags.split(' ')
      const user = await modle.getUser(email)
      try {
        const tagIds = await Promise.all(tagsList.map(async (tag) => {
          const tagExists = await modle.tagExists(tag.toLowerCase())
          console.log(tagExists)
          if (tagExists.length) return tagExists[0]._id
          else if (user.reputation < 50 && !user.isAdmin) {
            // setError('You must have at least 50 reputation to create a new tag!')
            throw new Error('You must have at least 50 reputation to create a new tag!')
          } else return modle.addTag(tag.toLowerCase(), user._id)
        }))
        if (updateQid === '') {
          await modle.addQuestion(title, text, tagIds, user.username, email)
        } else {
          await modle.editQuestion(updateQid, title, text, tagIds)
          setUpdateQid('')
        }
        setActivePage('Questions')
      } catch (err) {
        setError({ msg: 'You must have at least 50 reputation to create a new tag!', duration: 3000 })
        console.log(err)
      }
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

    return !errFound
  }

  async function deleteQuestion () {
    await modle.deleteQuestion(updateQid)
    setActivePage('Profile')
  }

  return (
    <>
    {updateQid !== '' && <button className="delbutt" onClick={deleteQuestion}>Delete Question</button>}
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
        <br /><br /><br /><br /><br />

        <input type="submit" id="postqbutt" value={updateQid !== '' ? 'Update Question' : 'Post Question'} />
        <p style={{ textAlign: 'right' }}>* indicates mandatory fields</p>
      </div>
    </form>
    </>
  )
}
QuestionForm.propTypes = {
  setActivePage: PropTypes.func.isRequired,
  email: PropTypes.string.isRequired,
  updateQid: PropTypes.string.isRequired,
  setUpdateQid: PropTypes.func.isRequired,
  setError: PropTypes.func.isRequired
}
