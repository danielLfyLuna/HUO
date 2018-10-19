/* global API_HOST */
import axios from 'axios'
import openNotificationWithIcon from '../../../../base/components/Notification'


// ------------------------------------
// Constants
// ------------------------------------
const RECEIVE_REFRESHWIPE = 'RECEIVE_REFRESHWIPE'
const REQUEST_REFRESHWIPE = 'REQUEST_REFRESHWIPE'

const REFRESHWIPE_ERR = 'REFRESHWIPE_ERR'

// ------------------------------------
// Actions
// ------------------------------------

function requestCD() {
  return {
    type: REQUEST_REFRESHWIPE
  }
}

function receiveCD(data) {
  return {
    type: RECEIVE_REFRESHWIPE,
    payload: data
  }
}


function requestErr(data) {
  return {
    type: REFRESHWIPE_ERR,
    payload: data
  }
}

function fetchCD(value = {}) {
  return (dispatch) => {
    dispatch(requestCD())
    let url = `${API_HOST}/huo/products/${value.productId}/servers/${value.serverId}/refreshwipe`
    // let url = '/products/1/activitys/types/7/1'
    axios({
      method: 'PUT',
      url: url,
      headers: {
        'adminUserId': JSON.parse(sessionStorage.getItem('hoolai')).userId,
        'Authorization': `bearer ${JSON.parse(sessionStorage.getItem('hoolai')).token}`
      }
    }).then(result => {
      dispatch(receiveCD(result))
      openNotificationWithIcon('success', result.data.msg)
    })
    .catch((error) => {
      if (error.response) {
        dispatch(requestErr(error))
        openNotificationWithIcon('error', error.response.data.tips)
      } else {
        console.log('Error', error.message)
      }
      console.log(error)
    })
  }
}

export {
  fetchCD
}

// ------------------------------------
// Action Handlers
// ------------------------------------
const ACTION_HANDLERS = {
  [REQUEST_REFRESHWIPE]: (state) => {
    return ({
      ...state,
      fetching: true
    })
  },
  [RECEIVE_REFRESHWIPE]: (state) => {
    return ({
      ...state,
      fetching: false
    })
  },
  [REFRESHWIPE_ERR]: (state, action) => {
    return ({
      ...state,
      fetching: false,
      error: action.payload.response.data.tips
    })
  }
}

// ------------------------------------
// Reducer
// ------------------------------------
const initialState = { // 数据结构
  fetching: false,
  error: null
}

  export default function(state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type]

  return handler
    ? handler(state, action)
    : state
}
