import axios from 'axios'

export function addViews (qid) {
  axios.post(`http://localhost:8000/questions/${qid}/views`)
}

export function removeView (qid) {
  axios.post(`http://localhost:8000/questions/${qid}/removeviews`)
}

export function getViews (qid) {
  return axios.get(`http://localhost:8000/questions/${qid}`)
}

export async function getTagName (tagId) {
  const resp = await axios.get(`http://localhost:8000/tags/${tagId}`)
  return resp.data.name
}

export async function getAllTags () {
  const resp = await axios.get('http://localhost:8000/tags')
  return resp.data
}

export async function getAnswerCount (qid) {
  const resp = await axios.get(`http://localhost:8000/questions/${qid}`)
  console.log(resp.data.answers.length)
  return resp.data.answers.length
}

export async function getAnswerFromId (aid) {
  const resp = await axios.get(`http://localhost:8000/answers/${aid}`)
  return resp.data
}

export async function getAnswersByQID (qid) {
  const resp = await axios.get(`http://localhost:8000/questions/${qid}`)
  console.log(resp)
  const answers = await Promise.all(resp.data.answers.map(async (r) => {
    const ans = await getAnswerFromId(r)
    return ans
  }))
  return answers
}

export function getQuestions () {
  return axios.get('http://localhost:8000/questions').then((response) => {
    /* console.log(response.data) */
    return response.data
  }).catch((e) => {
    console.error(e)
  })
}

export function getQuestion (qid) {
  return axios.get(`http://localhost:8000/questions/${qid}`).then((response) => {
    console.log(response.data)
    return response.data
  }).catch((e) => {
    console.error(e)
  })
}

export function getAnswers () {
  return axios.get('http://localhost:8000/answers').then((response) => {
    /* console.log(response.data) */
    return response.data
  }).catch((e) => {
    console.error(e)
  })
}

export function getTags () {
  return axios.get('http://localhost:8000/tags').then((response) => {
    console.log(response.data)
    return response.data
  }).catch((e) => {
    console.error(e)
  })
}

export function tagExists (tagName) {
  return axios.get(`http://localhost:8000/tagNames/${tagName}`).then((response) => {
    console.log(response.data)
    return response.data
  }).catch((e) => {
    console.error(e); return false
  })
}

export function addTag (tag) {
  return axios.post('http://localhost:8000/tags', {
    name: tag
  }).then((response) => {
    console.log(response.data)
    return response.data
  }).catch((e) => {
    console.error(e)
  })
}

export function addQuestion (title, text, tags, user) {
  return axios.post('http://localhost:8000/questions', {
    title,
    text,
    tags,
    user
  }).then((response) => {
    console.log(response.data)
    return response.data
  }).catch((e) => {
    console.error(e)
  })
}

// eslint-disable-next-line camelcase
export async function addAnswer (qid, ans_by, text) {
  let newAnsId = null

  // Post a new answer
  await axios.post('http://localhost:8000/answers', {
    text,
    ans_by // eslint-disable-line camelcase
  }).then((response) => {
    console.log('New answer id ' + response.data)
    newAnsId = response.data
  }).catch((e) => {
    console.error(e)
  })

  // Make sure we have an answer id
  if (!newAnsId) {
    console.log('No answer id')
    return null
  }

  // // Get the current answers and concat
  // const currentAnswers = await getAnswersByQID(qid)
  // currentAnswers.concat(newAnsId) // eslint-disable-line camelcase

  // Update the question with the new answer
  axios.post(`http://localhost:8000/questions/${qid}/answers`, {
    aid: newAnsId
  }).then((response) => {
    console.log(response.data)
  }).catch((e) => {
    console.error(e)
  })
}

export async function getQuestionCountByTagId (tagId) {
  return (await getQuestions()).filter((q) => q.tags.includes(tagId)).length
}

export function formatDate (askDate, now = new Date()) {
  const timeDiffInSeconds = (now.getTime() - askDate.getTime()) / 1000
  const timeDiffInMinutes = timeDiffInSeconds / 60
  const timeDiffInHours = timeDiffInMinutes / 60
  const timeDiffInDays = timeDiffInHours / 24

  if (timeDiffInDays < 1) {
    if (timeDiffInMinutes < 1) {
      return `${Math.floor(timeDiffInSeconds)} second${
        Math.floor(timeDiffInSeconds) === 1 ? '' : 's'
      } ago`
    } else if (timeDiffInHours < 1) {
      return `${Math.floor(timeDiffInMinutes)} minute${
        Math.floor(timeDiffInMinutes) === 1 ? '' : 's'
      } ago`
    } else {
      return `${Math.floor(timeDiffInHours)} hour${
        Math.floor(timeDiffInHours) === 1 ? '' : 's'
      } ago`
    }
  } else if (timeDiffInDays < 365) {
    const formattedTime = `${askDate
      .getHours()
      .toString()
      .padStart(2, '0')}:${askDate.getMinutes().toString().padStart(2, '0')}`
    return `${askDate.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    })} at ${formattedTime}`
  } else {
    const formattedTime = `${askDate
      .getHours()
      .toString()
      .padStart(2, '0')}:${askDate.getMinutes().toString().padStart(2, '0')}`
    return `${askDate.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })} at ${formattedTime}`
  }
}
