import AxiosAPI from '../../../../../utils/axios-api'
import openNotificationWithIcon from '../../../../base/components/Notification'


// ------------------------------------
// Constants
// ------------------------------------
const RECEIVE_CD = 'RECEIVE_CD'
const REQUEST_CD = 'REQUEST_CD'

const RECEIVE_CD_SET = 'RECEIVE_CD_SET'
const REQUEST_CD_SET = 'REQUEST_CD_SET'

const CD_ERR = 'CD_ERR'

// ------------------------------------
// Actions
// ------------------------------------

function requestCD() {
  return {
    type: REQUEST_CD
  }
}

function receiveCD(data) {
  return {
    type: RECEIVE_CD,
    payload: data
  }
}


function requestErr(data) {
  return {
    type: CD_ERR,
    payload: data
  }
}

function fetchCD(value = {}) {
  return (dispatch) => {
    dispatch(requestCD())
    let url = `/huo/products/${value.productId}/cdkeyactivities/types/7/${value.id}`
    // let url = '/products/1/activitys/types/7/1'
    AxiosAPI({
      method: 'GET',
      url: url,
    }).then(result => {
      if (result.data.msg) {
      openNotificationWithIcon('error', '操作失败', result.data.msg)
      }
      else {
        dispatch(receiveCD(result))
      }
    })
    .catch(function(error) {
      if (error.response) {
        dispatch(requestErr(error.response.data))
      } else {
        console.log('Error', error.message)
      }
      console.log(error)
    })
  }
}

function requestSet() {
  return {
    type: REQUEST_CD_SET
  }
}

function receiveSet(data) {
  return {
    type: RECEIVE_CD_SET,
    payload: data
  }
}

function setCD(value = {}) {
  return (dispatch) => {
    dispatch(requestSet())
    let url = `/huo/products/${value.productId}/cdkeyactivities/types/7/${value.id}`
    // let url = '/products/1/activitys/types/7/1'
    AxiosAPI({
      method: 'PUT',
      url: url,
      data: value.list
    }).then(result => {
      if (!result.data.msg) {
        dispatch(receiveSet(result))
        openNotificationWithIcon('success', '设置成功')
        dispatch(fetchCD(value))
        }
        else {
          openNotificationWithIcon('error', '操作失败', result.data.msg)
        }
    })
    .catch(function(error) {
      if (error.response) {
        dispatch(requestErr(error.response.data))
      } else {
        console.log('Error', error.message)
      }
      console.log(error)
    })
  }
}

export {
  fetchCD,
  setCD
}

// ------------------------------------
// Action Handlers
// ------------------------------------
const ACTION_HANDLERS = {
  [REQUEST_CD]: (state) => {
    return ({
      ...state,
      fetching: true
    })
  },
  [RECEIVE_CD]: (state, action) => {
    return ({
      ...state,
      fetching: false,
      list: action.payload ? action.payload.data.resource : []
    })
  },
  [REQUEST_CD_SET]: (state) => {
    return ({
      ...state,
      putting: true
    })
  },
  [RECEIVE_CD_SET]: (state, action) => {
    return ({
      ...state,
      putting: false,
      put: action.payload ? action.payload.data : {}
    })
  },
  [CD_ERR]: (state, action) => {
    return ({
      ...state,
      fetching: false,
      putting: false,
      error: action.payload.response.data.tips
    })
  }
}

// ------------------------------------
// Reducer
// ------------------------------------
const initialState = { // 数据结构
  fetching: false,
  putting: false,
  list: [],
  put: {},
  error: null
}

  export default function(state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type]

  return handler
    ? handler(state, action)
    : state
}
