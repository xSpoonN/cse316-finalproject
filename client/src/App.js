// ************** THIS IS YOUR APP'S ENTRY POINT. CHANGE THIS FILE AS NEEDED. **************
// ************** DEFINE YOUR REACT COMPONENTS in ./components directory **************
import './stylesheets/App.css'
import React from 'react'
import Model from './models/model.js'
import FakeStackOverflow from './components/fakestackoverflow.js'

export const modle = new Model()

function App () {
  return (
    <section className="fakeso">
      <FakeStackOverflow />
    </section>
  )
}

export default App
