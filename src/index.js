import React from 'react'
import ReactDOM from 'react-dom'
import App from './components/App'
import './ajax'
import './index.css'

ReactDOM.render(
  <App />,
  document.getElementById('app')
)

if(module.hot){
  module.hot.accept()
}
