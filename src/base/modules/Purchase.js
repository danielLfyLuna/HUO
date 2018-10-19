/* global API_HOST */
import axios from 'axios'
import openNotificationWithIcon from '../components/Notification'
// ------------------------------------
// Constants
// ------------------------------------
const PURCHASES_REQUEST = 'PURCHASES_REQUEST'
const PURCHASES_RECEIVE = 'PURCHASES_RECEIVE'

const PURCHASES_SYNC_REQUEST = 'PURCHASES_SYNC_REQUEST'
const PURCHASES_SYNC_RECEIVE = 'PURCHASES_SYNC_RECEIVE'

const PRODUCTS_REQUEST = 'PRODUCTS_REQUEST'
const PRODUCTS_RECEIVE = 'PRODUCTS_RECEIVE'

// ------------------------------------
// Actions
// ------------------------------------
function requestPurchases() {
  return {
    type: PURCHASES_REQUEST
  }
}

function receivePurchases(data) {
  return {
    type: PURCHASES_RECEIVE,
    payload: data
  }
}

function fetchPurchases() {
  return (dispatch, getState) => {

    dispatch(requestPurchases())
    const url = `${API_HOST}/huo/products/payconfig/orders`
    axios({
      method: 'GET',
      url: url,
      headers: {
        'adminUserId': JSON.parse(sessionStorage.getItem('hoolai')).userId,
        'Authorization': `bearer ${JSON.parse(sessionStorage.getItem('hoolai')).token}`
      }
    }).then(response => {
      dispatch(receivePurchases(response))
    }).catch(error => {
      if (error.response) {
        console.log(error.response.data)
        openNotificationWithIcon('error', '查询出错', error.response.data.tips, 3)
      } else {
        // 一些错误是在设置请求的时候触发
        console.log('Error', error.message)
      }
    })
  }
}


function requestPurchaseSync() {
  return {
    type: PURCHASES_SYNC_REQUEST
  }
}

function receivePurchaseSync(data) {
  return {
    type: PURCHASES_SYNC_RECEIVE,
    payload: data
  }
}

function fetchPurchaseSync(data) {
  return (dispatch, getState) => {

    dispatch(requestPurchaseSync())
    const url = `${API_HOST}/huo/products/payconfig/sync/products/${data.path.productId}/servers/${data.path.serverId}`
    axios({
      method: 'GET',
      url: url,
      headers: {
        'adminUserId': JSON.parse(sessionStorage.getItem('hoolai')).userId,
        'Authorization': `bearer ${JSON.parse(sessionStorage.getItem('hoolai')).token}`
      }
    }).then(response => {
      dispatch(receivePurchaseSync(response))
    }).catch(error => {
      if (error.response) {
        console.log(error.response.data)
        openNotificationWithIcon('error', '查询出错', error.response.data.tips, 3)
      } else {
        // 一些错误是在设置请求的时候触发
        console.log('Error', error.message)
      }
    })
  }
}


function requestProducts() {
  return {
    type: PRODUCTS_REQUEST
  }
}

function receiveProducts(data) {
  return {
    type: PRODUCTS_RECEIVE,
    payload: data
  }
}

function fetchProducts() {
  return (dispatch, getState) => {

    dispatch(requestProducts())
    const url = `${API_HOST}/huo/products/server/options`
    return axios({
      method: 'GET',
      url: url,
      headers: {
        'adminUserId': JSON.parse(sessionStorage.getItem('hoolai')).userId,
        'Authorization': `bearer ${JSON.parse(sessionStorage.getItem('hoolai')).token}`
      }
    }).then(response => {
      dispatch(receiveProducts(response))
    }).catch(error => {
      if (error.response) {
        openNotificationWithIcon('error', error.response.status, error.response.data.tips)
      } else {
        console.log('Error', error.message)
      }
    })
  }
}

export {
  fetchPurchases,
  fetchPurchaseSync,
  fetchProducts
}

// ------------------------------------
// Action Handlers
// ------------------------------------
const ACTION_HANDLERS = {
  [PURCHASES_REQUEST]: (state) => {
    return ({
      ...state,
      fetching: true,
      purchases: []
    })
  },
  [PURCHASES_RECEIVE]: (state, action) => {
    return ({
      ...state,
      fetching: false,
      purchases: action.payload.data.templateList
    })
  },
  [PURCHASES_SYNC_REQUEST]: (state) => {
    return ({
      ...state,
      fetching: true,
      purchasesync: {}
    })
  },
  [PURCHASES_SYNC_RECEIVE]: (state, action) => {
    return ({
      ...state,
      fetching: false,
      purchasesync: action.payload.data
    })
  },
  [PRODUCTS_REQUEST]: (state) => {
    return ({
      ...state,
      fetching: true,
      products: []
    })
  },
  [PRODUCTS_RECEIVE]: (state, action) => {
    return ({
      ...state,
      fetching: false,
      products: action.payload.data.options
    })
  }
}

// ------------------------------------
// Reducer
// ------------------------------------
const initialState = {
  fetching: false, // 是否正在请求
  purchases: [],
  purchasesync: {},
  products: []
}

export default function globalsReducer(state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type]

  return handler
    ? handler(state, action)
    : state
}
