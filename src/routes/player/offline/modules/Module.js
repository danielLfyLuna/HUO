// import _ from 'lodash'

import AxiosAPI from '../../../../../utils/axios-api'
import openNotificationWithIcon from '../../../../base/components/Notification'

import { signOut } from '../../../../base/modules/Login'

// ------------------------------------
// Constants
// ------------------------------------
const ONLINE_LIST_REQUEST = 'ONLINE_LIST_REQUEST'
const ONLINE_LIST_RECEIVE = 'ONLINE_LIST_RECEIVE'
const REQUEST_KICKOUT = 'REQUEST_KICKOUT'

const KEEPING_KICKOUT = 'KEEPING_KICKOUT'

// ------------------------------------
// Actions
// ------------------------------------

function requestOnline() {
  return {
    type: ONLINE_LIST_REQUEST
  }
}
function receiveOnline(data) {
  return {
    type: ONLINE_LIST_RECEIVE,
    payload: data
  }
}
function requestKickout () {
  return {
    type: REQUEST_KICKOUT
  }
}
function keepKickout(data) {
  return {
    type: KEEPING_KICKOUT,
    payload: data
  }
}

function fetchOnline(data = {}) {
  return (dispatch, getState) => {

    dispatch(requestOnline())
    let url = `/huo/products/${data.path.productId}/servers/${data.path.serverId}/players/online`
    AxiosAPI({
      method: 'GET',
      url: url,
      params: data.params
    }).then(response => {
      dispatch(receiveOnline(response))
      if (response.data.domainObject.length <= 0) {
        openNotificationWithIcon('info', '未找到该用户', '', 3)
      }
    }).catch(error => {
      if (error.response) {
        if (error.response.data.message === 'token异常，请重新登录。') {
          openNotificationWithIcon('error', '登录过期', error.response.data.message, 3)
          dispatch(signOut())
        }
        if (error.response.data.error) {
          openNotificationWithIcon('error', error.response.data.status, error.response.data.message, 10)
        }
      } else if (error.request) {
        console.log(error.request)
      } else {
        console.log('Error', error.message)
      }
    })
  }
}

function kickoutActionCreator(data) {
  return (dispatch, getState) => {

    dispatch(requestKickout())
    let url = `/huo/products/${data.path.productId}/servers/${data.paht.serverId}/players/${data.path.playerId}/kickout`
    AxiosAPI({
      method: 'PUT',
      url: url,
    }).then(response => {
      if (response.data.msg === '该用户不在线！') {
        openNotificationWithIcon('error', '操作失败', response.data.msg, 5)
        // let arrData = [...recordData]
        // let ind = _.findIndex(arrData, { 'playerId': playerId })
        // arrData.splice(ind, 1)
        // dispatch(receiveOnLine(arrData))
      } else {
        openNotificationWithIcon('info', '操作成功', `玩家ID：${JSON.parse(response.data.msg).playerId} 的用户已强制下线！`, 5)
        // let arrData = [...recordData]
        // let ind = _.findIndex(arrData, { 'playerId': JSON.parse(data.data.msg).playerId })
        // arrData.splice(ind, 1)
        // dispatch(receiveOnLine(arrData))
      }
    }).catch(error => {
      if (error.response) {
        if (error.response.data.message === 'token异常，请重新登录。') {
          openNotificationWithIcon('error', '登录过期', error.response.data.message, 3)
          dispatch(signOut())
        }
        if (error.response.data.error) {
          openNotificationWithIcon('error', error.response.data.status, error.response.data.message, 10)
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
  fetchOnline,
  kickoutActionCreator,
  receiveOnline,
  keepKickout
}

// ------------------------------------
// Action Handlers
// ------------------------------------
const ACTION_HANDLERS = {
  [ONLINE_LIST_REQUEST]: (state) => {
    return ({
      ...state,
      fetching: true,
      err: false,
      errMes: {},
      list: []
    })
  },
  [ONLINE_LIST_RECEIVE]: (state, action) => {
    return ({
      ...state,
      fetching: false,
      list: action.payload.data.domainObject || []
    })
  },
  [REQUEST_KICKOUT]: (state) => {
    return ({
      ...state,
      fetching: true
    })
  },
  [KEEPING_KICKOUT]: (state, action) => {
    // console.log(action.payload)
    return ({
      ...state,
      keeping: Object.assign({}, action.payload)
    })
  }
}

// ------------------------------------
// Reducer
// ------------------------------------
const initialState = {
  fetching: false,
  err: false,
  errMes: {},
  list: [],
  offline: {},
  keeping: {}
}
export default function (state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type]

  return handler ? handler(state, action) : state
}
