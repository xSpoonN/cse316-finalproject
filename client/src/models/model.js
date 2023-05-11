export default class Model {
  constructor () {
    this.data = {
      questions: [
        {
          qid: 'q1',
          title: 'Programmatically navigate using React router',
          text: "the alert shows the proper index for the li clicked, and when I alert the variable within the last function I'm calling, moveToNextImage(stepClicked), the same value shows but the animation isn't happening. This works many other ways, but I'm trying to pass the index value of the list item clicked to use for the math to calculate.",
          tagIds: ['t1', 't2'],
          askedBy: 'JoJi John',
          askDate: new Date('December 17, 2020 03:24:00'),
          ansIds: ['a1', 'a2', 'a8'],
          views: 10
        },
        {
          qid: 'q2',
          title:
            'android studio save string shared preference, start activity and load the saved string',
          text: 'I am using bottom navigation view but am using custom navigation, so my fragments are not recreated every time i switch to a different view. I just hide/show my fragments depending on the icon selected. The problem i am facing is that whenever a config change happens (dark/light theme), my app crashes. I have 2 fragments in this activity and the below code is what i am using to refrain them from being recreated.',
          tagIds: ['t3', 't4', 't2'],
          askedBy: 'saltyPeter',
          askDate: new Date('January 01, 2022 21:06:12'),
          ansIds: ['a3', 'a4', 'a5'],
          views: 121
        },
        {
          qid: 'q3',
          title:
            'there is a fat man stuck in my chimney claiming to be santa claus',
          text: 'he smells like piss, how do i get rid of him',
          tagIds: ['t6', 't7'],
          askedBy: 'clevelandbulldogs81',
          askDate: new Date('February 12, 2023 04:02:46'),
          ansIds: ['a6', 'a7'],
          views: 4
        },
        {
          qid: 'q4',
          title: 'who asked?',
          text: 'modcheck',
          tagIds: ['t8'],
          askedBy: 'uwuowo',
          askDate: new Date('February 12, 2023 19:32:12'),
          ansIds: [],
          views: 99
        },
        {
          qid: 'q5',
          title: 'where are your fingers?',
          text: 'hey vsauce, michael here',
          tagIds: ['t8'],
          askedBy: 'awawawawawa',
          askDate: new Date('December 12, 2022 19:53:19'),
          ansIds: [],
          views: 23623
        },
        {
          qid: 'q6',
          title: 'whopper whopper whopper whopper junior double triple whopper',
          text: 'flame grilled taste with perfect toppers i rule i rule i rule this day lettuce mayo pickle ketchup',
          tagIds: [],
          askedBy: 'BurgerKing',
          askDate: new Date('February 12, 2023 19:53:39'),
          ansIds: [],
          views: 1
        },
        {
          qid: 'q7',
          title: 'chocolate chocolate chip',
          text: 'jack',
          tagIds: ['t8'],
          askedBy: 'bidenator',
          askDate: new Date('February 23, 2023 19:53:19'),
          ansIds: [],
          views: 5888888888
        },
        {
          qid: 'q8',
          title: 'How to forcefully kill a child?',
          text: 'I am writing a C program that deals with child processes, and I need to kill the spawned processes. How do I go about this?',
          tagIds: ['t10', 't11'],
          askedBy: 'jason huh',
          askDate: new Date('February 27, 2023 21:04:00'),
          ansIds: ['a9'],
          views: 4
        }
      ],
      tags: [
        {
          tid: 't1',
          name: 'react'
        },
        {
          tid: 't2',
          name: 'javascript'
        },
        {
          tid: 't3',
          name: 'android-studio'
        },
        {
          tid: 't4',
          name: 'shared-preferences'
        },
        {
          tid: 't5',
          name: 'c++'
        },
        {
          tid: 't6',
          name: 'mysql'
        },
        {
          tid: 't7',
          name: 'ice-fishing'
        },
        {
          tid: 't8',
          name: 'node.js'
        },
        {
          tid: 't9',
          name: 'mongodb'
        },
        {
          tid: 't10',
          name: 'c'
        },
        {
          tid: 't11',
          name: 'life-advice'
        }
      ],
      answers: [
        {
          aid: 'a1',
          text: "React Router is mostly a wrapper around the history library. history handles interaction with the browser's window.history for you with its browser and hash histories. It also provides a memory history which is useful for environments that don't have a global history. This is particularly useful in mobile app development (react-native) and unit testing with Node.",
          ansBy: 'hamkalo',
          ansDate: new Date('March 02, 2022 15:30:00')
        },
        {
          aid: 'a2',
          text: "On my end, I like to have a single history object that I can carry even outside components. I like to have a single history.js file that I import on demand, and just manipulate it. You just have to change BrowserRouter to Router, and specify the history prop. This doesn't change anything for you, except that you have your own history object that you can manipulate as you want. You need to install history, the library used by react-router.",
          ansBy: 'azad',
          ansDate: new Date('January 31, 2022 15:30:00')
        },
        {
          aid: 'a3',
          text: 'Consider using apply() instead; commit writes its data to persistent storage immediately, whereas apply will handle it in the background.',
          ansBy: 'abaya',
          ansDate: new Date('April 21, 2022 15:25:22')
        },
        {
          aid: 'a4',
          text: 'YourPreference yourPrefrence = YourPreference.getInstance(context); yourPreference.saveData(YOUR_KEY,YOUR_VALUE);',
          ansBy: 'alia',
          ansDate: new Date('December 02, 2022 02:20:59')
        },
        {
          aid: 'a5',
          text: 'I just found all the above examples just too confusing, so I wrote my own. ',
          ansBy: 'sana',
          ansDate: new Date('December 31, 2022 20:20:59')
        },
        {
          aid: 'a6',
          text: 'kekw',
          ansBy: 'meeposhy',
          ansDate: new Date('January 25, 2023 14:22:15')
        },
        {
          aid: 'a7',
          text: 'light a small fire in your fireplace. the smoke will entice him to evacuate the premises. careful not to light too big of a fire else it will fill up your house. source: personal experience.',
          ansBy: 'benshapiro',
          ansDate: new Date('February 12, 2023 05:13:45')
        },
        {
          aid: 'a8',
          text: 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
          ansBy: 'aaaaaaaaaaaaaaaaaa',
          ansDate: new Date('January 12, 2023 15:11:24')
        },
        {
          aid: 'a9',
          text: 'what the hell is wrong with you',
          ansBy: 'dom',
          ansDate: new Date('January 12, 2023 15:11:24')
        }
      ]
    }
  }

  getAllQstns () {
    return this.data.questions
  }

  getQuestionTitle (id) {
    return this.data.questions.find((item) => item.qid === id).title
  }

  getQuestionText (id) {
    return this.data.questions.find((item) => item.qid === id).text
  }

  getWhoAsked (id) {
    return this.data.questions.find((item) => item.qid === id).askedBy
  }

  getAskDate (id) {
    return this.data.questions.find((item) => item.qid === id).askDate
  }

  getAllAnswers () {
    return this.data.answers
  }

  getAnswersByQID (questionId) {
    return this.data.answers
      .filter((ans) =>
        this.data.questions
          .find((q) => q.qid === questionId)
          .ansIds.includes(ans.aid)
      )
      .sort((a, b) => b.ansDate - a.ansDate)
  }

  getViews (questionId) {
    return this.data.questions.find((item) => item.qid === questionId).views
  }

  getAllTags () {
    return this.data.tags
  }

  getQuestionCount () {
    return this.data.questions.length
  }

  getQuestionCountByTag (tagname) {
    const tagId = this.data.tags.find((t) => t.name === tagname).tid
    return this.data.questions.filter((q) => q.tagIds.includes(tagId)).length
  }

  getQuestionCountByTagId (tagId) {
    return this.data.questions.filter((q) => q.tagIds.includes(tagId)).length
  }

  getQuestionsByTagString (tagname) {
    const tagId = this.data.tags.find((t) => t.name === tagname).tid
    return this.data.questions.filter((q) => q.tagIds.includes(tagId))
  }

  findTagName (tagid) {
    /* console.log(this.data.tags); */
    return this.data.tags.find((x) => x.tid === tagid).name
  }

  addViews (questionId, amount = 1) {
    this.data.questions.find((item) => item.qid === questionId).views += amount
  }

  addAnswer (questionId, author, text, time = new Date()) {
    let newaid = ''
    if (this.data.answers.length === 0) newaid = 'a1'
    else {
      newaid = 'a' + (parseInt(this.data.answers.reduce((max, a) =>
        parseInt(max.aid.substring(1)) > parseInt(a.aid.substring(1))
          ? max
          : a
      ).aid.substring(1)) + 1)
    }
    // console.log(`New AID: ${newaid}`);
    this.data.answers.push({
      aid: newaid,
      text,
      ansBy: author,
      ansDate: time
    })
    this.data.questions.find((item) => item.qid === questionId).ansIds.push(newaid)
    return newaid
  }

  addQuestion (newtitle, newtext, taglist, askuser) {
    let newqid = ''
    if (this.data.questions.length === 0) newqid = 'q1'
    else {
      /* console.log(this.data.questions.reduce((max, q) =>
        parseInt(max.qid.substring(1)) > parseInt(q.qid.substring(1))
          ? max
          : q
      ).qid.substring(1)) */
      newqid = 'q' + (parseInt(this.data.questions.reduce((max, q) =>
        parseInt(max.qid.substring(1)) > parseInt(q.qid.substring(1))
          ? max
          : q
      ).qid.substring(1)) + 1)
    }
    // console.log(`New QID: ${newqid}`);
    this.data.questions.push({
      qid: newqid,
      title: newtitle,
      text: newtext,
      tagIds: taglist,
      askedBy: askuser,
      askDate: new Date(),
      ansIds: [],
      views: 0
    })
  }

  addTag (tagname) {
    let newtid = ''
    if (this.data.tags.length === 0) {
      newtid = 't1'
    } else {
      newtid = 't' + (parseInt(this.data.tags.reduce((max, t) =>
        parseInt(max.tid.substring(1)) > parseInt(t.tid.substring(1))
          ? max
          : t
      ).tid.substring(1)) + 1)
    }
    // console.log(`New TID: ${newtid}`);
    this.data.tags.push({ tid: newtid, name: tagname })
    return newtid
  }

  tagExists (name) {
    return this.data.tags.find((x) => x.name === name)?.tid
  }

  formatDate (askDate, now = new Date()) {
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
}
