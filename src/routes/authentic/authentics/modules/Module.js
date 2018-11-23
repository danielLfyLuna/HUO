import AxiosAPI from '../../../../../utils/axios-api'
import openNotificationWithIcon from '../../../../base/components/Notification'

// ------------------------------------
// Constants
// ------------------------------------
const AUTHENTIC_LIST_REQUEST = 'AUTHENTIC_LIST_REQUEST'
const AUTHENTIC_LIST_REQUEST_ERR = 'AUTHENTIC_LIST_REQUEST_ERR'
const AUTHENTIC_LIST_RECEIVE = 'AUTHENTIC_LIST_RECEIVE'
const AUTHENTIC_LIST_CLEAR = 'AUTHENTIC_LIST_CLEAR'

const AUTHENTIC_ADD_REQUEST = 'AUTHENTIC_ADD_REQUEST'
const AUTHENTIC_ADD_REQUEST_ERR = 'AUTHENTIC_ADD_REQUEST_ERR'
const AUTHENTIC_ADD_RECEIVE = 'AUTHENTIC_ADD_RECEIVE'

const AUTHENTIC_DEL_REQUEST = 'AUTHENTIC_DEL_REQUEST'
const AUTHENTIC_DEL_REQUEST_ERR = 'AUTHENTIC_DEL_REQUEST_ERR'
const AUTHENTIC_DEL_RECEIVE = 'AUTHENTIC_DEL_RECEIVE'
// ------------------------------------
// Actions
// ------------------------------------

function requestAuthentics() {
  return {
    type: AUTHENTIC_LIST_REQUEST
  }
}

function requestAuthenticsErr(data) {
  return {
    type: AUTHENTIC_LIST_REQUEST_ERR,
    payload: data
  }
}

function receiveAuthentics(data) {
  return {
    type: AUTHENTIC_LIST_RECEIVE,
    payload: data
  }
}

function clearAuthentics() {
  return {
    type: AUTHENTIC_LIST_CLEAR
  }
}

function requestAuthenticAdd() {
  return {
    type: AUTHENTIC_ADD_REQUEST
  }
}

function requestAuthenticAddErr(data) {
  return {
    type: AUTHENTIC_ADD_REQUEST_ERR,
    payload: data
  }
}

function receiveAuthenticAdd(data) {
  return {
    type: AUTHENTIC_ADD_RECEIVE,
    payload: data
  }
}

function requestAuthenticDel() {
  return {
    type: AUTHENTIC_DEL_REQUEST
  }
}

function requestAuthenticDelErr(data) {
  return {
    type: AUTHENTIC_DEL_REQUEST_ERR,
    payload: data
  }
}

function receiveAuthenticDel(data) {
  return {
    type: AUTHENTIC_DEL_RECEIVE,
    payload: data
  }
}

function fetchAuthentics() {
  return (dispatch, getState) => {

    dispatch(requestAuthentics())
    let url = '/huo/products/authentic/ips'
    AxiosAPI({
      method: 'GET',
      url: url
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

function addAuthentic(data) {
  return (dispatch, getState) => {
    dispatch(requestAuthenticAdd())
    let url = '/huo/products/authentic/ips'
    AxiosAPI({
      method: 'POST',
      data: data.form,
      url: url
    }).then(response => {
      dispatch(receiveAuthenticAdd(response))
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

function delAuthentic(data) {
  return (dispatch, getState) => {
    dispatch(requestAuthenticDel())
    let url = '/huo/products/authentic/ips'
    AxiosAPI({
      method: 'DELETE',
      data: data.form,
      url: url
    }).then(response => {
      dispatch(receiveAuthenticDel(response))
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
  [AUTHENTIC_LIST_REQUEST]: (state) => {
    return ({
      ...state,
      fetching: true,
      err: false,
      errMes: {},
      list: []
    })
  },
  [AUTHENTIC_LIST_REQUEST_ERR]: (state, action) => {
    return ({
      ...state,
      fetching: false,
      err: true,
      errMes: { tips: action.payload.response.data.tips }
    })
  },
  [AUTHENTIC_LIST_RECEIVE]: (state, action) => {
    return ({
      ...state,
      fetching: false,
      list: action.payload.data
    })
  },
  [AUTHENTIC_LIST_CLEAR]: (state) => {
    return ({
      ...state,
      fetching: false,
      err: false,
      errMes: {},
      list: []
    })
  },
  [AUTHENTIC_ADD_REQUEST]: (state) => {
    return ({
      ...state,
      fetching: true,
      err: false,
      errMes: {},
      create: {}
    })
  },
  [AUTHENTIC_ADD_REQUEST_ERR]: (state, action) => {
    return ({
      ...state,
      fetching: false,
      err: true,
      errMes: { tips: action.payload.response.data.tips }
    })
  },
  [AUTHENTIC_ADD_RECEIVE]: (state, action) => {
    const list = {...state.list}
    const ip = action.payload.data.ip
    list.authenticIps.push(ip)
    return ({
      ...state,
      fetching: false,
      list: {...list},
      create: {ip}
    })
  },
  [AUTHENTIC_DEL_REQUEST]: (state) => {
    return ({
      ...state,
      fetching: true,
      err: false,
      errMes: {},
      delete: {}
    })
  },
  [AUTHENTIC_DEL_REQUEST_ERR]: (state, action) => {
    return ({
      ...state,
      fetching: false,
      err: true,
      errMes: { tips: action.payload.response.data.tips }
    })
  },
  [AUTHENTIC_DEL_RECEIVE]: (state, action) => {
    const list = {...state.list}
    const ip = action.payload.data.ip
    const authenticIps = list.authenticIps.filter(opt => opt !== ip)

    return ({
      ...state,
      fetching: false,
      list: {...list, authenticIps},
      delete: {ip}
    })
  }
}

// ------------------------------------
// Reducer
// ------------------------------------
const initialState = { // 数据结构
  fetching: false,
  err: false,
  errMes: {},
  list: {},
  create: {},
  delete: {}
}

export default function(state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type]

  return handler
    ? handler(state, action)
    : state
}
