/* global API_HOST */
import axios from 'axios'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

import openNotificationWithIcon from '../src/base/components/Notification'

// 默认配置
axios.defaults.withCredentials = true

const configs = {
  baseURL: `${API_HOST}`
}

let instance = axios.create(configs)

instance.interceptors.request.use(
  config => {
    const hoolaiSession = sessionStorage.getItem('hoolai')
    if (hoolaiSession) {
      config.headers.Authorization = `bearer ${JSON.parse(hoolaiSession).token}`
      config.headers.adminUserId = JSON.parse(hoolaiSession).userId
    }
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

instance.interceptors.response.use(
  response => {
    NProgress.done()
    return {
      data: response.data,
      status: response.status
    }
  },
  error => {
    if (error.response) {
      let result = {
        code: 0,
        status: error.response.status,
        message: error.response.data.tips
      }
      if (error.response.data.tips.includes('token失效') || error.response.data.tips.includes('请重新登录')) {
        result.code = 1
      }
      openNotificationWithIcon('error', result.status, result.message, 3)
      return Promise.resolve(result)
    } else {
      return Promise.reject(error)
    }
  }
)

const AxiosAPI = instance
export default AxiosAPI
