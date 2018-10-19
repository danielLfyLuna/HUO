/* global API_HOST */
import axios from 'axios'
// import _ from 'lodash'

import openNotificationWithIcon from '../../../../base/components/Notification'

// ------------------------------------
// Constants
// ------------------------------------
const USERFORBID_REQUEST = 'USERFORBID_REQUEST'
const USERFORBID_RECEIVE = 'USERFORBID_RECEIVE'
const USERFORBID_CLEAR = 'USERFORBID_CLEAR'

const USERFORBID_ADD_REQUEST = 'USERFORBID_ADD_REQUEST'
const USERFORBID_ADD_RECEIVE = 'USERFORBID_ADD_RECEIVE'

const USERFORBID_REMOVE_REQUEST = 'USERFORBID_REMOVE_REQUEST'
const USERFORBID_REMOVE_RECEIVE = 'USERFORBID_REMOVE_RECEIVE'

const USERFORBID_REQUEST_ERR = 'USERFORBID_REQUEST_ERR'

// ------------------------------------
// Actions
// ------------------------------------

function requestUserForbid() {
  return {
    type: USERFORBID_REQUEST
  }
}

function receiveUserForbid(data) {
  return {
    type: USERFORBID_RECEIVE,
    payload: data
  }
}

function clearUserForbid() {
  return {
    type: USERFORBID_CLEAR
  }
}

function requestErr(data) {
  return {
    type: USERFORBID_REQUEST_ERR,
    payload: data
  }
}

function fetchUserForbid(value) {
  return (dispatch, getState) => {

    dispatch(requestUserForbid())
    let url = `${API_HOST}/huo/products/${value.productId}/users`
    return axios({
      method: 'GET',
      url: url,
      params: {userId: value.userId},
      headers: {
        'adminUserId': JSON.parse(sessionStorage.getItem('hoolai')).userId,
        'Authorization': `bearer ${JSON.parse(sessionStorage.getItem('hoolai')).token}`
      }
    }).then(response => {
      dispatch(receiveUserForbid(response))
    }).catch(error => {
      if (error.response) {
        dispatch(requestErr(error.response.data))
        openNotificationWithIcon('error', error.response.status, error.response.data.tips)
      } else {
        console.log('Error', error.message)
      }
    })
  }
}

function requestAdd() {
  return {
    type: USERFORBID_ADD_REQUEST
  }
}

function receiveAdd(data) {
  return {
    type: USERFORBID_ADD_RECEIVE,
    payload: data
  }
}

function addUserForbid(value) {
  return (dispatch, getState) => {
    if (getState().userForbid.adding) {
      return
    }
    dispatch(requestAdd())
    let url = `${API_HOST}/huo/products/${value.productId}/users/${value.userId}`
    return axios({
      method: 'POST',
      url: url,
      data: value,
      headers: {
        'adminUserId': JSON.parse(sessionStorage.getItem('hoolai')).userId,
        'Authorization': `bearer ${JSON.parse(sessionStorage.getItem('hoolai')).token}`
      }
    }).then(response => {
      dispatch(receiveAdd(response))
      openNotificationWithIcon('success', '添加黑名单成功')
      dispatch(fetchUserForbid({productId: response.data.domainObject.productId}))
    }).catch(error => {
      if (error.response) {
        dispatch(requestErr(error.response.data))
        openNotificationWithIcon('error', error.response.status, error.response.data.tips)
      } else {
        console.log('Error', error.message)
      }
    })
  }
}

function requestRemove() {
  return {
    type: USERFORBID_REMOVE_REQUEST
  }
}

function receiveRemove(data) {
  return {
    type: USERFORBID_REMOVE_RECEIVE,
    payload: data
  }
}

function removeUserForbid(value) {
  return (dispatch, getState) => {
    if (getState().userForbid.removing) {
      return
    }
    dispatch(requestRemove())
    let url = `${API_HOST}/huo/products/${value.productId}/users/${value.userId}`
    return axios({
      method: 'DELETE',
      url: url,
      headers: {
        'adminUserId': JSON.parse(sessionStorage.getItem('hoolai')).userId,
        'Authorization': `bearer ${JSON.parse(sessionStorage.getItem('hoolai')).token}`
      }
    }).then(response => {
      dispatch(receiveRemove(response))
      openNotificationWithIcon('success', '解封成功')
      dispatch(fetchUserForbid({productId: response.data.domainObject.productId}))
    }).catch(error => {
      if (error.response) {
        dispatch(requestErr(error.response.data))
        openNotificationWithIcon('error', error.response.status, error.response.data.tips)
      } else {
        console.log('Error', error.message)
      }
    })
  }
}

export {
  clearUserForbid,
  fetchUserForbid,
  addUserForbid,
  removeUserForbid
}

// ------------------------------------
// Action Handlers
// ------------------------------------
const ACTION_HANDLERS = {
  [USERFORBID_REQUEST]: (state) => {
    return ({
      ...state,
      fetching: true
    })
  },
  [USERFORBID_RECEIVE]: (state, action) => {
    return ({
      ...state,
      fetching: false,
      list: action.payload.data.domainObject || []
    })
  },

  [USERFORBID_ADD_REQUEST]: (state) => {
    return ({
      ...state,
      adding: true
    })
  },
  [USERFORBID_ADD_RECEIVE]: (state, action) => {
    return ({
      ...state,
      adding: false,
      add: action.payload.data
    })
  },

  [USERFORBID_REMOVE_REQUEST]: (state) => {
    return ({
      ...state,
      removing: true
    })
  },
  [USERFORBID_REMOVE_RECEIVE]: (state, action) => {
    return ({
      ...state,
      removing: false,
      remove: action.payload.data.domainObject
    })
  },


  [USERFORBID_CLEAR]: (state) => {
    return ({
      ...state,
      fetching: false,
      adding: false,
      removing: false,
      err: false,
      errMes: {},
      list: [],
      add: {},
      remove: {}
    })
  },

  [USERFORBID_REQUEST_ERR]: (state, action) => {
    return ({
      ...state,
      fetching: false,
      adding: false,
      removing: false,
      err: true,
      errMes: { tips: action.payload.response.data.tips }
    })
  }
}

// ------------------------------------
// Reducer
// ------------------------------------
const initialState = { // 数据结构
  fetching: false,
  adding: false,
  removing: false,
  err: false,
  errMes: {},
  list: [],
  remove: {},
  add: {}
}

export default function(state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type]

  return handler
    ? handler(state, action)
    : state
}
