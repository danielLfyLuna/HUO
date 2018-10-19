/* global API_HOST */
import axios from 'axios'
// import _ from 'lodash'

import openNotificationWithIcon from '../../../../base/components/Notification'

// ------------------------------------
// Constants
// ------------------------------------
const RECEIVE_RECHARGERESET = 'RECEIVE_RECHARGERESET'
const REQUEST_RECHARGERESET = 'REQUEST_RECHARGERESET'
const CLEAR_RECHARGERESET = 'CLEAR_RECHARGERESET'

const RECHARGERESET_ERR = 'RECHARGERESET_ERR'

// ------------------------------------
// Actions
// ------------------------------------

function requestReset() {
  return {
    type: REQUEST_RECHARGERESET
  }
}

function receiveReset(data) {
  return {
    type: RECEIVE_RECHARGERESET,
    payload: data
  }
}

function clearReset() {
  return {
    type: CLEAR_RECHARGERESET
  }
}

function requestErr(data) {
  return {
    type: RECHARGERESET_ERR,
    data: data
  }
}

function fetchRechargeReset(value = {}) {
  return (dispatch, getState) => {
    // 验证从复提交
    if (getState().rechargeReset.fetching) {
      return
    }

    dispatch(requestReset())
    openNotificationWithIcon('info', '正在重置请勿重复点击提交')
    let url = `${API_HOST}/huo/products/${value.productId}/servers/_/pay/rechargereset`
    return axios({
      method: 'PUT',
      url: url,
      data: value,
      headers: {
        'adminUserId': JSON.parse(sessionStorage.getItem('hoolai')).userId,
        'Authorization': `bearer ${JSON.parse(sessionStorage.getItem('hoolai')).token}`
      }
    }).then(response => {
      dispatch(receiveReset(response))
      if (response.data.failServers.length == 0) {
        openNotificationWithIcon('success', '重置成功')
      }
      if (response.data.failServers.length > 0) {
        const value = response.data.failServers.join(',')
        openNotificationWithIcon('success', '重置失败', `失败的服务器有：${value}`)
      }

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
  fetchRechargeReset,
  clearReset
}

// ------------------------------------
// Action Handlers
// ------------------------------------
const ACTION_HANDLERS = {
  [REQUEST_RECHARGERESET]: (state) => {
    return ({
      ...state,
      fetching: true
    })
  },
  [RECEIVE_RECHARGERESET]: (state, action) => {
    return ({
      ...state,
      fetching: false,
      list: action.payload ? action.payload.data : []
    })
  },
  [CLEAR_RECHARGERESET]: (state) => {
    return ({
      ...state,
      fetching: false,
      list: [],
      error: null
    })
  },
  [RECHARGERESET_ERR]: (state, action) => {
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
  list: [],
  error: null
}

  export default function(state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type]

  return handler
    ? handler(state, action)
    : state
}
