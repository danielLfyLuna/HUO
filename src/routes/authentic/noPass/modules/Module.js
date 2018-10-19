/* global API_HOST */
import axios from 'axios'
import openNotificationWithIcon from '../../../../base/components/Notification'

// ------------------------------------
// Constants
// ------------------------------------
const NOPASS_LIST_REQUEST = 'NOPASS_LIST_REQUEST'
const NOPASS_LIST_REQUEST_ERR = 'NOPASS_LIST_REQUEST_ERR'
const NOPASS_LIST_RECEIVE = 'NOPASS_LIST_RECEIVE'
const NOPASS_LIST_CLEAR = 'NOPASS_LIST_CLEAR'

const NOPASS_ADD_REQUEST = 'NOPASS_ADD_REQUEST'
const NOPASS_ADD_REQUEST_ERR = 'NOPASS_ADD_REQUEST_ERR'
const NOPASS_ADD_RECEIVE = 'NOPASS_ADD_RECEIVE'

const NOPASS_DEL_REQUEST = 'NOPASS_DEL_REQUEST'
const NOPASS_DEL_REQUEST_ERR = 'NOPASS_DEL_REQUEST_ERR'
const NOPASS_DEL_RECEIVE = 'NOPASS_DEL_RECEIVE'
// ------------------------------------
// Actions
// ------------------------------------

function requestAuthentics(data) {
  return {
    type: NOPASS_LIST_REQUEST,
    payload: data
  }
}

function requestAuthenticsErr(data) {
  return {
    type: NOPASS_LIST_REQUEST_ERR,
    payload: data
  }
}

function receiveAuthentics(data) {
  return {
    type: NOPASS_LIST_RECEIVE,
    payload: data
  }
}

function clearAuthentics() {
  return {
    type: NOPASS_LIST_CLEAR
  }
}

function requestAuthenticAdd() {
  return {
    type: NOPASS_ADD_REQUEST
  }
}

function requestAuthenticAddErr(data) {
  return {
    type: NOPASS_ADD_REQUEST_ERR,
    payload: data
  }
}

function receiveAuthenticAdd(data) {
  return {
    type: NOPASS_ADD_RECEIVE,
    payload: data
  }
}

function requestAuthenticDel() {
  return {
    type: NOPASS_DEL_REQUEST
  }
}

function requestAuthenticDelErr(data) {
  return {
    type: NOPASS_DEL_REQUEST_ERR,
    payload: data
  }
}

function receiveAuthenticDel(data) {
  return {
    type: NOPASS_DEL_RECEIVE,
    payload: data
  }
}

function fetchAuthentics(value) {
  return (dispatch, getState) => {

    dispatch(requestAuthentics(value))
    let url = `${API_HOST}/huo/products/authentic/ips/nopass`
    let data = value

    return axios({
      method: 'GET',
      url: url,
      params: data,
      headers: {
        'adminUserId': JSON.parse(sessionStorage.getItem('hoolai')).userId,
        'Authorization': `bearer ${JSON.parse(sessionStorage.getItem('hoolai')).token}`
      }
    }).then(response => {
      dispatch(receiveAuthentics(response))
    }).catch(error => {
      if (error.response) {
        dispatch(requestAuthenticsErr(error.response.data))
        openNotificationWithIcon('error', error.response.data.tips)
      } else {
        console.log('Error', error.message)
      }
    })
  }
}

function addAuthentic(dataes) {
  return (dispatch, getState) => {
    dispatch(requestAuthenticAdd())
    let url = `${API_HOST}/huo/products/authentic/ips/nopass`
    return axios({
      method: 'POST',
      data: dataes,
      url: url,
      headers: {
        'adminUserId': JSON.parse(sessionStorage.getItem('hoolai')).userId,
        'Authorization': `bearer ${JSON.parse(sessionStorage.getItem('hoolai')).token}`
      }
    }).then(response => {
      dispatch(receiveAuthenticAdd(response))
      openNotificationWithIcon('success', '添加成功!')
    }).catch(error => {
      if (error.response) {
        dispatch(requestAuthenticAddErr(error.response.data))
        openNotificationWithIcon('error', error.response.data.tips)
      } else {
        console.log('Error', error.message)
      }
    })
  }
}

function delAuthentic(dataes) {
  return (dispatch, getState) => {
    dispatch(requestAuthenticDel())
    let url = `${API_HOST}/huo/products/authentic/ips/nopass`
    return axios({
      method: 'PUT',
      data: dataes,
      url: url,
      headers: {
        'adminUserId': JSON.parse(sessionStorage.getItem('hoolai')).userId,
        'Authorization': `bearer ${JSON.parse(sessionStorage.getItem('hoolai')).token}`
      }
    }).then(response => {
      dispatch(receiveAuthenticDel(response))
      openNotificationWithIcon('success', '删除成功!')
    }).catch(error => {
      if (error.response) {
        dispatch(requestAuthenticDelErr(error.response.data))
        openNotificationWithIcon('error', error.response.data.tips)
      } else {
        console.log('Error', error.message)
      }
    })
  }
}

export {
  fetchAuthentics,
  clearAuthentics,
  addAuthentic,
  delAuthentic
}

// ------------------------------------
// Action Handlers
// ------------------------------------
const ACTION_HANDLERS = {
  [NOPASS_LIST_REQUEST]: (state, action) => {
    return ({
      ...state,
      fetching: true,
      err: {},
      list: [],
      items: action.payload
    })
  },
  [NOPASS_LIST_REQUEST_ERR]: (state, action) => {
    return ({
      ...state,
      fetching: false,
      err: action.payload.tips
    })
  },
  [NOPASS_LIST_RECEIVE]: (state, action) => {
    return ({
      ...state,
      fetching: false,
      list: action.payload.data.domainObject
    })
  },
  [NOPASS_LIST_CLEAR]: (state) => {
    return ({
      ...state,
      fetching: false,
      err: {},
      list: []
    })
  },
  [NOPASS_ADD_REQUEST]: (state) => {
    return ({
      ...state,
      fetching: true,
      err: {}
    })
  },
  [NOPASS_ADD_REQUEST_ERR]: (state, action) => {
    return ({
      ...state,
      fetching: false,
      err: action.payload.tips
    })
  },
  [NOPASS_ADD_RECEIVE]: (state, action) => {
    return ({
      ...state,
      fetching: false,
      list: action.payload.data.domainObject
    })
  },
  [NOPASS_DEL_REQUEST]: (state) => {
    return ({
      ...state,
      fetching: true,
      err: {}
    })
  },
  [NOPASS_DEL_REQUEST_ERR]: (state, action) => {
    return ({
      ...state,
      fetching: false,
      err: action.payload.tips
    })
  },
  [NOPASS_DEL_RECEIVE]: (state, action) => {
    return ({
      ...state,
      fetching: false,
      list: action.payload.data.domainObject
    })
  }
}

// ------------------------------------
// Reducer
// ------------------------------------
const initialState = { // 数据结构
  fetching: false,
  err: {},
  list: [],
  items: {
    productId: '',
    serverId: ''
  }
}

export default function(state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type]

  return handler
    ? handler(state, action)
    : state
}
