import router from './router'
import store from './store'

// 由于无法获取到Vue的实例，因此只能这样局部导入这个函数对象
import { Message } from 'element-ui'

// 导入NProgress插件和样式
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

// 从export function getToken 导入函数
import { getToken } from '@/utils/auth'
// 从export default function getPageTitle 导入函数
import getPageTitle from '@/utils/get-page-title'
import { hasHandler } from 'codemirror/src/util/event'

// 关闭NProgress插件的旋转小圆环
NProgress.configure({ showSpinner: false })

// 定义路由白名单，这些白名单中的路由路径不需要进行鉴权，直接可以访问
const whiteList = ['/login', '/auth-redirect']

// 路由守卫，所有的请求将会进入到这里
// Todo: 为什么这里使用async关键字修饰函数呢？
router.beforeEach(async(to, from, next) => {
  // 这里使用了NProgress插件，显示网页的打开进度条
  NProgress.start()
  // 获取页面名称，并且赋值给页面的title
  document.title = getPageTitle(to.meta.title)
  // 获取cookie中Admin-Token对应的token
  const hasToken = getToken()
  // 判断是否有token
  if (hasToken) {
    // 如果token存在，且路由路径是/login，跳转到/
    if (to.path === '/login') {
      next({ path: '/' })
      // 当前请求结束，必须设置NProgress为done，让进度条充满屏幕
      NProgress.done()
    } else {
      // 如果路由路径不是login
      // 从Vuex中获取角色
      const hasRoles = store.getters.roles && store.getters.roles.length > 0
      // 如果角色存在，放行
      if (hasRoles) {
        next()
      } else {
        // 如果角色不存在，
        try {
          // getInfo函数返回一个promise对象，await 获取的是promise对象中resolve的参数值，resolve传递的是data
          // { roles }是对data的数据进行解构，获取roles对应的值，其他的值丢弃
          // 如果promise返回的是reject，那么无法获取到reject传递的数据，会直接报错了
          const { roles } = await store.dispatch('user/getInfo')

          // 触发store中 permission/generateRoutes方法获取过去用户权限后的动态路由配置
          const accessRoutes = await store.dispatch('permission/generateRoutes', roles)

          // 将动态路由配置，添加到当前router实例中
          router.addRoutes(accessRoutes)

          // next函数只能传递一个对象参数，to对象中，加上一个replace: true，表明这次请求不记录在history中

          next({ ...to, replace: true })
        } catch (error) {
          // 如果在获取角色过程中，出现异常，清除Vuex中的token
          await store.dispatch('user/resetToken')
          // 显示报错信息
          Message.error(error || 'Has Error')
          // 调整到登录页面
          next(`/login?redirect=${to.path}`)
          // 当前请求结束，必须设置NProgress为done，让进度条充满屏幕
          NProgress.done()
        }
      }
    }

  // 如果token不存在
  } else {
    // 如果访问的页面在白名单中，直接放行
    if (whiteList.indexOf(to.path) !== -1) {
      next()
    // 如果不在白名单中
    } else {
      // 修改路由路径，跳转到登录页面，且将之前路径作为redirect的参数
      next(`/login?redirect=${to.path}`)
      // 当前请求结束，必须设置NProgress为done，让进度条充满屏幕
      NProgress.done()
    }
  }
})

// 每一次请求完毕后，再次调用一下NProgress的done方法，让进度条显示完毕
router.afterEach(() => {
  NProgress.done()
})
