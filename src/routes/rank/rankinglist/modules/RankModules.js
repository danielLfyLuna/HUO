/* global API_HOST */
import axios from 'axios'

import openNotificationWithIcon from '../../../../base/components/Notification'
import {singOut} from '../../../../base/modules/Login'

// ------------------------------------
// Constants

const REQUEST_RANK_LIST_GET = 'REQUEST_RANK_LIST_GET'
const RECEIVE_RANK_LIST_GET = 'RECEIVE_RANK_LIST_GET'


function requestGet() {
  return {
    type: REQUEST_RANK_LIST_GET
  }
}
function receiveGet(data) {
  return {
    type: RECEIVE_RANK_LIST_GET,
    payload: data.domainObject,
    rankType: data.rankType
  }
}

function fetchGet(productId, serverId, rankType, params = {}) {
  return (dispatch, getState) => {
    dispatch(requestGet())
    let url = `${API_HOST}/huo/products/${productId}/servers/${serverId}/ranks/${rankType}`
    axios({
      method: 'get',
      url: url,
      params: params,
      headers: {
        Authorization: `bearer ${JSON.parse(sessionStorage.getItem('hoolai')).token}`,
        adminUserId: JSON.parse(sessionStorage.getItem('hoolai')).userId
      }
    }).then(response => {
      dispatch(receiveGet(response.data))
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
  [REQUEST_RANK_LIST_GET]: (state) => {
    return ({
      ...state
    })
  },
  [RECEIVE_RANK_LIST_GET]: (state, action) => {
    return ({
      ...state,
      list: action.payload ? action.payload : [],
      rankType: action.rankType
    })
  }
}

// ------------------------------------
// Reducer
// ------------------------------------
const initialState = {
  rankType: 1,
  list: []
}

export default function mailsReducer (state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type]

  return handler ? handler(state, action) : state
}
