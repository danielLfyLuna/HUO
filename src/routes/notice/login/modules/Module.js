import _ from 'lodash'
import AxiosAPI from '../../../../../utils/axios-api'
import openNotificationWithIcon from '../../../../base/components/Notification'

// ------------------------------------
// Constants
// ------------------------------------
const NOTICE_LOGIN_LIST_REQUEST = 'NOTICE_LOGIN_LIST_REQUEST'
const NOTICE_LOGIN_LIST_RECEIVE = 'NOTICE_LOGIN_LIST_RECEIVE'
const NOTICE_LOGIN_LIST_CLEAR = 'NOTICE_LOGIN_LIST_CLEAR'

const NOTICE_LOGIN_REQUEST = 'NOTICE_LOGIN_REQUEST'
const NOTICE_LOGIN_RECEIVE = 'NOTICE_LOGIN_RECEIVE'

const NOTICE_LOGIN_CREATE_REQUEST = 'NOTICE_LOGIN_CREATE_REQUEST'
const NOTICE_LOGIN_CREATE_RECEIVE = 'NOTICE_LOGIN_CREATE_RECEIVE'

const NOTICE_LOGIN_UPDATE_REQUEST = 'NOTICE_LOGIN_UPDATE_REQUEST'
const NOTICE_LOGIN_UPDATE_RECEIVE = 'NOTICE_LOGIN_UPDATE_RECEIVE'

const NOTICE_LOGIN_DELETE_REQUEST = 'NOTICE_LOGIN_DELETE_REQUEST'
const NOTICE_LOGIN_DELETE_RECEIVE = 'NOTICE_LOGIN_DELETE_RECEIVE'

const NOTICE_LOGIN_STATUS_REQUEST = 'NOTICE_LOGIN_STATUS_REQUEST'
const NOTICE_LOGIN_STATUS_RECEIVE = 'NOTICE_LOGIN_STATUS_RECEIVE'

const NOTICE_LOGIN_ORDERS_REQUEST = 'NOTICE_LOGIN_ORDERS_REQUEST'
const NOTICE_LOGIN_ORDERS_RECEIVE = 'NOTICE_LOGIN_ORDERS_RECEIVE'

// ------------------------------------
// Actions
// ------------------------------------

function requestNotices() {
  return {
    type: NOTICE_LOGIN_LIST_REQUEST
  }
}

function receiveNotices(data) {
  return {
    type: NOTICE_LOGIN_LIST_RECEIVE,
    payload: data
  }
}

function requestNotice() {
  return {
    type: NOTICE_LOGIN_REQUEST
  }
}

function receiveNotice(data) {
  return {
    type: NOTICE_LOGIN_RECEIVE,
    payload: data
  }
}

function requestNoticeCreate() {
  return {
    type: NOTICE_LOGIN_CREATE_REQUEST
  }
}

function receiveNoticeCreate(data) {
  return {
    type: NOTICE_LOGIN_CREATE_RECEIVE,
    payload: data
  }
}

function requestNoticeUpdate() {
  return {
    type: NOTICE_LOGIN_UPDATE_REQUEST
  }
}

function receiveNoticeUpdate(data) {
  return {
    type: NOTICE_LOGIN_UPDATE_RECEIVE,
    payload: data
  }
}

function requestNoticeDelete() {
  return {
    type: NOTICE_LOGIN_DELETE_REQUEST
  }
}

function receiveNoticeDelete(data) {
  return {
    type: NOTICE_LOGIN_DELETE_RECEIVE,
    payload: data
  }
}

function requestNoticeStatus() {
  return {
    type: NOTICE_LOGIN_STATUS_REQUEST
  }
}

function receiveNoticeStatus(data) {
  return {
    type: NOTICE_LOGIN_STATUS_RECEIVE,
    payload: data
  }
}

function requestNoticeOrders() {
  return {
    type: NOTICE_LOGIN_ORDERS_REQUEST
  }
}

function receiveNoticeOrders(data) {
  return {
    type: NOTICE_LOGIN_ORDERS_RECEIVE,
    payload: data
  }
}


