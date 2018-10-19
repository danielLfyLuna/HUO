/* global API_HOST */
import axios from 'axios'
// import openNotificationWithIcon from '../../../../base/components/Notification'

// ------------------------------------
// Constants
// ------------------------------------
const RECEIVE_SQLS_PLAYER = 'RECEIVE_SQLS_PLAYER'
const REQUEST_SQLS_PLAYER = 'REQUEST_SQLS_PLAYER'

const SQL_PLAYERLOG_ERR = 'SQL_PLAYERLOG_ERR'


// ------------------------------------
// Actions
// ------------------------------------

function requestSqls() {
  return {
    type: REQUEST_SQLS_PLAYER
  }
}

function receiveSqls(data) {
  return {
    type: RECEIVE_SQLS_PLAYER,
    payload: data
  }
}

function requestErr(data) {
  return {
    type: SQL_PLAYERLOG_ERR,
    data: data
  }
}

export function downloadSqls(data) {
  return (dispatch) => {
    const url = `${API_HOST}/huo/sqls/download/${data.fileName}`
    axios({
      method: 'GET',
      url: url,
      headers: {
        'adminUserId': JSON.parse(sessionStorage.getItem('hoolai')).userId,
        'Authorization': `bearer ${JSON.parse(sessionStorage.getItem('hoolai')).token}`
      }
    }).then(response => {}).catch(error => {
      if (error.response) {
        dispatch(requestErr(error.response.data))
      } else {
        console.log('Error', error.message)
      }
    })
  }
}

export function fetchSqls(data) {
  return (dispatch) => {
    dispatch(requestSqls())
    const url = `${API_HOST}/huo/sqls/playerlogs`
    axios({
      method: 'GET',
      url: url,
      params: data,
      headers: {
        'adminUserId': JSON.parse(sessionStorage.getItem('hoolai')).userId,
        'Authorization': `bearer ${JSON.parse(sessionStorage.getItem('hoolai')).token}`
      }
    }).then(response => {
      dispatch(receiveSqls(response))
    }).catch(error => {
      if (error.response) {
        dispatch(requestErr(error.response.data))
      } else {
        console.log('Error', error.message)
      }
    })
  }
}

// ------------------------------------
// Action Handlers
// ------------------------------------
const ACTION_HANDLERS = {
  [REQUEST_SQLS_PLAYER]: (state, action) => {
    return ({
      ...state,
      fetching: true
    })
  },
  [RECEIVE_SQLS_PLAYER]: (state, action) => {
    return ({
      ...state,
      fetching: false,
      list: action.payload.data ? action.payload.data.domainObject : []
    })
  },
  [SQL_PLAYERLOG_ERR]: (state, action) => {
    return ({
      ...state,
      fetching: false,
      error: { tips: action.payload.response.data.tips }
    })
  }
}

// ------------------------------------
// Reducer
// ------------------------------------
const initialState = { // 数据结构
  fetching: false,
  list: [],
  error: null
}

  export default function(state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type]

  return handler
    ? handler(state, action)
    : state
}
