import _ from 'lodash'
// 配置后端API地址前缀
let ignore = ['index.js', 'PageNotFound']

let arr = _.pullAll(__GLOB__, ignore)

_.map(arr, (elem, index) => {
  // 配置后端API地址前缀
  const PREFIX_API = '/admin/api/'
  const HOST = {
    LOCAL: `http://10.0.5.28:8070${PREFIX_API}`,
    // LOCAL: `http://10.0.2.3:8070${PREFIX_API}`,
    RELEASE: `http://${__HOST__}${PREFIX_API}`
  }

  let API_HOST
  if (__DEV__) {
    API_HOST = `${HOST.LOCAL}`
  } else if (__PROD__ && __HOST__) {
    API_HOST = `${HOST.RELEASE}`
  }

  window['API_HOST'] = API_HOST.slice(0, API_HOST.length - 1)
})

module.exports = {
  arr
}
