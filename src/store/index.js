import Vue from 'vue'
import Vuex from 'vuex'
import getters from './getters'

Vue.use(Vuex)

// 这里通过模糊匹配的方式，获取到所有的state、mutation、action
const modulesFiles = require.context('./modules', true, /\.js$/)

// 把这些state、mutation、action合并
const modules = modulesFiles.keys().reduce((modules, modulePath) => {
  const moduleName = modulePath.replace(/^\.\/(.*)\.\w+$/, '$1')
  const value = modulesFiles(modulePath)
  modules[moduleName] = value.default
  return modules
}, {})

// 创建store
const store = new Vuex.Store({
  modules,
  getters
})

// 暴露store
export default store
