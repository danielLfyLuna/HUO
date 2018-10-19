/* global API_HOST */
import axios from 'axios'

import openNotificationWithIcon from '../../../../base/components/Notification'
import {singOut} from '../../../../base/modules/Login'

// ------------------------------------
// Constants


const REQUEST_BLACK_LIST_GET = 'REQUEST_BLACK_LIST_GET'
const RECEIVE_BLACK_LIST_GET = 'RECEIVE_BLACK_LIST_GET'


function requestGet() {
  return {
    type: REQUEST_BLACK_LIST_GET
  }
}
function receiveGet(data) {
  console.log('receiveGet : data:')
  console.log(data)
  return {
    type: RECEIVE_BLACK_LIST_GET,
    payload: data
  }
}

function fetchGet() {
  return (dispatch, getState) => {
    console.log('==step 1 request ==========================')
    dispatch(requestGet())
    let url = `${API_HOST}/huo/products/0/items/blacklist`
    axios({
      method: 'get',
      url: url
    }).then(response => {
      console.log('==step 2 receive ==========================')
      console.log(response.data.blackList)
      dispatch(receiveGet(response.data.blackList))
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
  fetchGet
}

// ------------------------------------
// Action Handlers
// ------------------------------------
const ACTION_HANDLERS = {
  [REQUEST_BLACK_LIST_GET]: (state) => {
    return ({
      ...state,
      getFetching: true
    })
  },
  [RECEIVE_BLACK_LIST_GET]: (state, action) => {

    console.log('=====step 4 del action ===============================')
    console.log(action)
    return ({
      ...state,
      list: action.payload ? action.payload : [],
      getFetching: false
    })
  }
}

// ------------------------------------
// Reducer
// ------------------------------------
const initialState = {
  fetching: false,
  getFetching: false,
  list: []
}
export default function mailsReducer (state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type]

  return handler ? handler(state, action) : state
}
