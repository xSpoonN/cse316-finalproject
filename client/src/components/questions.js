import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import '../stylesheets/questions.css'
import '../stylesheets/fakeStackOverflow.css'
const modle = require('../models/axiosmodel.js')

export function Question ({ qid, answers, views, title, tagList, askedBy, date, unans, setActivePage }) {
  const [tagNames, setTagNames] = useState([])
  const setPage = (qid) => () => {
    setActivePage(qid)
  }

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

  if (unans && answers) return undefined
  return (
    <tr className="qRow">
      <td className="qTD">
        {answers} answers <br />
        {views} views
      </td>

      <td className="qTD">
        <a className="qlink" onClick={ setPage(qid) }>{title}</a>
        <br/>
        {tagNames.map((name, i) => (<button key={tagList[i]} className="qtag">{name}</button>))}
      </td>

      <td className="qTD"><b>{askedBy}</b> {`asked ${modle.formatDate(date)}`}</td>
    </tr>
  )
}
Question.propTypes = {
  qid: PropTypes.string.isRequired,
  answers: PropTypes.number.isRequired,
  views: PropTypes.number.isRequired,
  title: PropTypes.string.isRequired,
  tagList: PropTypes.array.isRequired,
  askedBy: PropTypes.string.isRequired,
  date: PropTypes.instanceOf(Date).isRequired,
  unans: PropTypes.bool.isRequired,
  setActivePage: PropTypes.func.isRequired
}

export default function Questions ({ searchQuery, fun }) {
  const [sortOrder, setSortOrder] = useState('Newest')
  const [questionList, setQuestionList] = useState([])
  const [qCount, setQCount] = useState(0)

  async function search (query, q, t) {
    if (!q) q = await modle.getQuestions()
    if (!t) t = await modle.getTags()
    let searchTerms = query.toLowerCase().split(' ')
    let changed = false
    do {
      changed = false
      for (const term of searchTerms) {
        const ind = term.indexOf('][')
        if (ind !== -1) {
          searchTerms.push(term.slice(0, ind + 1))
          searchTerms.push(term.slice(ind + 1))
          searchTerms = searchTerms.filter((x) => x !== term)
          changed = true
        }
      }
    } while (changed)

    const searchWords = searchTerms.filter((word) => !/^\[\S+\]$/.test(word)) /* Words are those that are not surrounded in brackets */
    const searchTags = searchTerms
      .filter((word) => /^\[\S+\]$/.test(word)) /* Tests for [x] for tags */
      .map((tag) => tag.replace(/\[|\]/g, '')) /* Deletes the brackets from each tag */
    const out = []
    for (let i = 0; i < q.length; i++) {
      if (
        (searchWords.some((term) =>
          q[i].title.toLowerCase().includes(term) || /* Title includes a search term */
          q[i].text.toLowerCase().includes(term) /* Description includes the search term */
        ) || !searchWords.length) /* Or there are no search words */ && /* AND */
        (q[i].tags.some((tag) =>
          searchTags.some((term) => term === t.find((x) => x._id === tag).name) /* Tag name matches a search tag */
        ) || !searchTags.length) /* Or there are no search tags */
      ) out.push(q[i])
    }
    /* console.log(`Searched "${query}", words: [ ${searchWords} ], tags: [ ${searchTags} ]`) */
    return out
  }

  useEffect(() => {
    async function fetchQuestions (qList) {
      if (!qList) qList = await modle.getQuestions()
      /* console.log(qList) */
      /* Sort Options */
      if (searchQuery) qList = await search(searchQuery)
      if (sortOrder === 'Newest' || sortOrder === 'Unanswered') {
        qList = qList.sort((a, b) => (new Date(b.ask_date_time) > new Date(a.ask_date_time)) ? -1 : 1); qList.reverse()
      } else if (sortOrder === 'Active') {
        await qList.sort(compareActive)
      }

      // eslint-disable-next-line camelcase
      const qL = qList.map(({ _id, answers, views, title, tags, asked_by, ask_date_time }) => {
        if (sortOrder === 'Unanswered' && answers.length) return undefined
        return (
          <Question
            qid={_id}
            answers={answers.length}
            views={views}
            title={title}
            tagList={tags}
            askedBy={asked_by} // eslint-disable-line camelcase
            date={new Date(ask_date_time)} // eslint-disable-line camelcase
            key={_id}
            unans={sortOrder === 'Unanswered'}
            setActivePage={fun}
          />
        )
      })
      qL.unshift(<tr className="qRow" key="RowFiller"></tr>) /* Adds a blank row at the top to get the top border */
      setQuestionList(qL)
      setQCount(qL.filter(q => q).length)
      return qL
    }
    fetchQuestions()
  }, [sortOrder])

  async function compareActive (a, b) {
    let aLatest = 0
    let bLatest = 0
    const ans = await modle.getAnswers()
    /* console.log(ans) */
    for (let i = 0; i < a.answers.length; i++) { // Finds the latest answer
      const answe = ans.find((x) => x._id === a.answers[i])
      if (!aLatest || new Date(answe.ans_date_time) > aLatest) aLatest = new Date(answe.ans_date_time)
    }
    for (let i = 0; i < b.answers.length; i++) { // Finds the latest answer
      const answe = ans.find((x) => x._id === b.answers[i])
      if (!bLatest || new Date(answe.ans_date_time) > bLatest) bLatest = new Date(answe.ans_date_time)
    }
    return bLatest - aLatest
  }

  return (
    <div>
      <p id="questioncount">
        {`${(qCount - 1) === 1
          ? '1 question'
          : (qCount - 1) <= 0 ? 'No Questions Found.' : (qCount - 1) + ' questions'
          }`}
      </p>
      <button id="newbutt" className="questionsort" onClick={() => setSortOrder('Newest')}>Newest</button>
      <button id="activebutt" className="questionsort" onClick={() => setSortOrder('Active')}>Active</button>
      <button id="unbutt" className="questionsort" onClick={() => setSortOrder('Unanswered')}>Unanswered</button>
      <br id="liststart"/>
      <table className="questions">
        <tbody>{questionList}</tbody>
      </table>
    </div>
  )
}
Questions.propTypes = {
  searchQuery: PropTypes.string,
  fun: PropTypes.func.isRequired
}
