import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
const modle = require('../models/axiosmodel.js')

export default function AllTags ({ setSearchQuery }) {
  const [tags, setTags] = useState([])

  useEffect(() => {
    async function updateTags () {
      const tagList = await modle.getAllTags()
      setTags(await Promise.all(
        tagList.map(async (tag, index) => {
          const questionCount = await modle.getQuestionCountByTagId(tag._id)
          return (<Tag key={tag._id} tag={tag} index={index} questionCount={questionCount} setSearchQuery={setSearchQuery}/>)
        })
      ))
    }
    updateTags()
  }, [])

  return (
    <>
      <p id="t_tagcount">{tags.length} Tags</p>
      <p id="t_alltags">All Tags</p>
      <br /><br /><br />
      <div id="tagcontainer">{tags}</div>
    </>
  )
}
AllTags.propTypes = {
  setSearchQuery: PropTypes.func.isRequired
}

export function Tag ({ tag, index, questionCount, setSearchQuery }) {
  return (
    <div className="tagbox" style={{ gridColumn: `${index % 3 + 1} / span 1`, gridRow: 'auto' }}>
      <p className="taglink" onClick={setSearchQuery(`[${tag.name}]`)}>{tag.name}</p>
      <p className="tagqcount">{questionCount} question{questionCount === 1 ? '' : 's'}</p>
    </div>
  )
}
Tag.propTypes = {
  tag: PropTypes.object.isRequired,
  index: PropTypes.number.isRequired,
  questionCount: PropTypes.number.isRequired,
  setSearchQuery: PropTypes.func.isRequired
}
