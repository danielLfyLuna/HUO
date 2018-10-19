/* global API_HOST */
import axios from 'axios'
import _ from 'lodash'

import openNotificationWithIcon from '../../../../base/components/Notification'

// ------------------------------------
// Constants
// ------------------------------------
const MERGE_REQUEST = 'MERGE_REQUEST'
const MERGE_RECEIVE = 'MERGE_RECEIVE'
const MERGE_CLEAR = 'MERGE_CLEAR'
const MERGE_INI = 'MERGE_INI'

const MERGE_ADD_REQUEST = 'MERGE_ADD_REQUEST'
const MERGE_ADD_RECEIVE = 'MERGE_ADD_RECEIVE'

const MERGE_UPDATE_REQUEST = 'MERGE_UPDATE_REQUEST'
const MERGE_UPDATE_RECEIVE = 'MERGE_UPDATE_RECEIVE'

const MERGE_REQUEST_ERR = 'MERGE_REQUEST_ERR'

// ------------------------------------
// Actions
// ------------------------------------

function requestMerge() {
  return {
    type: MERGE_REQUEST
  }
}

function receiveMerge(data) {
  return {
    type: MERGE_RECEIVE,
    payload: data
  }
}

function clearMerge() {
  return {
    type: MERGE_CLEAR
  }
}

function setInitialMerge(data) {
  return {
    type: MERGE_INI,
    payload: data
  }
}

function requestMergeAdd() {
  return {
    type: MERGE_ADD_REQUEST
  }
}

function receiveMergeAdd(data) {
  return {
    type: MERGE_ADD_RECEIVE,
    payload: data
  }
}

function requestMergeUpdate() {
  return {
    type: MERGE_UPDATE_REQUEST
  }
}

function receiveMergeUpdate(data) {
  return {
    type: MERGE_UPDATE_RECEIVE,
    payload: data
  }
}

function requestErr(data) {
  return {
    type: MERGE_REQUEST_ERR,
    payload: data
  }
}

function fetchMerge(value) {
  return (dispatch, getState) => {
    dispatch(requestMerge())
    let url = `${API_HOST}/huo/merges/${value.productId[0]}`
    return axios({
      method: 'GET',
      url: url,
      headers: {
        'adminUserId': JSON.parse(sessionStorage.getItem('hoolai')).userId,
        'Authorization': `bearer ${JSON.parse(sessionStorage.getItem('hoolai')).token}`
      }
    }).then(response => {
      dispatch(receiveMerge(response))
      dispatch(setInitialMerge(value.productId))
    }).catch(error => {
      if (error.response) {
        dispatch(requestErr(error.response.data))
        openNotificationWithIcon('error', error.response.data.tips)
      } else {
        console.log('Error', error.message)
      }
    })
  }
}

function addMerge(data) {
  return (dispatch, getState) => {
    dispatch(requestMergeAdd())
    let url = `${API_HOST}/huo/merges`
    return axios({
      method: 'POST',
      data: data,
      url: url,
      headers: {
        'adminUserId': JSON.parse(sessionStorage.getItem('hoolai')).userId,
        'Authorization': `bearer ${JSON.parse(sessionStorage.getItem('hoolai')).token}`
      }
    }).then(response => {
      dispatch(receiveMergeAdd(response))
      openNotificationWithIcon('success', '添加成功')
    }).catch(error => {
      if (error.response) {
        dispatch(requestErr(error.response.data))
        openNotificationWithIcon('error', error.response.data.tips)
      } else {
        console.log('Error', error.message)
      }
    })
  }
}

function updateMerge(data) {
  return (dispatch, getState) => {
    dispatch(requestMergeUpdate())
    let url = `${API_HOST}/huo/merges`
    return axios({
      method: 'PUT',
      data: data,
      url: url,
      headers: {
        'adminUserId': JSON.parse(sessionStorage.getItem('hoolai')).userId,
        'Authorization': `bearer ${JSON.parse(sessionStorage.getItem('hoolai')).token}`
      }
    }).then(response => {
      dispatch(receiveMergeUpdate(response))
      openNotificationWithIcon('success', '更新成功')
    }).catch(error => {
      if (error.response) {
        dispatch(requestErr(error.response.data))
        openNotificationWithIcon('error', error.response.data.tips)
      } else {
        console.log('Error', error.message)
      }
    })
  }
}

export {
  clearMerge,
  fetchMerge,
  addMerge,
  updateMerge

}

// ------------------------------------
// Action Handlers
// ------------------------------------
const ACTION_HANDLERS = {
  [MERGE_REQUEST]: (state) => {
    return ({
      ...state,
      fetching: true
    })
  },
  [MERGE_RECEIVE]: (state, action) => {
    return ({
      ...state,
      fetching: false,
      list: action.payload.data.domainObject
    })
  },
  [MERGE_CLEAR]: (state) => {
    return ({
      ...state,
      fetching: false,
      adding: false,
      err: false,
      errMes: {},
      list: [],
      initial: []
    })
  },
  [MERGE_INI]: (state, action) => {
    return ({
      ...state,
      initial: action.payload
    })
  },

  [MERGE_ADD_REQUEST]: (state) => {
    return ({
      ...state,
      adding: true,
      err: false,
      errMes: {}
    })
  },
  [MERGE_ADD_RECEIVE]: (state, action) => {
    return ({
      ...state,
      adding: false,
      add: action.payload.data
    })
  },

  [MERGE_UPDATE_REQUEST]: (state) => {
    return ({
      ...state,
      editing: true,
      err: false,
      errMes: {}
    })
  },
  [MERGE_UPDATE_RECEIVE]: (state, action) => {
    _.map(state.list, (val, idx) => {
      if (action.payload.data.id === val.id) {
        state.list[idx] = action.payload.data
      }
    })

    return ({
      ...state,
      editing: false,
      update: action.payload.data
    })
  },

  [MERGE_REQUEST_ERR]: (state, action) => {
    return ({
      ...state,
      fetching: false,
      adding: false,
      editing: false,
      err: true,
      errMes: action.payload ? { tips: action.payload.tips } : {}
    })
  }
}

// ------------------------------------
// Reducer
// ------------------------------------
const initialState = { // 数据结构
  fetching: false,
  adding: false,
  editing: false,
  err: false,
  errMes: {},
  list: [],
  add: {},
  update: {},
  initial: []
}

export default function(state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type]

  return handler
    ? handler(state, action)
    : state
}
