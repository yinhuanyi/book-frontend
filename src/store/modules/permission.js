// 看懂了
import { asyncRoutes, constantRoutes } from '@/router'

// 为filterAsyncRoutes服务：
function hasPermission(roles, route) {
  // 如果动态路由定义了roles
  if (route.meta && route.meta.roles) {
    // some方法用于检查每个元素是否满足条件
    return roles.some(role => route.meta.roles.includes(role))
  } else { // 如果没有定义，那么说有人都可以访问
    return true
  }
}

// 为generateRoutes服务：返回用户有权限看到的路由列表
export function filterAsyncRoutes(routes, roles) {
  // 基于用户权限获取的路由列表
  const res = []

  // 遍历asyncRoutes中的每一条路由
  routes.forEach(route => {
    // ...是将对象解构，然后再通过{}封装为对象
    const tmp = { ...route }
    // 如果用户的角色有权限
    if (hasPermission(roles, tmp)) {
      // 再判断其children是否有权限
      if (tmp.children) {
        tmp.children = filterAsyncRoutes(tmp.children, roles)
      }
      res.push(tmp)
    }
  })

  return res
}

const state = {

  routes: [], // 总路由表
  addRoutes: [] // 动态权限路由表
}

const mutations = {
  SET_ROUTES: (state, routes) => {
    state.addRoutes = routes
    state.routes = constantRoutes.concat(routes)
  }
}

const actions = {
  // roles = ['admin']， 下面是根据用户的角色，添加路由
  generateRoutes({ commit }, roles) {
    // 即使用户的角色没有任何权限，那么也不会拒绝请求，所以promise只需要resolve参数即可
    return new Promise(resolve => {
      let accessedRoutes
      // 如果角色数组中包含admin，直接将asyncRoutes全部返回
      if (roles.includes('admin')) {
        accessedRoutes = asyncRoutes || []
      } else {
        // 如果不是admin，那么就需要过滤了
        accessedRoutes = filterAsyncRoutes(asyncRoutes, roles)
      }

      // 将动态路由和总路由添加到vuex
      commit('SET_ROUTES', accessedRoutes)
      // 将过滤的路由accessedRoutes返回
      resolve(accessedRoutes)
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
