import React, {Component} from 'react'
import {Route} from 'react-router'

export default class AsyncRoute extends Component{
  state = {
    lazy: props=>(<div />)
  }

  componentWillMount(){
    this.props.component().then(({default: lazy})=>{
      this.setState({lazy})
    })
  }

  componentWillReceiveProps(nextProps){
    nextProps.component().then(({default: lazy})=>{
      this.setState({lazy})
    })
  }

  render(){
    return <Route {...this.props} component={this.state.lazy} />
  }
}
