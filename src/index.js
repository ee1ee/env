import './ajax'
import './index.css'
import './index.scss'

console.log('你好呀')

document.body.innerHTML = '<h1>Hello World!<sub>lixin</sub></h1>'

import(/* webpackChunkName: "myName" */ './lazy.js').then(res=>{
  console.log(res.default)
})

if(module.hot){
  module.hot.accept()
}
