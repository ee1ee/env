import './ajax'
import './index.css'

console.log('你好呀')

import(/* webpackChunkName: "myName" */ './lazy.js').then(res=>{
  console.log(res.default)
})

if(module.hot){
  module.hot.accept()
}
