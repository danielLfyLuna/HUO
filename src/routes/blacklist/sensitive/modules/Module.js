/* global API_HOST */
import axios from 'axios'
import openNotificationWithIcon from '../../../../base/components/Notification'

// ------------------------------------
// Constants
// ------------------------------------
const RECEIVE_SEN = 'RECEIVE_SEN'
const REQUEST_SEN = 'REQUEST_SEN'

const RECEIVE_SEN_ADD = 'RECEIVE_SEN_ADD'

const RECEIVE_SEN_SYNC = 'RECEIVE_SEN_SYNC'

const SEN_ERR = 'SEN_ERR'

// ------------------------------------
// Actions
// ------------------------------------

function requestSEN() {
  return {
    type: REQUEST_SEN
  }
}

function receiveSEN(data) {
  return {
    type: RECEIVE_SEN,
    payload: data
  }
}

function requestErr(data) {
  return {
    type: SEN_ERR,
    payload: data
  }
}

function fetchSEN(value = {}) {
  return (dispatch) => {

    dispatch(requestSEN())
    let url = `${API_HOST}/huo/products/${value.productId}/sensitivechar/servers/${value.serverId}`
    return axios({
      method: 'GET',
      url: url,
      headers: {
        'adminUserId': JSON.parse(sessionStorage.getItem('hoolai')).userId,
        'Authorization': `bearer ${JSON.parse(sessionStorage.getItem('hoolai')).token}`
      }
    }).then(result => {
      dispatch(receiveSEN(result))
      if (result.data.sensitivechar && result.data.sensitivechar.length == 0) {
        openNotificationWithIcon('success', '查询结果为空')
      }
    }).catch(function(error) {
      if (error.response) {
        dispatch(requestErr(error.response.data))
      } else {
        console.log('Error', error.message)
      }
      console.log(error)
    })
  }
}

function receiveADD(data) {
  return {
    type: RECEIVE_SEN_ADD,
    payload: data
  }
}

function addSEN(value = {}) {
  return (dispatch) => {
    let url = `${API_HOST}/huo/products/${value.productId}/sensitivechar/servers/${value.serverId}`
    return axios({
      method: 'POST',
      url: url,
      data: { param: value.obj },
      headers: {
        'adminUserId': JSON.parse(sessionStorage.getItem('hoolai')).userId,
        'Authorization': `bearer ${JSON.parse(sessionStorage.getItem('hoolai')).token}`
      }
    }).then(result => {
      dispatch(receiveADD(result))
      openNotificationWithIcon('success', '添加成功！', result.data.sensitivechar)
    }).catch(function(error) {
      if (error.response) {
        dispatch(requestErr(error.response.data))
      } else {
        console.log('Error', error.message)
      }
      console.log(error)
    })
  }
}

function receiveSync(data) {
  return {
    type: RECEIVE_SEN_SYNC,
    payload: data
  }
}

function syncSEN(value = {}) {
  return (dispatch) => {
    let url = `${API_HOST}/huo/products/${value.productId}/sensitivechar/servers/${value.serverId}/sync`
    return axios({
      method: 'POST',
      url: url,
      data: value.target,
      headers: {
        'adminUserId': JSON.parse(sessionStorage.getItem('hoolai')).userId,
        'Authorization': `bearer ${JSON.parse(sessionStorage.getItem('hoolai')).token}`
      }
    }).then(result => {
        dispatch(receiveSync(result))
        openNotificationWithIcon('success', '同步成功！')
    })
    .catch(function(error) {
      if (error.response) {
        dispatch(requestErr(error.response.data))
      } else {
        console.log('Error', error.message)
      }
      console.log(error)
    })
  }
}

export {
  fetchSEN,
  addSEN,
  syncSEN
}

// ------------------------------------
// Action Handlers
// ------------------------------------
const ACTION_HANDLERS = {
  [REQUEST_SEN]: (state) => {
    return ({
      ...state,
      fetching: true
    })
  },
  [RECEIVE_SEN]: (state, action) => {
    return ({
      ...state,
      fetching: false,
      list: action.payload ? action.payload.data.sensitivechar : []
    })
  },
  [RECEIVE_SEN_ADD]: (state, action) => {
    return ({
      ...state,
      add: action.payload ? action.payload.data : {}
    })
  },
  [RECEIVE_SEN_SYNC]: (state, action) => {
    return ({
      ...state,
      sync: action.payload ? action.payload.data : {}
    })
  },
  [SEN_ERR]: (state, action) => {
    return ({
      ...state,
      fetching: false,
      error: action.payload.tips
    })
  }
}

// ------------------------------------
// Reducer
// ------------------------------------
const initialState = { // 数据结构
  fetching: false,
  list: [],
  add: {},
  sync: {},
  error: null
}

  export default function(state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type]

  return handler
    ? handler(state, action)
    : state
}
