import axios from 'axios'
import { MessageBox, Message } from 'element-ui'
import store from '@/store'
import { getToken } from '@/utils/auth'
import { codeAt } from 'core-js/internals/string-multibyte'

// 创建axios
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API,
  timeout: 5000
})

// 请求拦截器
service.interceptors.request.use(
  config => {
    // 什么时候需要带token请求：如果vuex中存在token，那么就带token请求
    if (store.getters.token) {
      // 获取用户浏览器的token，设置请求头
      config.headers['X-Token'] = getToken()
    }

    return config
  },
  error => {
    return Promise.reject(error)
  }
)

// 响应拦截器
service.interceptors.response.use(
  // HTTP Status Code == 200
  response => {
    // 获取到响应数据
    const res = response.data

    if (res.code !== 20000) {
      // 这个用于校验表单字段，因为表单校验返回的错误带附加的msg信息，就会有冒号(需要后台保持一致)
      if (res.msg && res.msg.startsWith('请求参数错误: ')) {
        res.msg = '请填写必填的表单字段'
      }

      // 如果客户端返回不是20000状态码，弹出请求失败的消息
      Message({
        message: res.msg || '请求失败',
        type: 'error',
        duration: 5 * 1000
      })

      // 由于这个错误Message已经显示了，外面不再需要显示，所以使用reject返回
      // 外面想要获取到reject的值，只有一种方法：使用 then + catch
      return Promise.reject(new Error(res.msg || '请求失败'))
    } else { // 如果状态码是20000，直接将结果向后返回到请求
      // 注意这里返回的是res,不是Promise.reject(res)，因此外面如果想获取到res有两种方法：
      // 1：使用await + promise
      // 2：使用 then + catch
      // console.log({res})
      return res
    }
  },
  // HTTP Status Code ！= 200
  error => {
    // console.log({error})
    // 如果请求超时，没有获取到response，那么就取message里面的值。
    // 如果请求发出去了，由于http错误，response就会有值
    const { response, message } = error

    if (response) {
      Message({
        message: `HTTP请求失败：${response.data.msg}`,
        type: 'error',
        duration: 5 * 1000
      })
    } else if (message) {
      Message({
        message: `HTTP请求失败：${message}`,
        type: 'error',
        duration: 5 * 1000
      })
    }

    return Promise.reject(error)
  }
)

export default service

