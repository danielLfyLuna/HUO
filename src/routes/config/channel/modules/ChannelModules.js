/* global API_HOST */
import axios from 'axios'

import openNotificationWithIcon from '../../../../base/components/Notification'
import {singOut} from '../../../../base/modules/Login'

// ------------------------------------
// Constants
// ------------------------------------
const REQUEST_CHANNEL = 'REQUEST_CHANNEL'
const RECEIVE_CHANNEL = 'RECEIVE_CHANNEL'



// ------------------------------------
// Actions
// ------------------------------------
function requestChannel () {
  return {
    type: REQUEST_CHANNEL
  }
}
function receiveChannel (data) {
  return {
    type: RECEIVE_CHANNEL,
    payload: data
  }
}


function fetchChannels() {
  return (dispatch, getState) => {
    dispatch(requestChannel())
    let url = `${API_HOST}/huo/channels`
    return axios({
      method: 'get',
      data: {
      },
      url: url,
      headers: {
      }
    }).then(data => {
      dispatch(receiveChannel(data))
    }).catch(error => {
      if (error.response) {
        if (error.response.data.message === 'token异常，请重新登录。') {
          openNotificationWithIcon('warning', '登录过期', error.response.data.message, 3)
          dispatch(singOut())
        }
      } else if (error.request) {
        console.log(error.request)
      } else {
        console.log('Error', error.message)
      }
    })
  }
}

export {
  fetchChannels
}

// ------------------------------------
// Action Handlers
// ------------------------------------
const ACTION_HANDLERS = {
  [REQUEST_CHANNEL]: (state) => {
    return ({
      ...state
    })
  },
  [RECEIVE_CHANNEL]: (state, action) => {
    return ({
      ...state,
      list: action.payload ? action.payload.data.channels : []
    })
  }
}

// ------------------------------------
// Reducer
// ------------------------------------
const initialState = {
  list: [],
}
export default function channelReducer (state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type]

  return handler ? handler(state, action) : state
}
