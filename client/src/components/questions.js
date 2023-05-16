import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import '../stylesheets/questions.css'
import '../stylesheets/fakeStackOverflow.css'
const modle = require('../models/axiosmodel.js')

export function Question ({ qid, answers, views, title, tagList, askedBy, date, unans, setActivePage, rep, email, upvoters, downvoters, setError }) {
  const [tagNames, setTagNames] = useState([])
  const [reputation, setReputation] = useState(rep)
  const [voteStatus, setVoteStatus] = useState(0)
  const setPage = (qid) => async () => {
    await modle.addViews(qid)
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

  useEffect(() => {
    async function fetchVoteStatus () {
      if (!email) return
      const user = await modle.getUser(email)
      if (user) {
        if (upvoters?.includes(user._id)) setVoteStatus(1)
        else if (downvoters?.includes(user._id)) setVoteStatus(-1)
      }
    }
    fetchVoteStatus()
  }, [])

  const handleUpvote = async () => {
    if (!email) return setError({ msg: 'You must be logged in to vote!', duration: 3000 })
    const resp = await modle.addRep('question', qid, 1, email)
    if (resp?.err) setError({ msg: resp.err, duration: 3000 })
    setReputation(resp.updated.rep)
    const user = await modle.getUser(email)
    if (resp?.updated.upvoters.includes(user._id)) setVoteStatus(1)
    else setVoteStatus(0)
  }

  const handleDownvote = async () => {
    if (!email) return setError({ msg: 'You must be logged in to vote!', duration: 3000 })
    const resp = await modle.addRep('question', qid, -1, email)
    if (resp?.err) setError({ msg: resp.err, duration: 3000 })
    setReputation(resp.updated.rep)
    const user = await modle.getUser(email)
    if (resp?.updated.downvoters.includes(user._id)) setVoteStatus(-1)
    else setVoteStatus(0)
  }

  if (unans && answers) return undefined
  return (
    <tr className="qRow">
      <td className="qV">
        <button className={voteStatus === 1 ? 'qvote upvoted' : 'qvote'} onClick={handleUpvote}>▲</button>
        <br/>
        {reputation}
        <br/>
        <button className={voteStatus === -1 ? 'qvote downvoted' : 'qvote'} onClick={handleDownvote}>▼</button>
      </td>
      <td className="qTD qANSVIEWS">
        {answers} answers <br />
        {views} views
      </td>

      <td className="qTD qTITLE">
        <a className="qlink" onClick={ setPage(qid) }>{title}</a>
        <br/>
        {tagNames.map((name, i) => (<button key={tagList[i]} className="qtag">{name}</button>))}
      </td>

      <td className="qTD qAUTHOR"><b>{askedBy}</b> {`asked ${modle.formatDate(date)}`}</td>
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
  setActivePage: PropTypes.func.isRequired,
  rep: PropTypes.number.isRequired,
  email: PropTypes.string.isRequired,
  upvoters: PropTypes.array.isRequired,
  downvoters: PropTypes.array.isRequired,
  setError: PropTypes.func.isRequired
}

export default function Questions ({ searchQuery, fun, email, setError }) {
  const [sortOrder, setSortOrder] = useState('Newest')
  const [questionList, setQuestionList] = useState([])
  const [qCount, setQCount] = useState(0)
  const [currentPage, setCurrentPage] = useState(1) // eslint-disable-line no-unused-vars

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

  const isFirstPage = currentPage === 1
  const isLastPage = currentPage * 5 >= qCount

  useEffect(() => {
    async function fetchQuestions (qList) {
      if (!qList) qList = await modle.getQuestions()
      if (!qList) setError({ msg: 'Failed to fetch questions', duration: 3000 })
      /* console.log(qList) */
      /* Sort Options */
      if (searchQuery) qList = await search(searchQuery)
      if (sortOrder === 'Newest' || sortOrder === 'Unanswered') {
        qList = qList.sort((a, b) => (new Date(b.ask_date_time) > new Date(a.ask_date_time)) ? -1 : 1); qList.reverse()
      } else if (sortOrder === 'Active') {
        await qList.sort(compareActive)
      }

      // eslint-disable-next-line camelcase
      const qL = qList.map(({ _id, answers, views, title, tags, asked_by, ask_date_time, rep, upvoters, downvoters }) => {
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
            rep={rep}
            email={email}
            upvoters={upvoters}
            downvoters={downvoters}
            setError={setError}
          />
        )
      })
      /* qL.unshift(<tr className="qRow" key="RowFiller"></tr>) */ /* Adds a blank row at the top to get the top border */
      setQCount(qL.filter(q => q).length)
      const startIndex = (currentPage - 1) * ((isFirstPage) ? 6 : 5)
      const pageQuestions = qL.slice(startIndex, startIndex + ((isFirstPage) ? 6 : 5))
      setQuestionList(pageQuestions)
      return pageQuestions
    }
    fetchQuestions()
  }, [sortOrder, currentPage])

  function handleNextPage () {
    setCurrentPage((prev) => prev + 1)
  }

  function handlePrevPage () {
    setCurrentPage((prev) => prev - 1)
  }

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
      <hr style={{ borderTop: 'dotted 1px' }}/>
      <table className="questions">
        <tbody>{questionList}</tbody>
      </table>
      <div>
        <button id="prevbutt" className="questionsort" onClick={handlePrevPage} disabled={isFirstPage}>Prev</button>
        <button id="nextbutt" className="questionsort" onClick={handleNextPage} disabled={isLastPage}>Next</button>
      </div>
    </div>
  )
}
Questions.propTypes = {
  searchQuery: PropTypes.string,
  fun: PropTypes.func.isRequired,
  email: PropTypes.string.isRequired,
  setError: PropTypes.func.isRequired
}
