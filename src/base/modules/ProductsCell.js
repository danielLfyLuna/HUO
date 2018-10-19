/* global API_HOST */
import axios from 'axios'
import openNotificationWithIcon from '../components/Notification'

// ------------------------------------
// Constants
// ------------------------------------

const CELL_MAP_PRODUCT_REQUEST = 'CELL_MAP_PRODUCT_REQUEST'
const CELL_MAP_PRODUCT_RECEIVE = 'CELL_MAP_PRODUCT_RECEIVE'

// ------------------------------------
// Actions
// ------------------------------------

function requestProductsMap() {
  return {
    type: CELL_MAP_PRODUCT_REQUEST
  }
}

function receiveProductsMap(data) {
  return {
    type: CELL_MAP_PRODUCT_RECEIVE,
    payload: data
  }
}

function fetchProductsCellMap() {
  return (dispatch, getState) => {
    dispatch(requestProductsMap())
    let url = `${API_HOST}/huo/products/cell/options`
    return axios({
      method: 'GET',
      url: url,
      headers: {
        'adminUserId': JSON.parse(sessionStorage.getItem('hoolai')).userId,
        'Authorization': `bearer ${JSON.parse(sessionStorage.getItem('hoolai')).token}`
      }
    }).then(response => {
      dispatch(receiveProductsMap(response))
    }).catch(error => {
      if (error.response) {
        // dispatch(requestErr(error.response.data))
        openNotificationWithIcon('error', error.response.status, error.response.data.tips)
      } else {
        console.log('Error', error.message)
      }
    })
  }
}

export {
  fetchProductsCellMap
}

// ------------------------------------
// Action Handlers
// ------------------------------------
const ACTION_HANDLERS = {
  [CELL_MAP_PRODUCT_REQUEST]: (state) => {
    return ({
      ...state,
      fetching: true
    })
  },
  [CELL_MAP_PRODUCT_RECEIVE]: (state, action) => {
    return ({
      ...state,
      fetching: false,
      options: action.payload.data.options
    })
  }
}

// ------------------------------------
// Reducer
// ------------------------------------
const initialState = { // 数据结构
  fetching: false,
  options: []
}

export default function productsCellReducer(state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type]

  return handler
    ? handler(state, action)
    : state
}
