/* global API_HOST */
import axios from 'axios'
// ------------------------------------
// Constants
// ------------------------------------
const SERVER_LIST_REQUEST = 'SERVER_LIST_REQUEST'
const SERVER_LIST_REQUEST_ERR = 'SERVER_LIST_REQUEST_ERR'
const SERVER_LIST_RECEIVE = 'SERVER_LIST_RECEIVE'
const SERVER_LIST_CLEAR = 'SERVER_LIST_CLEAR'

const SERVER_CREAT_REQUEST = 'SERVER_CREAT_REQUEST'
const SERVER_CREAT_RECEIVE = 'SERVER_CREAT_RECEIVE'

const SERVER_DELETE_REQUEST = 'SERVER_DELETE_REQUEST'
const SERVER_DELETE_RECEIVE = 'SERVER_DELETE_RECEIVE'


// ------------------------------------
// Actions
// ------------------------------------

function requestServers() {
  return {
    type: SERVER_LIST_REQUEST
  }
}

function receiveServers(data) {
  return {
    type: SERVER_LIST_RECEIVE,
    payload: data
  }
}

function requestCreateServers() {
  return {
    type: SERVER_CREAT_REQUEST
  }
}

function receiveCreateServers(data) {
  return {
    type: SERVER_CREAT_RECEIVE,
    payload: data
  }
}

function requestDeleteServers() {
  return {
    type: SERVER_DELETE_REQUEST
  }
}

function receiveDeleteServers(data) {
  return {
    type: SERVER_DELETE_RECEIVE,
    payload: data
  }
}

// ------------------------------------
// Action Handlers
// ------------------------------------
const ACTION_HANDLERS = {
  [SERVER_LIST_REQUEST]: (state) => {
    return ({
      ...state,
      fetching: true
    })
  },
  [SERVER_LIST_RECEIVE]: (state, action) => {
    return ({
      ...state,
      fetching: false,
      list: action.payload ? action.payload.data.domainObject : []
    })
  },
  [SERVER_LIST_CLEAR]: (state) => {
    return ({
      ...state,
      fetching: false,
      err: false,
      errMes: {},
      list: []
    })
  },
  [SERVER_LIST_REQUEST_ERR]: (state, action) => {
    return ({
      ...state,
      fetching: false,
      errMes: { tips: action.payload.response.data.tips }
    })
  },
  [SERVER_CREAT_REQUEST]: (state) => {
    return ({
      ...state,
      fetching: true
    })
  },
  [SERVER_CREAT_RECEIVE]: (state, action) => {
    return ({
      ...state,
      fetching: false
    })
  },
  [SERVER_DELETE_REQUEST]: (state) => {
    return ({
      ...state,
      fetching: true
    })
  },
  [SERVER_DELETE_RECEIVE]: (state, action) => {
    return ({
      ...state,
      fetching: false
    })
  }

}



function fetchServers(data) {
  return (dispatch, getState) => {
    dispatch(requestServers())
    let url = `${API_HOST}/huo/products/1/servers/timinglist`
    return axios({
      method: 'GET',
      url: url,
      headers: {
        'adminUserId': JSON.parse(sessionStorage.getItem('hoolai')).userId,
        'Authorization': `bearer ${JSON.parse(sessionStorage.getItem('hoolai')).token}`
      }
    }).then(response => {
      dispatch(receiveServers(response))
    })
  }
}

function createServers(data) {
  return (dispatch, getState) => {
    dispatch(requestCreateServers())
    let url = `${API_HOST}/huo/products/${data.product}/servers/timinglist/add`
    return axios({
      method: 'POST',
      data: {
        productId: data.product,
        executeTimeStr: data.time,
        serverStr: data.serversRegular,
        servers: [
        ]
      },
      url: url,
      headers: {
        'adminUserId': JSON.parse(sessionStorage.getItem('hoolai')).userId,
        'Authorization': `bearer ${JSON.parse(sessionStorage.getItem('hoolai')).token}`
      }
    }).then(response => {
      dispatch(receiveCreateServers(response))
    })
  }
}

function deleteServers(data) {
  return (dispatch, getState) => {
    dispatch(requestDeleteServers())
    let url = `${API_HOST}/huo/products/${data.productId}/servers/timinglist/del`
    return axios({
      method: 'DELETE',
      data: {
        productId: data.productId,
        executeTimeStr: data.originTime,
        serverStr: data.serverId
      },
      url: url,
      headers: {
        'adminUserId': JSON.parse(sessionStorage.getItem('hoolai')).userId,
        'Authorization': `bearer ${JSON.parse(sessionStorage.getItem('hoolai')).token}`
      }
    }).then(response => {
      dispatch(receiveDeleteServers(response))
    })
  }
}

export {
  fetchServers,
  createServers,
  deleteServers
}

// ------------------------------------
// Reducer
// ------------------------------------
const initialState = { // 数据结构
  fetching: false,
  err: false,
  errMes: {},
  list: [],
  create: {},
  update: {},
  operation: {}
}

export default function(state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type]

  return handler
    ? handler(state, action)
    : state
}
