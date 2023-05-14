import axios from 'axios'

/* ************* VIEWS ************* */
/**
 * Adds a view to a question
 * @param {string} qid
 */
export async function addViews (qid) {
  await axios.post(`http://localhost:8000/questions/${qid}/views`)
}

/**
 * Removes a view from a question
 * @param {string} qid
 */
export function removeView (qid) {
  axios.post(`http://localhost:8000/questions/${qid}/removeviews`)
}

/**
 * Gets the number of views for a question
 * @param {string} qid
 * @returns {Promise<number>} Returns the number of views for the question
 */
export function getViews (qid) {
  return axios.get(`http://localhost:8000/questions/${qid}`)
}

//
//
//

/* ************* TAGS ************* */
/**
 * Gets a tag name from an id
 * @param {string} tagId
 * @returns {string} Returns the name of the tag
 */
export async function getTagName (tagId) {
  const resp = await axios.get(`http://localhost:8000/tags/${tagId}`)
  return resp.data.name
}

/**
 * Gets all tags
 * @returns {Promise<Array>} Returns an array of all tags
 */
export async function getAllTags () {
  const resp = await axios.get('http://localhost:8000/tags')
  return resp.data
}

/**
 * Gets all tags
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

/**
 * Checks if a tag exists
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

/**
 * Adds a tag
 * @param {string} tag Name of the tag to add
 * @returns {Promise<string>} The tag id if it was added
 */
export function addTag (tag, creator) {
  return axios.post('http://localhost:8000/tags', {
    name: tag,
    creator
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
/**
 * Gets an answer from an id
 * @param {string} aid
 * @returns {Promise<Answer>} Returns the answer object
 */
export async function getAnswerFromId (aid) {
  const resp = await axios.get(`http://localhost:8000/answers/${aid}`)
  return resp.data
}

/**
 * Gets all answers for a question
 * @param {string} qid
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

/**
 * Adds an answer to a question
 * @param {string} qid
 * @param {string} ansby
 * @param {string} text Text of the answer
 * @returns {Promise<string>} Returns the id of the new answer
 */
export async function addAnswer (qid, ansby, text, email) {
  let newAnsId = null

  // Post a new answer
  await axios.post('http://localhost:8000/answers', {
    text,
    ans_by: ansby,
    email
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

/**
 * Gets all answers
 * @returns {Promise<Array>} Returns an array of all answers
 */
export function getAnswers () {
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
/**
 * Gets a question from an id
 * @returns {Promise<Array<Question>>} Returns an array of all questions
 */
export function getQuestions () { /* Gets all questions */
  return axios.get('http://localhost:8000/questions').then((response) => {
    /* console.log(response.data) */
    return response.data
  }).catch((e) => {
    console.error(e)
  })
}

/**
 * Gets all questions for a user
 * @param {string} email
 * @returns {Promise<Array<Question>>} Returns an array of all questions for a user
 */
export function getQuestionsByEmail (email) {
  return axios.get(`http://localhost:8000/questionEmail/${email}`).then((response) => {
    /* console.log(response.data) */
    return response.data
  }).catch((e) => {
    console.error(e)
  })
}

/**
 * Gets a question from an id
 * @param {string} qid
 * @returns {Promise<Question>} Returns the question object
 */
export function getQuestion (qid) {
  return axios.get(`http://localhost:8000/questions/${qid}`).then((response) => {
    console.log(response.data)
    return response.data
  }).catch((e) => {
    console.error(e)
  })
}

/**
 * Adds a question
 * @param {string} title
 * @param {string} text
 * @param {Array<string>} tags
 * @param {string} user
 * @param {string} email
 * @returns {Promise<string>} Returns the id of the new question
 */
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

/**
 * Gets the number of questions for a tag
 * @param {string} tagId
 * @returns {Promise<number>} Returns the number of questions for a tag
 */
export async function getQuestionCountByTagId (tagId) {
  return (await getQuestions()).filter((q) => q.tags.includes(tagId)).length
}

//
//
//

/* ************* COMMENTS ************* */
/**
 * Gets all comments
 * @param {string} aid
 * @returns {Promise<Array<Comment>>} Returns an array of comments for an answer
 */
export function getCommentsByAID (aid) {
  return axios.get(`http://localhost:8000/comments/${aid}`).then((response) => {
    /* console.log(response.data) */
    return response
  }).catch((e) => {
    console.error(e)
  })
}

/**
 * Gets a comment from an id
 * @param {string} cid
 * @returns {Promise<Comment>} Returns the comment object
 */
export function getCommentByID (cid) {
  return axios.get(`http://localhost:8000/comment/${cid}`).then((response) => {
    /* console.log(response.data) */
    return response
  }).catch((e) => {
    console.error(e)
  })
}

/**
 * Adds a comment
 * @param {string} aid
 * @param {string} text
 * @param {string} user
 * @returns {Promise<string>} Returns the new comment
 */
export function addComment (aid, text, user) {
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
/**
 * Adds a user
 * @param {string} email
 * @param {string} username
 * @param {string} password
 * @returns {Promise<User>} Returns the new user
 */
export function addUser (email, username, password) {
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

/**
 * Gets a user from an email
 * @param {string} email
 * @returns {Promise<User>} Returns the user
 */
export function getUser (email) {
  return axios.get(`http://localhost:8000/users/${email}`).then((response) => {
    // console.log(response.data)
    return response.data
  }).catch((e) => {
    console.error(e)
  })
}

/**
 * Logs in a user
 * @param {string} email
 * @param {string} password
 * @returns {Promise<Response>} Returns the user
 */
export function loginUser (email, password) {
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
/**
 * Logs out a user
 * @param {Date} askDate
 * @param {Date} now
 */
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

//
//
//

/* ************* REP ************* */
/** Updates the rep of a question/answer/comment
 *
 * @param {string} id id of question/answer/comment
 * @param {string} type Type of object (question/answer/comment)
 * @param {number} rep Rep to add/subtract
 * @param {string} email Email of user
 * @returns {Promise<Response>} Returns the user
 */
export function addRep (type, id, rep, email) {
  return axios.post('http://localhost:8000/rep', {
    type,
    id,
    rep,
    email
  }).then((response) => {
    console.log(response.data)
    return response.data
  }).catch((e) => {
    console.error(e)
  })
}
