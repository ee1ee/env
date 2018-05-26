import React, {Component} from 'react'
import './index.scss'

class Nav extends Component{
  toPath = path=>{
    this.props.history.push(path)
  }

  render(){
    const {pathname} = this.props.location
    return (
      <div className="Nav">
        <button onClick={e=>this.toPath('/one')} className={`${pathname.includes('one') ? 'active' :''}`}>One</button>
        <button onClick={e=>this.toPath('/two')} className={`${pathname.includes('two') ? 'active' :''}`}>Two</button>
        <button onClick={e=>this.toPath('/other')}>Don't click on me</button>
      </div>
    )
  }
}

export default Nav
