import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import '../stylesheets/alltags.css'
const modle = require('../models/axiosmodel.js')

export default function AllTags ({ setSearchQuery, email = '', setError }) {
  const [tags, setTags] = useState([])
  const [update, setUpdate] = useState(0)

  useEffect(() => {
    async function updateTags () {
      const tagList = email === '' ? await modle.getAllTags() : await modle.getTagsByEmail(email)
      setTags(await Promise.all(
        tagList.map(async (tag, index) => {
          const questionCount = await modle.getQuestionCountByTagId(tag._id)
          return (<Tag key={tag._id} tag={tag} index={index} questionCount={questionCount} setSearchQuery={setSearchQuery} email={email} setError={setError} setUpdate={setUpdate}/>)
        })
      ))
    }
    updateTags()
  }, [update])

  return (
    <>
      <p id="t_tagcount">{tags.length} Tags</p>
      <p id="t_alltags">{email === '' ? 'All' : 'Your'} Tags</p>
      <br /><br /><br />
      <div id="tagcontainer">{tags}</div>
    </>
  )
}
AllTags.propTypes = {
  setSearchQuery: PropTypes.func.isRequired,
  email: PropTypes.string,
  setError: PropTypes.func.isRequired
}

export function Tag ({ tag, index, questionCount, setSearchQuery, email, setError, setUpdate }) {
  const [tagName, setTagName] = useState(tag.name)
  const [tagbox, setTagbox] = useState(tag.name)

  async function modifyable () {
    const questionsByTag = await modle.getQuestionsByTagId(tag._id)
    return questionsByTag.every(question => question.asked_by_email === email)
  }

  async function available () {
    const tags = await modle.getAllTags()
    return tags.every(t => t.name !== tagbox /* || t._id === tag._id */)
  }

  async function rename () {
    const regex = /^((?<=[\w+?#.])-?(?=[\w+?#.])|[\w+?#.]){1,10}$/
    if (!tagbox.match(regex)) {
      setError({ msg: 'New tag name is invalid', duration: 3000 })
      return
    }
    if (!(await modifyable())) {
      setError({ msg: 'This tag is in use by other users', duration: 3000 })
      return
    }
    if (!(await available())) {
      setError({ msg: 'New tag name already exists', duration: 3000 })
      return
    }
    modle.renameTag(tag._id, tagbox)
    setTagName(tagbox)
  }

  async function remove () {
    if (!(await modifyable())) {
      setError({ msg: 'This tag is in use by other users', duration: 3000 })
      return
    }
    modle.removeTag(tag._id)
    setUpdate(u => u + 1)
  }

  return (
    <div className="tagbox" style={{ gridColumn: `${index % 3 + 1} / span 1`, gridRow: 'auto' }}>
      <p className="taglink" onClick={setSearchQuery(`[${tagName}]`)}>{tagName}</p>
      <p className="tagqcount">{questionCount} question{questionCount === 1 ? '' : 's'}</p>
      {email &&
      <>
        <input type="text" className="tageditbox" value={tagbox} onChange={(e) => { setTagbox(e.target.value) }} />
        <button className="tageditbutt" onClick={rename}>Rename</button>
        <br/>
        <button className="tagdelbutt" onClick={remove}>Delete</button>
      </>
      }
    </div>
  )
}
Tag.propTypes = {
  tag: PropTypes.object.isRequired,
  index: PropTypes.number.isRequired,
  questionCount: PropTypes.number.isRequired,
  setSearchQuery: PropTypes.func.isRequired,
  email: PropTypes.string.isRequired,
  setError: PropTypes.func.isRequired,
  setUpdate: PropTypes.func.isRequired
}