function fetchLoginNotices(data = {}) {
  return (dispatch, getState) => {

    dispatch(requestNotices())
    const url = `huo/products/loginnotices`
    AxiosAPI({
      method: 'GET',
      url: url,
      params: data.params
    }).then(response => {
      dispatch(receiveNotices(response))
    }).catch(error => {
      if (error.response) {
        openNotificationWithIcon('error', '获取列表失败', error.response.data.tips)
      } else {
        console.log('Error', error.message)
      }
    })
  }
}

function fetchLoginNotice(data = {}) {
  return (dispatch, getState) => {

    dispatch(requestNotice())
    const url = `huo/products/loginnotices/${data.path.noticeId}`
    AxiosAPI({
      method: 'GET',
      url: url,
    }).then(response => {
      dispatch(receiveNotice(response))
    }).catch(error => {
      if (error.response) {
        openNotificationWithIcon('error', '获取失败', error.response.data.tips)
      } else {
        console.log('Error', error.message)
      }
    })
  }
}

function createLoginNotice(data) {
  return (dispatch, getState) => {

    openNotificationWithIcon('warning', '正在提交新公告，请勿重复点击发送！')
    dispatch(requestNoticeCreate())
    const url = `huo/products/loginnotices`
    AxiosAPI({
      method: 'POST',
      url: url,
      data: data.form
    }).then(response => {
      dispatch(receiveNoticeCreate(response))
      if (response.data.id) {
        dispatch(fetchLoginNotices({
          params: {
            productId: response.data.productId
          }
        }))
        openNotificationWithIcon('success', '添加成功')
      }
    }).catch(error => {
      if (error.response) {
        openNotificationWithIcon('error', '添加失败', error.response.data.tips)
      } else {
        console.log('Error', error.message)
      }
    })
  }
}

function updateLoginNotice(data) {
  return (dispatch, getState) => {

    openNotificationWithIcon('warning', '正在更新，请勿重复点击发送')
    dispatch(requestNoticeUpdate())
    const url = `huo/products/loginnotices/${data.path.noticeId}`
    AxiosAPI({
      method: 'PUT',
      url: url,
      data: data.form,
    }).then(response => {
      dispatch(receiveNoticeUpdate(response))
      openNotificationWithIcon('success', '更新成功')
    }).catch(error => {
      if (error.response) {
        openNotificationWithIcon('error', '更新失败', error.response.data.tips)
      } else {
        console.log('Error', error.message)
      }
    })
  }
}

function deleteLoginNotice(data) {
  return (dispatch, getState) => {

    dispatch(requestNoticeDelete())
    const url = `huo/products/loginnotices/${data.path.noticeId}`
    AxiosAPI({
      method: 'DELETE',
      url: url
    }).then(response => {
      dispatch(receiveNoticeDelete(response))
      if (response.data.msg) {
        openNotificationWithIcon('success', '删除成功', `公告ID: ${response.data.msg} 删除成功`)
      }
    }).catch(error => {
      if (error.response) {
        openNotificationWithIcon('error', '删除失败', error.response.data.tips)
      } else {
        console.log('Error', error.message)
      }
    })
  }
}

function openLoginNotice(data) {
  return (dispatch, getState) => {

    dispatch(requestNoticeStatus())
    const url = `huo/products/loginnotices/${data.path.noticeId}/status/${data.path.open}`
    AxiosAPI({
      method: 'PUT',
      url: url
    }).then(response => {
      dispatch(receiveNoticeStatus(response))
      if (response.data.open === 1) {
        openNotificationWithIcon('success', '开启成功', `公告ID: ${response.data.id} 开启成功`)
      }
      if (response.data.open === 0) {
        openNotificationWithIcon('success', '关闭成功', `公告ID: ${response.data.id} 关闭成功`)
      }
    }).catch(error => {
      if (error.response) {
        openNotificationWithIcon('error', '开关失败', error.response.data.tips)
      } else {
        console.log('Error', error.message)
      }
    })
  }
}

function orderLoginNotice(data) {
  return (dispatch, getState) => {

    dispatch(requestNoticeOrders())
    const url = `huo/products/loginnotices/orders`
    AxiosAPI({
      method: 'PUT',
      url: url,
      data: data.form
    }).then(response => {
      dispatch(receiveNoticeOrders(response))
      // if (response.data.open === 1) {
      //   openNotificationWithIcon('success', '开启成功', `公告ID:${response.data.id}开启成功`)
      // }
      // if (response.data.open === 0) {
      //   openNotificationWithIcon('success', '关闭成功', `公告ID:${response.data.id}关闭成功`)
      // }
    }).catch(error => {
      if (error.response) {
        openNotificationWithIcon('error', '开关失败', error.response.data.tips)
      } else {
        console.log('Error', error.message)
      }
    })
  }
}


