import React, {Component, Fragment} from 'react'
import './index.scss'

class App extends Component{
  state = {
    now: new Date().toLocaleTimeString()
  }

  componentDidMount(){
    this.startTiming()
  }

  componentWillUnmount(){
    mozCancelAnimationFrame(this.rAF)
  }

  startTiming = ()=>{
    this.setState({
      now: new Date().toLocaleTimeString()
    })
    this.rAF = requestAnimationFrame(this.startTiming)
  }

  render(){
    const {now} = this.state

    return (
      <Fragment>
        <h1>Hello World!</h1>
        <p>Now: {now}</p>
      </Fragment>
    )
  }
}

export default App
