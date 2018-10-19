import _ from 'lodash'

import AxiosAPI from '../../../../../utils/axios-api'
import openNotificationWithIcon from '../../../../base/components/Notification'

// ------------------------------------
// Constants
// ------------------------------------
const BLACKLIST_REQUEST = 'BLACKLIST_REQUEST'
const BLACKLIST_REQUEST_ERR = 'BLACKLIST_REQUEST_ERR'
const BLACKLIST_RECEIVE = 'BLACKLIST_RECEIVE'
const BLACKLIST_CLEAR = 'BLACKLIST_CLEAR'

const BLACKLIST_ADD_REQUEST = 'BLACKLIST_ADD_REQUEST'
const BLACKLIST_ADD_REQUEST_ERR = 'BLACKLIST_ADD_REQUEST_ERR'
const BLACKLIST_ADD_RECEIVE = 'BLACKLIST_ADD_RECEIVE'

const BLACKLIST_REMOVE_REQUEST = 'BLACKLIST_REMOVE_REQUEST'
const BLACKLIST_REMOVE_REQUEST_ERR = 'BLACKLIST_REMOVE_REQUEST_ERR'
const BLACKLIST_REMOVE_RECEIVE = 'BLACKLIST_REMOVE_RECEIVE'

const BLACKLIST_KEEPING = 'BLACKLIST_KEEPING'

// ------------------------------------
// Actions
// ------------------------------------

function requestBlacklist() {
  return {
    type: BLACKLIST_REQUEST
  }
}

function requestBlacklistErr(data) {
  return {
    type: BLACKLIST_REQUEST_ERR,
    payload: data
  }
}

function receiveBlacklist(data) {
  return {
    type: BLACKLIST_RECEIVE,
    payload: data
  }
}

function clearBlacklist() {
  return {
    type: BLACKLIST_CLEAR
  }
}

function requestBlacklistAdd() {
  return {
    type: BLACKLIST_ADD_REQUEST
  }
}

function requestBlacklistAddErr(data) {
  return {
    type: BLACKLIST_ADD_REQUEST_ERR,
    payload: data
  }
}

function receiveBlacklistAdd(data) {
  return {
    type: BLACKLIST_ADD_RECEIVE,
    payload: data
  }
}

function requestBlacklistRemove() {
  return {
    type: BLACKLIST_REMOVE_REQUEST
  }
}

function requestBlacklistRemoveErr(data) {
  return {
    type: BLACKLIST_REMOVE_REQUEST_ERR,
    payload: data
  }
}

function receiveBlacklistRemove(data) {
  return {
    type: BLACKLIST_REMOVE_RECEIVE,
    payload: data
  }
}

function keepBlacklist(data) {
  return {
    type: BLACKLIST_KEEPING,
    payload: data
  }
}


function fetchBlacklist(data) {
  return (dispatch, getState) => {

    dispatch(requestBlacklist())
    let url = `/huo/products/${data.path.productId}/servers/${data.path.serverId}/blacklist`
    AxiosAPI({
      method: 'GET',
      url: url,
      params: data.params,
    }).then(response => {
      dispatch(receiveBlacklist(response))
    }).catch(error => {
      if (error.response) {
        dispatch(requestBlacklistErr(error.response.data))
        openNotificationWithIcon('error', error.response.status, error.response.data.tips)
      } else {
        console.log('Error', error.message)
      }
    })
  }
}

function addBlacklist(data) {
  return (dispatch, getState) => {

    dispatch(requestBlacklistAdd())
    let url = `/huo/products/${data.path.productId}/servers/${data.path.serverId}/blacklist`
    AxiosAPI({
      method: 'POST',
      data: data.form,
      url: url,
    }).then(response => {
      dispatch(receiveBlacklistAdd(response))
      openNotificationWithIcon('success', '封禁成功！')
    }).catch(error => {
      if (error.response) {
        dispatch(requestBlacklistAddErr(error.response.data))
        openNotificationWithIcon('error', error.response.status, error.response.data.tips)
      } else {
        console.log('Error', error.message)
      }
    })
  }
}

function removeBlacklist(data) {
  return (dispatch, getState) => {
  console.log(data)
    dispatch(requestBlacklistRemove())
    let url = `/huo/products/${data.path.productId}/servers/${data.path.serverId}/blacklist`
    AxiosAPI({
      method: 'PUT',
      data: data.form,
      url: url,
    }).then(response => {
      dispatch(receiveBlacklistRemove(response))
      openNotificationWithIcon('success', '解除封禁！')
      dispatch(fetchBlacklist(data))
    }).catch(error => {
      if (error.response) {
        dispatch(requestBlacklistRemoveErr(error.response.data))
        openNotificationWithIcon('error', error.response.status, error.response.data.tips)
      } else {
        console.log('Error', error.message)
      }
    })
  }
}

export {
  fetchBlacklist,
  clearBlacklist,
  addBlacklist,
  removeBlacklist,
  keepBlacklist
}

// ------------------------------------
// Action Handlers
// ------------------------------------
const ACTION_HANDLERS = {
  [BLACKLIST_REQUEST]: (state) => {
    return ({
      ...state,
      fetching: true,
      err: false,
      errMes: {},
      list: []
    })
  },
  [BLACKLIST_REQUEST_ERR]: (state, action) => {
    return ({
      ...state,
      fetching: false,
      err: true,
      errMes: { tips: action.payload.response.data.tips }
    })
  },
  [BLACKLIST_RECEIVE]: (state, action) => {
    return ({
      ...state,
      fetching: false,
      list: action.payload.data.domainObject || []
    })
  },
  [BLACKLIST_CLEAR]: (state) => {
    return ({
      ...state,
      fetching: false,
      err: false,
      errMes: {},
      list: []
    })
  },
  [BLACKLIST_ADD_REQUEST]: (state) => {
    return ({
      ...state,
      fetching: true,
      err: false,
      errMes: {},
      add: {}
    })
  },
  [BLACKLIST_ADD_REQUEST_ERR]: (state, action) => {
    return ({
      ...state,
      fetching: false,
      err: true,
      errMes: action.payload ? { tips: action.payload.response.data.tips } : {}
    })
  },
  [BLACKLIST_ADD_RECEIVE]: (state, action) => {
    return ({
      ...state,
      fetching: false,
      add: action.payload.data
    })
  },
  [BLACKLIST_REMOVE_REQUEST]: (state) => {
    return ({
      ...state,
      fetching: true,
      err: false,
      errMes: {},
      remove: {}
    })
  },
  [BLACKLIST_REMOVE_REQUEST_ERR]: (state, action) => {
    return ({
      ...state,
      fetching: false,
      err: true,
      errMes: action.payload ? { tips: action.payload.response.data.tips } : {}
    })
  },
  [BLACKLIST_REMOVE_RECEIVE]: (state, action) => {
    const list = [...state.list]
    const black = action.payload.data
    _.map(list, (val, index) => {
      if (black.playerId && val.playerId === black.playerId) {
        val = Object.assign(val, black)
      }
    })
    return ({
      ...state,
      fetching: false,
      list: [...list],
      remove: black
    })
  },
  [BLACKLIST_KEEPING]: (state, action) => {
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
  list: [],
  add: {},
  remove: {},
  keeping: {}
}

export default function(state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type]

  return handler ? handler(state, action) : state
}
