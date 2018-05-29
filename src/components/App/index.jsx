import React, {Component, Fragment} from 'react'
import './index.scss'
import {Prompt, Redirect, Route, Router, Switch} from 'react-router'
import createBrowserHistory from 'history/createBrowserHistory'
import Time from '../Time'
import Nav from '../Nav'
import AsyncRoute from '../AsyncRoute'
const One = ()=>import('../One')
const Two = ()=>import('../Two')
import {hot} from 'react-hot-loader'

class App extends Component{
  history = createBrowserHistory({
    basename: `/mobileapps/env`
  })

  render(){
    return (
      <Fragment>
        <h1>Hello World!</h1>
        <Time />
        <Router history={this.history}>
          <Fragment>
            <Prompt message={location=>{
              if(location.pathname.includes('other')){
                return "别点我"
              }
              return true
            }} />
            <Route component={Nav} />
            <Switch>
              <AsyncRoute exact path="/one" component={One} />
              <AsyncRoute exact path="/two" component={Two} />
              <Redirect to="/one" />
            </Switch>
          </Fragment>
        </Router>
      </Fragment>
    )
  }
}

export default hot(module)(App)
