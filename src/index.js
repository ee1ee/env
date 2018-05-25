import React from 'react'
import ReactDOM from 'react-dom'
import App from './components/App'
import './ajax'
import './index.css'

ReactDOM.render(
  <App />,
  document.getElementById('app')
)

import(/* webpackChunkName: "myName" */ './lazy.js').then(res=>{
  console.log(res.default)
})

if(module.hot){
  module.hot.accept()
}