export {
  fetchLoginNotices,
  fetchLoginNotice,
  createLoginNotice,
  updateLoginNotice,
  deleteLoginNotice,
  openLoginNotice,
  orderLoginNotice
}

// ------------------------------------
// Action Handlers
// ------------------------------------
const ACTION_HANDLERS = {
  [NOTICE_LOGIN_LIST_REQUEST]: (state) => {
    return ({
      ...state,
      fetching: true
    })
  },
  [NOTICE_LOGIN_LIST_RECEIVE]: (state, action) => {
    return ({
      ...state,
      fetching: false,
      login: {
        ...state.login,
        list: action.payload.data.domainObject || []
      }
    })
  },
  [NOTICE_LOGIN_LIST_CLEAR]: (state) => {
    return ({
      ...state,
      fetching: false,
      login: {
        ...state.login,
        list: []
      }
    })
  },
  [NOTICE_LOGIN_REQUEST]: (state) => {
    return ({
      ...state,
      fetching: true
    })
  },
  [NOTICE_LOGIN_RECEIVE]: (state, action) => {
    return ({
      ...state,
      fetching: false,
      login: {
        ...state.login,
        one: action.payload.data
      }
    })
  },
  [NOTICE_LOGIN_CREATE_REQUEST]: (state) => {
    return ({
      ...state,
      fetching: true
    })
  },
  [NOTICE_LOGIN_CREATE_RECEIVE]: (state, action) => {
    return ({
      ...state,
      fetching: false,
      login: {
        ...state.login,
        create: action.payload.data
      }
    })
  },
  [NOTICE_LOGIN_UPDATE_REQUEST]: (state) => {
    return ({
      ...state,
      fetching: true
    })
  },
  [NOTICE_LOGIN_UPDATE_RECEIVE]: (state, action) => {
    const list = state.login.list
    const data = action.payload.data
    _.map(list, (v, i) => {
      if (v.id === data.id) {
        Object.assign(v, data)
      }
    })
    return ({
      ...state,
      fetching: false,
      login: {
        ...state.login,
        list: [...list],
        update: {...data}
      }
    })
  },
  [NOTICE_LOGIN_DELETE_REQUEST]: (state) => {
    return ({
      ...state,
      fetching: true
    })
  },
  [NOTICE_LOGIN_DELETE_RECEIVE]: (state, action) => {
    const list = state.login.list
    const data = action.payload.data
    return ({
      ...state,
      fetching: false,
      login: {
        ...state.login,
        list: list.filter(o => o.id != data.msg),
        delete: {...data}
      }
    })
  },
  [NOTICE_LOGIN_STATUS_REQUEST]: (state) => {
    return ({
      ...state,
      fetching: true
    })
  },
  [NOTICE_LOGIN_STATUS_RECEIVE]: (state, action) => {
    const list = state.login.list
    const data = action.payload.data
    _.map(list, (v, i) => {
      if (v.id === data.id) {
        Object.assign(v, data)
      }
    })
    return ({
      ...state,
      fetching: false,
      login: {
        ...state.login,
        list: [...list],
        status: {...data}
      }
    })
  },
  [NOTICE_LOGIN_ORDERS_REQUEST]: (state) => {
    return ({
      ...state,
      fetching: true
    })
  },
  [NOTICE_LOGIN_ORDERS_RECEIVE]: (state, action) => {
    return ({
      ...state,
      fetching: false,
      login: {
        ...state.login,
        orders: action.payload.data
      }
    })
  },
}

// ------------------------------------
// Reducer
// ------------------------------------
const initialState = { // 数据结构
  fetching: false,
  err: false,
  errMsg: {},
  login: {
    list: [],
    one: {},
    create: {},
    update: {},
    delete: {},
    status: {},
    orders: {}
  }
}

export default function(state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type]

  return handler
    ? handler(state, action)
    : state
}
