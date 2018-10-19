/* global API_HOST */
import axios from 'axios'
import _ from 'lodash'

import openNotificationWithIcon from '../../../../base/components/Notification'

// ------------------------------------
// Constants
// ------------------------------------
const TRADE_LIST_REQUEST = 'TRADE_LIST_REQUEST'
const TRADE_LIST_REQUEST_ERR = 'TRADE_LIST_REQUEST_ERR'
const TRADE_LIST_RECEIVE = 'TRADE_LIST_RECEIVE'
const TRADE_LIST_CLEAR = 'TRADE_LIST_CLEAR'

const TRADE_CHECK_REQUEST = 'TRADE_CHECK_REQUEST'
const TRADE_CHECK_REQUEST_ERR = 'TRADE_CHECK_REQUEST_ERR'
const TRADE_CHECK_RECEIVE = 'TRADE_CHECK_RECEIVE'

const TRADE_EXPORT_REQUEST = 'TRADE_EXPORT_REQUEST'
const TRADE_EXPORT_ERR = 'TRADE_EXPORT_ERR'
const TRADE_EXPORT_RECEIVE = 'TRADE_EXPORT_RECEIVE'

const TRADE_KEEPING = 'TRADE_KEEPING'

// ------------------------------------
// Actions
// ------------------------------------

function requestTrades() {
  return {
    type: TRADE_LIST_REQUEST
  }
}

function requestTradesErr(data) {
  return {
    type: TRADE_LIST_REQUEST_ERR,
    payload: data
  }
}

function receiveTrades(data) {
  return {
    type: TRADE_LIST_RECEIVE,
    payload: data
  }
}

function clearTrades() {
  return {
    type: TRADE_LIST_CLEAR
  }
}

function requestCheckTrade() {
  return {
    type: TRADE_CHECK_REQUEST
  }
}

function requestCheckTradeErr(data) {
  return {
    type: TRADE_CHECK_REQUEST_ERR,
    payload: data
  }
}

function receiveCheckTrade(data) {
  return {
    type: TRADE_CHECK_RECEIVE,
    payload: data
  }
}

function keepTrade(data) {
  return {
    type: TRADE_KEEPING,
    payload: data
  }
}

function requestExport() {
  return {
    type: TRADE_EXPORT_REQUEST
  }
}

function requestExportErr(data) {
  return {
    type: TRADE_EXPORT_ERR,
    payload: data
  }
}

function receiveExport(data) {
  return {
    type: TRADE_EXPORT_RECEIVE,
    payload: data
  }
}

function fetchTrades(data) {
  return (dispatch, getState) => {

    dispatch(requestTrades())
    let url = `${API_HOST}/huo/products/${data.products.productId}/servers/${data.products.serverId}/trade/selectTradeData${data.search}`
    return axios({
      method: 'GET',
      url: url,
      headers: {
        'adminUserId': JSON.parse(sessionStorage.getItem('hoolai')).userId,
        'Authorization': `bearer ${JSON.parse(sessionStorage.getItem('hoolai')).token}`
      }
    }).then(response => {
      dispatch(receiveTrades(response))
    }).catch(error => {
      if (error.response) {
        dispatch(requestTradesErr(error.response.data))
        openNotificationWithIcon('error', error.response.status, error.response.data.tips)
      } else {
        console.log('Error', error.message)
      }
    })
  }
}

function checkTrade(data) {
  return (dispatch, getState) => {

    dispatch(requestCheckTrade())
    let url = `${API_HOST}/huo/products/${data.products.productId}/servers/${data.products.serverId}/trade/${data.send.id}`
    return axios({
      method: 'PUT',
      data: data.send,
      url: url,
      headers: {
        'adminUserId': JSON.parse(sessionStorage.getItem('hoolai')).userId,
        'Authorization': `bearer ${JSON.parse(sessionStorage.getItem('hoolai')).token}`
      }
    }).then(response => {
      dispatch(receiveCheckTrade(response))
      openNotificationWithIcon('success', response.data.msg)
    }).catch(error => {
      if (error.response) {
        dispatch(requestCheckTradeErr(error.response.data))
        openNotificationWithIcon('error', error.response.status, error.response.data.tips)
      } else {
        console.log('Error', error.message)
      }
    })
  }
}

