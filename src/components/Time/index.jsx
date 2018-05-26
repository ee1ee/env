import React, {Component} from 'react'
import './index.scss'

class Time extends Component{
  state = {
    now: new Date().toLocaleTimeString()
  }

  componentDidMount(){
    this.startTiming()
  }

  componentWillUnmount(){
    cancelAnimationFrame(this.rAF)
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
      <p className="Time">Now: {now}</p>
    )
  }
}

export default Time
