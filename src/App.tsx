import React, { Component } from 'react'

interface Lol {
  hihi: number
}

const lol:Lol = {
  hihi: 4
}

class App extends Component {
  state = { val: 0 }

  render () {
    return <div className="App">
      <button onClick={e => this.setState({ val: Math.random() })}>Randomize</button>
      {this.state.val}
    </div>
  }
}

export default App
