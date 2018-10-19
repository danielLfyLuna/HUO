
// import axios from 'axios'
import AxiosAPI from '../../../../../utils/axios-api'
// import _ from 'lodash'
import openNotificationWithIcon from '../../../../base/components/Notification'

// ------------------------------------
// Constants
// ------------------------------------
const RECEIVE_NOTICES_TIMING = 'RECEIVE_NOTICES_TIMING'
const REQUEST_NOTICES_TIMING = 'REQUEST_NOTICES_TIMING'
const CLEAR_NOTICES_TIMING = 'CLEAR_NOTICES_TIMING'

const REQUEST_ERR = 'REQUEST_ERR'

const KEEPING_NOTICES_TIMING = 'KEEPING_NOTICES_TIMING'

// ------------------------------------
// Actions
// ------------------------------------

function requestNoticesTiming() {
  return {
    type: REQUEST_NOTICES_TIMING
  }
}

function receiveNoticesTiming(data) {
  return {
    type: RECEIVE_NOTICES_TIMING,
    payload: data
  }
}

function clearNoticesTiming() {
  return {
    type: CLEAR_NOTICES_TIMING
  }
}

function requestErr(data) {
  return {
    type: REQUEST_ERR,
    data: data
  }
}

function keepNoticesTiming(data) {
  return {
    type: KEEPING_NOTICES_TIMING,
    payload: data
  }
}

function fetchNoticesTiming(value = {}) {
  return (dispatch, getState) => {
    dispatch(requestNoticesTiming())
    let url = `/huo/products/${value.path.productId}/timingnotices`
    AxiosAPI({
      method: 'GET',
      url: url,
      params: value.params
    }).then(response => {
      dispatch(receiveNoticesTiming(response))
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

function addTimingNotice(notice) {
  return (dispatch, getState) => {
    let url = `/huo/products/${notice.productId}/timingnotices`
    AxiosAPI({
      method: 'POST',
      data: notice.data,
      url: url
    }).then(response => {
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

function stopTimingNotice(value = {}) {
  return (dispatch, getState) => {
    // 验证从复提交
    if (getState().timingNotice.fetching) {
      return
    }
    let url = `/huo/products/${value.productId}/timingnotices/${value.id}/stop`
    AxiosAPI({
      method: 'PUT',
      url: url
    }).then(response => {
      openNotificationWithIcon('success', '已停止')
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

function deleteTimingNotice(value = {}) {
  return (dispatch, getState) => {
    let url = `/huo/products/${value.productId}/timingnotices/${value.id}`
    AxiosAPI({
      method: 'DELETE',
      data: value,
      url: url
    }).then(response => {
      openNotificationWithIcon('success', '删除成功')
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
  requestNoticesTiming,
  receiveNoticesTiming,
  clearNoticesTiming,
  fetchNoticesTiming,
  addTimingNotice,
  stopTimingNotice,
  deleteTimingNotice,
  keepNoticesTiming
}

// ------------------------------------
// Action Handlers
// ------------------------------------
const ACTION_HANDLERS = {
  [REQUEST_NOTICES_TIMING]: (state) => {
    return ({
      ...state,
      fetching: true
    })
  },
  [RECEIVE_NOTICES_TIMING]: (state, action) => {
    return ({
      ...state,
      fetching: false,
      notices: action.payload ? action.payload.data.domainObject : []
    })
  },
  [CLEAR_NOTICES_TIMING]: (state) => {
    return ({
      ...state,
      fetching: false,
      notices: [],
      error: null
    })
  },
  [REQUEST_ERR]: (state, action) => {
    return ({
      ...state,
      fetching: false,
      error: { tips: action.payload.response.data.tips }
    })
  },
  [KEEPING_NOTICES_TIMING]: (state, action) => {
    // console.log(action.payload)
    return ({
      ...state,
      keeping: Object.assign({}, action.payload)
    })
  }
}

// ------------------------------------
// Reducer
// ------------------------------------
const initialState = { // 数据结构
  fetching: false,
  notices: [],
  error: null,
  keeping: {}
}

  export default function(state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type]

  return handler
    ? handler(state, action)
    : state
}
