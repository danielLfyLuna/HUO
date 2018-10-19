/* global API_HOST */
import axios from 'axios'

import openNotificationWithIcon from '../../../../base/components/Notification'
import {singOut} from '../../../../base/modules/Login'

// ------------------------------------
// Constants
// ------------------------------------
const REQUEST_LOGSOURCE = 'REQUEST_LOGSOURCE'
const RECEIVE_LOGSOURCE = 'RECEIVE_LOGSOURCE'
const ERR_LOGSOURCE = 'ERR_LOGSOURCE'

// ------------------------------------
// Actions
// ------------------------------------
function errLog (v) {
  return {
    type: ERR_LOGSOURCE,
    payload: v
  }
}
function requestLog () {
  return {
    type: REQUEST_LOGSOURCE
  }
}
function receiveLog (v) {
  return {
    type: RECEIVE_LOGSOURCE,
    payload: v
  }
}

function fetchLog(value) {
  return (dispatch, getState) => {
    dispatch(requestLog())
    let url = `${API_HOST}/huo/logs/sync/source`
    return axios({
      method: 'GET',
      url: url,
      params: value,
      headers: {
        'adminUserId': JSON.parse(sessionStorage.getItem('hoolai')).userId,
        'Authorization': `bearer ${JSON.parse(sessionStorage.getItem('hoolai')).token}`
      }
    }).then(response => {
      dispatch(receiveLog(response))
      console.log(response)
      openNotificationWithIcon('success', response.data.msg)
    }).catch(error => {
      if (error.response) {
        errLog(error.response)
        if (error.response.data.message === 'token异常，请重新登录。') {
          openNotificationWithIcon('warning', '登录过期', error.response.data.message, 3)
          dispatch(singOut())
        } else {
          openNotificationWithIcon('warning', error.response.data.tips)
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
  fetchLog
}

// ------------------------------------
// Action Handlers
// ------------------------------------
const ACTION_HANDLERS = {
  [REQUEST_LOGSOURCE]: (state) => {
    return ({
      ...state,
      fetching: true
    })
  },
  [RECEIVE_LOGSOURCE]: (state, action) => {
    return ({
      ...state,
      fetching: false,
      lists: action.payload
    })
  },
  [ERR_LOGSOURCE]: (state, action) => {
    return ({
      ...state,
      fetching: false,
      err: action.payload.response
    })
  }
}

// ------------------------------------
// Reducer
// ------------------------------------
const initialState = {
  fetching: false,
  lists: [],
  err: {}
}
export default function(state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type]

  return handler ? handler(state, action) : state
}
