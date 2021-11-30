// 看懂
import Cookies from 'js-cookie'

const TokenKey = 'Admin-Token'

// 浏览器获取token
export function getToken() {
  return Cookies.get(TokenKey)
}

// 浏览器设置token
export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

// 浏览器删除token
export function removeToken() {
  return Cookies.remove(TokenKey)
}
