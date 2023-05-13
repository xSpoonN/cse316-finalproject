import axios from 'axios'

/* ************* VIEWS ************* */
export async function addViews (qid) { /* Increments the views of a question */
  await axios.post(`http://localhost:8000/questions/${qid}/views`)
}

export function removeView (qid) { /* Decrements the views of a question */
  axios.post(`http://localhost:8000/questions/${qid}/removeviews`)
}

export function getViews (qid) { /* Gets the views of a question */
  return axios.get(`http://localhost:8000/questions/${qid}`)
}

//
//
//

/* ************* TAGS ************* */
/** Gets a tag name from an id
 *
 * @param {string} tagId Id of the tag to get
 * @returns {string} Returns the name of the tag
 */
export async function getTagName (tagId) { /* Gets the name of a tag */
  const resp = await axios.get(`http://localhost:8000/tags/${tagId}`)
  return resp.data.name
}

/** Gets all tags
 *
 * @returns {Promise<Array>} Returns an array of all tags
 */
export async function getAllTags () {
  const resp = await axios.get('http://localhost:8000/tags')
  return resp.data
}

/** Gets all tags
 *
 * @returns {Promise<Array>} Returns an array of all tag names
 */
export function getTags () {
  return axios.get('http://localhost:8000/tags').then((response) => {
    console.log(response.data)
    return response.data
  }).catch((e) => {
    console.error(e)
  })
}

/** Checks if a tag exists
 *
 * @param {string} tagName Name of the tag to check
 * @returns {Promise<string>} Returns the tag name if it exists
 */
export function tagExists (tagName) {
  return axios.get(`http://localhost:8000/tagNames/${tagName}`).then((response) => {
    console.log(response.data)
    return response.data
  }).catch((e) => {
    console.error(e); return false
  })
}

/** Adds a tag
 *
 * @param {string} tag Name of the tag to add
 * @returns {Promise<string>} The tag id if it was added
 */
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

//
//
//

/* ************* ANSWERS ************* */
/** Gets an answer from an id
 *
 * @param {string} aid Id of the answer to get
 * @returns {Promise<Answer>} Returns the answer object
 */
export async function getAnswerFromId (aid) {
  const resp = await axios.get(`http://localhost:8000/answers/${aid}`)
  return resp.data
}

/** Gets all answers for a question
 *
 * @param {string} qid Id of the question to get answers for
 * @returns {Promise<Array<Answer>>} Returns an array of answers for the question
 */
export async function getAnswersByQID (qid) {
  const resp = await axios.get(`http://localhost:8000/questions/${qid}`)
  /* console.log(resp) */
  const answers = await Promise.all(resp.data.answers.map(async (r) => {
    const ans = await getAnswerFromId(r)
    return ans
  }))
  return answers
}

/** Adds an answer to a question
 *
 * @param {string} qid Id of the question to add an answer to
 * @param {string} ansby Id of the user who answered
 * @param {string} text Text of the answer
 * @returns {Promise<string>} Returns the id of the new answer
 */
export async function addAnswer (qid, ansby, text) {
  let newAnsId = null

  // Post a new answer
  await axios.post('http://localhost:8000/answers', {
    text,
    ans_by: ansby
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

  // Update the question with the new answer
  axios.post(`http://localhost:8000/questions/${qid}/answers`, {
    aid: newAnsId
  }).then((response) => {
    console.log(response.data)
  }).catch((e) => {
    console.error(e)
  })
}

export function getAnswers () { /* Gets all answers */
  return axios.get('http://localhost:8000/answers').then((response) => {
    /* console.log(response.data) */
    return response.data
  }).catch((e) => {
    console.error(e)
  })
}

//
//
//

/* ************* QUESTIONS ************* */
export function getQuestions () { /* Gets all questions */
  return axios.get('http://localhost:8000/questions').then((response) => {
    /* console.log(response.data) */
    return response.data
  }).catch((e) => {
    console.error(e)
  })
}

export function getQuestionsByEmail (email) {
  return axios.get(`http://localhost:8000/questionEmail/${email}`).then((response) => {
    /* console.log(response.data) */
    return response.data
  }).catch((e) => {
    console.error(e)
  })
}

export function getQuestion (qid) { /* Gets a question from an id */
  return axios.get(`http://localhost:8000/questions/${qid}`).then((response) => {
    console.log(response.data)
    return response.data
  }).catch((e) => {
    console.error(e)
  })
}

export function addQuestion (title, text, tags, user, email) {
  return axios.post('http://localhost:8000/questions', {
    title,
    text,
    tags,
    user,
    email
  }).then((response) => {
    console.log(response.data)
    return response.data
  }).catch((e) => {
    console.error(e)
  })
}

export async function getQuestionCountByTagId (tagId) { /* Gets the number of questions for a tag */
  return (await getQuestions()).filter((q) => q.tags.includes(tagId)).length
}

//
//
//

/* ************* COMMENTS ************* */
export function getCommentsByAID (aid) { /* Gets all comments for an answer */
  return axios.get(`http://localhost:8000/comments/${aid}`).then((response) => {
    /* console.log(response.data) */
    return response
  }).catch((e) => {
    console.error(e)
  })
}

export function getCommentByID (cid) { /* Gets a comment from an id */
  return axios.get(`http://localhost:8000/comment/${cid}`).then((response) => {
    /* console.log(response.data) */
    return response
  }).catch((e) => {
    console.error(e)
  })
}

export function addComment (aid, text, user) { /* Adds a comment to an answer */
  return axios.post('http://localhost:8000/comments', {
    text,
    aid,
    user
  }).then((response) => {
    /* console.log(response.data) */
    return response.data
  }).catch((e) => {
    console.error(e)
  })
}

//
//
//

/* ************* USERS ************* */
export function addUser (email, username, password) { /* Adds a user */
  return axios.post('http://localhost:8000/users', {
    email,
    username,
    password
  }).then((response) => {
    console.log(response.data)
    return response.data
  }).catch((e) => {
    console.error(e)
  })
}

export function getUser (email) { /* Gets a user from an email */
  return axios.get(`http://localhost:8000/users/${email}`).then((response) => {
    // console.log(response.data)
    return response.data
  }).catch((e) => {
    console.error(e)
  })
}

export function loginUser (email, password) { /* Logs in a user */
  return axios.post('http://localhost:8000/userLogin/', {
    email,
    password
  }).then((response) => {
    /* console.log(response.data) */
    return response
  }).catch((e) => {
    console.error(e)
    throw e
  })
}

export function formatDate (askDate, now = new Date()) { /* Formats a date */
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
