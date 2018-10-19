/* global API_HOST */
import axios from 'axios'
import openNotificationWithIcon from '../../../../base/components/Notification'

const initialState = {
  fetching: false,
  err: {},
  amountErr: {},
  list: {},
  amount: {}
}

const TRADE_DETAIL_REQUEST = 'TRADE_DETAIL_REQUEST'
const TRADE_DETAIL_ERR = 'TRADE_DETAIL_ERR'
const TRADE_DETAIL_RECEIVE = 'TRADE_DETAIL_RECEIVE'

const TRADE_AMOUNT_REQUEST = 'TRADE_AMOUNT_REQUEST'
const TRADE_AMOUNT_ERR = 'TRADE_AMOUNT_ERR'
const TRADE_AMOUNT_RECEIVE = 'TRADE_AMOUNT_RECEIVE'

function requestTrades() {
  return {
    type: TRADE_DETAIL_REQUEST
  }
}
function requestTradesErr(data) {
  return {
    type: TRADE_DETAIL_ERR,
    payload: data
  }
}
function receiveTrades(data) {
  return {
    type: TRADE_DETAIL_RECEIVE,
    payload: data
  }
}
function getItemDetail(data) {
  return (dispatch, getState) => {

    dispatch(requestTrades())
    let url = `${API_HOST}/huo/products/${data.productId}/servers/${data.serverId}/trade/itemDetail`
    return axios({
      method: 'GET',
      url: url,
      params: data.time,
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

function requestAmount() {
  return {
    type: TRADE_AMOUNT_REQUEST
  }
}
function requestAmountErr(data) {
  return {
    type: TRADE_AMOUNT_ERR,
    payload: data
  }
}
function receiveAmount(data) {
  return {
    type: TRADE_AMOUNT_RECEIVE,
    payload: data
  }
}
function getItemAmount(data) {
  return (dispatch, getState) => {

    dispatch(requestAmount())
    let url = `${API_HOST}/huo/products/${data.productId}/servers/${data.serverId}/trade/amount`
    return axios({
      method: 'GET',
      url: url,
      params: data.time,
      headers: {
        'adminUserId': JSON.parse(sessionStorage.getItem('hoolai')).userId,
        'Authorization': `bearer ${JSON.parse(sessionStorage.getItem('hoolai')).token}`
      }
    }).then(response => {
      dispatch(receiveAmount(response))
    }).catch(error => {
      if (error.response) {
        dispatch(requestAmountErr(error.response.data))
        openNotificationWithIcon('error', error.response.status, error.response.data.tips)
      } else {
        console.log('Error', error.message)
      }
    })
  }
}
export {
  getItemDetail,
  getItemAmount
}

const ACTION_HANDLERS = {
  [TRADE_DETAIL_REQUEST]: (state) => {
    return ({
      ...state,
      fetching: true
    })
  },
  [TRADE_DETAIL_RECEIVE]: (state, action) => {
    return ({
      ...state,
      fetching: false,
      list: action.payload.data
    })
  },
  [TRADE_DETAIL_ERR]: (state, action) => {
    return ({
      ...state,
      fetching: false,
      err: { tips: action.payload.tips }
    })
  },
  [TRADE_AMOUNT_REQUEST]: (state) => {
    return ({
      ...state,
      amountFetching: true
    })
  },
  [TRADE_AMOUNT_RECEIVE]: (state, action) => {
    return ({
      ...state,
      amountFetching: false,
      amount: action.payload.data
    })
  },
  [TRADE_AMOUNT_ERR]: (state, action) => {
    return ({
      ...state,
      amountFetching: false,
      amountErr: { tips: action.payload.tips }
    })
  }
}

export default function(state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type]
  return handler ? handler(state, action) : state
}
