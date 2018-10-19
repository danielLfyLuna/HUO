/* global API_HOST */
import axios from 'axios'
// import _ from 'lodash'

import openNotificationWithIcon from '../../../../base/components/Notification'

// ------------------------------------
// Constants
// ------------------------------------
const RECEIVE_NOTICES_MERGE = 'RECEIVE_NOTICES_MERGE'
const REQUEST_NOTICES_MERGE = 'REQUEST_NOTICES_MERGE'
const CLEAR_NOTICES_MERGE = 'CLEAR_NOTICES_MERGE'

const MERGENOTICE_ERR = 'MERGENOTICE_ERR'

// ------------------------------------
// Actions
// ------------------------------------

function requestNotice() {
  return {
    type: REQUEST_NOTICES_MERGE
  }
}

function receiveNotice(data) {
  return {
    type: RECEIVE_NOTICES_MERGE,
    payload: data
  }
}

function clearNotice() {
  return {
    type: CLEAR_NOTICES_MERGE
  }
}

function requestErr(data) {
  return {
    type: MERGENOTICE_ERR,
    data: data
  }
}

function fetchMergeNotice(value = {}) {
  return (dispatch, getState) => {
    // 验证从复提交
    if (getState().mergeNotice.fetching) {
      return
    }

    dispatch(requestNotice())
    openNotificationWithIcon('info', '正在提交请勿重复点击提交')
    let url = `${API_HOST}/huo/products/${value.productId}/mergenotices`
    return axios({
      method: 'PUT',
      url: url,
      data: value,
      headers: {
        'adminUserId': JSON.parse(sessionStorage.getItem('hoolai')).userId,
        'Authorization': `bearer ${JSON.parse(sessionStorage.getItem('hoolai')).token}`
      }
    }).then(response => {
      dispatch(receiveNotice(response))
      openNotificationWithIcon('success', response.data.msg)
    }).catch(error => {
      if (error.response) {
        dispatch(requestErr(error))
        openNotificationWithIcon('error', error.response.data.tips)
      } else {
        console.log('Error', error.message)
      }
    })
  }
}

export {
  fetchMergeNotice,
  clearNotice
}

// ------------------------------------
// Action Handlers
// ------------------------------------
const ACTION_HANDLERS = {
  [REQUEST_NOTICES_MERGE]: (state) => {
    return ({
      ...state,
      fetching: true
    })
  },
  [RECEIVE_NOTICES_MERGE]: (state, action) => {
    return ({
      ...state,
      fetching: false,
      merge: action.payload ? action.payload.data : []
    })
  },
  [CLEAR_NOTICES_MERGE]: (state) => {
    return ({
      ...state,
      fetching: false,
      merge: [],
      error: null
    })
  },
  [MERGENOTICE_ERR]: (state, action) => {
    return ({
      ...state,
      error: action.payload.response.data.tips
    })
  }
}

// ------------------------------------
// Reducer
// ------------------------------------
const initialState = { // 数据结构
  fetching: false,
  merge: [],
  error: null
}

  export default function(state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type]

  return handler
    ? handler(state, action)
    : state
}