function exportTrades(data) {
  return (dispatch, getState) => {

    dispatch(requestExport())
    let url = `${API_HOST}/huo/products/${data.products.productId}/servers/${data.products.serverId}/trade/export${data.search}`
    return axios({
      method: 'GET',
      url: url,
      headers: {
        'adminUserId': JSON.parse(sessionStorage.getItem('hoolai')).userId,
        'Authorization': `bearer ${JSON.parse(sessionStorage.getItem('hoolai')).token}`
      }
    }).then(response => {
      dispatch(receiveExport(response))
      if (response.data.downloadLink) {
        window.open(`${API_HOST}/huo/products/${data.products.productId}/servers/${data.products.serverId}/trade/${response.data.downloadLink}`)
      } else {
        openNotificationWithIcon('warning', 'downloadLink 为空, 导出失败')
      }
    }).catch(error => {
      if (error.response) {
        dispatch(requestExportErr(error.response.data))
        openNotificationWithIcon('error', error.response.status, error.response.data.tips)
      } else {
        console.log('Error', error.message)
      }
    })
  }
}

export {
  clearTrades,
  fetchTrades,
  checkTrade,
  exportTrades,
  keepTrade
}

// ------------------------------------
// Action Handlers
// ------------------------------------
const ACTION_HANDLERS = {
  [TRADE_LIST_REQUEST]: (state) => {
    return ({
      ...state,
      fetching: true
    })
  },
  [TRADE_LIST_RECEIVE]: (state, action) => {
    let list = action.payload.data.trades
    _.map(list, (val, index) => {
      val.isSign = val.mapping.sign
      val.reason = val.mapping.reason
    })
    return ({
      ...state,
      fetching: false,
      list: list
    })
  },
  [TRADE_LIST_CLEAR]: (state) => {
    return ({
      ...state,
      fetching: false,
      err: false,
      errMes: {},
      list: []
    })
  },
  [TRADE_LIST_REQUEST_ERR]: (state, action) => {
    return ({
      ...state,
      fetching: false,
      err: true,
      errMes: { tips: action.payload.tips }
    })
  },
  [TRADE_CHECK_REQUEST]: (state) => {
    return ({
      ...state,
      fetching: true,
      err: false,
      errMes: {}
    })
  },
  [TRADE_CHECK_REQUEST_ERR]: (state, action) => {
    return ({
      ...state,
      fetching: false,
      err: true,
      errMes: action.payload ? { tips: action.payload.tips } : {}
    })
  },
  [TRADE_CHECK_RECEIVE]: (state, action) => {
    const list = [...state.list]
    const trade = action.payload.data.domainObject
    const check = { id: trade.id, isSign: trade.mapping.sign, status: trade.status, reason: trade.mapping.reason ? trade.mapping.reason : '' }
    _.map(list, (val, index) => {
      if (action.payload.data.isSuccess && val.id === check.id) {
        val = Object.assign(val, check)
        val.mapping.state = trade.mapping.state
      }
    })
    return ({
      ...state,
      fetching: false,
      list: [...list],
      check: action.payload.data
    })
  },
  [TRADE_EXPORT_REQUEST]: (state) => {
    return ({
      ...state,
      exporting: true
    })
  },
  [TRADE_EXPORT_RECEIVE]: (state, action) => {
    return ({
      ...state,
      exporting: false,
      export: action.payload
    })
  },
  [TRADE_EXPORT_ERR]: (state, action) => {
    return ({
      ...state,
      exporting: false,
      err: true,
      errMes: action.payload ? { tips: action.payload.tips } : {}
    })
  },
  [TRADE_KEEPING]: (state, action) => {
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
  exporting: false,
  err: false,
  errMes: {},
  list: [],
  check: {},
  export: {},
  keeping: {}
}

export default function(state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type]

  return handler
    ? handler(state, action)
    : state
}
