/* global API_HOST */
import axios from 'axios'
import openNotificationWithIcon from '../../../../base/components/Notification'

// ------------------------------------
// Constants
// ------------------------------------

const PLAYER_BATCH_LOGS_REQUEST = 'PLAYER_BATCH_LOGS_REQUEST'
const PLAYER_BATCH_LOGS_REQUEST_ERR = 'PLAYER_BATCH_LOGS_REQUEST_ERR'
const PLAYER_BATCH_LOGS_RECEIVE = 'PLAYER_BATCH_LOGS_RECEIVE'
const PLAYER_BATCH_LOGS_CLEAR = 'PLAYER_BATCH_LOGS_CLEAR'

const WELFARE_KEEPING = 'WELFARE_KEEPING'

// ------------------------------------
// Actions
// ------------------------------------

function requestPlayerBatchLogs() {
  return {
    type: PLAYER_BATCH_LOGS_REQUEST
  }
}

function requestPlayerBatchLogsErr(data) {
  return {
    type: PLAYER_BATCH_LOGS_REQUEST_ERR,
    payload: data
  }
}

function receivePlayerBatchLogs(data) {
  return {
    type: PLAYER_BATCH_LOGS_RECEIVE,
    payload: data
  }
}

function clearPlayerLogs() {
  return {
    type: PLAYER_BATCH_LOGS_CLEAR
  }
}

function keepWelfare(data) {
  return {
    type: WELFARE_KEEPING,
    payload: data
  }
}

function fetchBatchPlayers(data) {
  return (dispatch) => {

    dispatch(requestPlayerBatchLogs())
    let url = `${API_HOST}/huo/welfares/products/${data.path.productId}/servers/${data.path.serverId}/benefitopen`
    axios({
      method: 'GET',
      url: url,
      params: data.params,
      headers: {
        'adminUserId': JSON.parse(sessionStorage.getItem('hoolai')).userId,
        'Authorization': `bearer ${JSON.parse(sessionStorage.getItem('hoolai')).token}`
      }
    }).then(response => {
      dispatch(receivePlayerBatchLogs(response))
    }).catch(error => {
      if (error.response) {
        dispatch(requestPlayerBatchLogsErr(error.response.data))
        openNotificationWithIcon('error', error.response.status, error.response.data.tips)
      } else {
        console.log('Error', error.message)
      }
    })
  }
}

export {
  fetchBatchPlayers,
  clearPlayerLogs,
  keepWelfare
}

// ------------------------------------
// Action Handlers
// ------------------------------------
const ACTION_HANDLERS = {
  [PLAYER_BATCH_LOGS_REQUEST]: (state) => {
    return ({
      ...state,
      fetching: true,
      err: false,
      errMes: {},
      logs: []
    })
  },
  [PLAYER_BATCH_LOGS_REQUEST_ERR]: (state, action) => {
    return ({
      ...state,
      fetching: false,
      err: true,
      errMes: action.payload ? { tips: action.payload.response.data.tips } : {}
    })
  },
  [PLAYER_BATCH_LOGS_RECEIVE]: (state, action) => {
    return ({
      ...state,
      fetching: false,
      logs: action.payload.data.list || []
    })
  },
  [PLAYER_BATCH_LOGS_CLEAR]: (state) => {
    return ({
      ...state,
      fetching: false,
      err: false,
      errMes: {},
      logs: [],
      clear: false
    })
  },
  [WELFARE_KEEPING]: (state, action) => {
    return ({
      ...state,
      keeping: {
        ...state.keeping,
        ...action.payload
      }
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
  groups: [],
  players: [],
  batch: [],
  logs: [],
  clear: true,
  keeping: {}
}

export default function (state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type]

  return handler
    ? handler(state, action)
    : state
}
