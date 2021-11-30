import request from '@/utils/request'
import { setToken } from '@/utils/auth'

export function login(data) {
  // post请求，没有请求参数，只有一个data
  return request({
    url: '/user/login',
    method: 'post',
    data: data
  })
}

export function getInfo(token) {
  return request({
    url: '/user/info',
    method: 'get'
  })
}

export function logout() {
  return request({
    url: '/user/logout',
    method: 'post'
  })
}
