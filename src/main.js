// 导入vue
import Vue from 'vue'
// 导入cookie
import Cookies from 'js-cookie'
// 导入css
import 'normalize.css/normalize.css'
// 导入elementui
import Element from 'element-ui'
// 导入自定义样式
import './styles/element-variables.scss'
// 引入英文包
import enLang from 'element-ui/lib/locale/lang/en'
// 引入全局的css
import '@/styles/index.scss'
// 引入根组件
import App from './App'
// 引入vuex
import store from './store'
// 引入router
import router from './router'
// 引入自定义icon
import './icons'
// 引入路由守卫，作为路由中间件，对请求进行拦截
import './permission'
// 引入错误日志
import './utils/error-log'
// 引入过滤器
import * as filters from './filters'

// 注册elementui
Vue.use(Element, {
  size: Cookies.get('size') || 'medium', // set element-ui default size
  locale: enLang // 如果使用中文，无需设置，请删除
})

// 注册过滤器
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})

// 关闭Vue生产配置
Vue.config.productionTip = false

// 然后vue实例挂载到根组件
new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
