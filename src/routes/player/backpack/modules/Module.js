
import AxiosAPI from '../../../../../utils/axios-api'
import openNotificationWithIcon from '../../../../base/components/Notification'
import { signOut } from '../../../../base/modules/Login'
import { viewItemPane } from '../components/Items'
import { exportItems } from './exportItems'

// ------------------------------------
// Constants
// ------------------------------------
const PLAYER_BASE_LIST_REQUEST = 'PLAYER_BASE_LIST_REQUEST'
const PLAYER_BASE_LIST_RECEIVE = 'PLAYER_BASE_LIST_RECEIVE'

const PLAYER_ITEM_LIST_REQUEST = 'PLAYER_ITEM_LIST_REQUEST'
const PLAYER_ITEM_LIST_RECEIVE = 'PLAYER_ITEM_LIST_RECEIVE'

const KEEPING_BACKPACK = 'KEEPING_BACKPACK'

// ------------------------------------
// Actions
// ------------------------------------

function requestBaseInfo() {
  return {
    type: PLAYER_BASE_LIST_REQUEST
  }
}

function receiveBaseInfo(data) {
  return {
    type: PLAYER_BASE_LIST_RECEIVE,
    payload: data
  }
}

function requestBackItems() {
  return {
    type: PLAYER_ITEM_LIST_REQUEST
  }
}

// function receiveBackItems(data) {
//   return {
//     type: PLAYER_ITEM_LIST_RECEIVE,
//     payload: data
//   }
// }

function keepBackpack(data) {
  return {
    type: KEEPING_BACKPACK,
    payload: data
  }
}

function fetchBaseInfo(data = {}) {
  return (dispatch, getState) => {

    dispatch(requestBaseInfo())
    let url = `/huo/products/${data.path.productId}/servers/${data.path.serverId}/players/baseinfo`
    AxiosAPI({
      method: 'GET',
      url: url,
      params: data.params
    }).then(response => {
      dispatch(receiveBaseInfo(response))
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

function fetchBackItems(data) {
  return (dispatch, getState) => {

    dispatch(requestBackItems())
    let url = `/huo/products/${data.path.productId}/servers/${data.path.serverId}/players/${data.path.playerId}/items`
    AxiosAPI({
      method: 'GET',
      url: url,
    }).then(response => {
      // dispatch(receiveBackItems(response))
      if (data.handle === 'ITEM') {
        viewItemPane({ dataSource: response.data.domainObject })
      } else {
        exportItems(response.data.domainObject, data.path)
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
  fetchBaseInfo,
  fetchBackItems,
  keepBackpack
}

// ------------------------------------
// Action Handlers
// ------------------------------------
const ACTION_HANDLERS = {
  [PLAYER_BASE_LIST_REQUEST]: (state) => {
    return ({
      ...state,
      fetching: true,
      err: false,
      errMes: {},
      list: []
    })
  },
  [PLAYER_BASE_LIST_RECEIVE]: (state, action) => {
    return ({
      ...state,
      fetching: false,
      list: action.payload.data.domainObject || []
    })
  },
  [PLAYER_ITEM_LIST_REQUEST]: (state) => {
    return ({
      ...state,
      fetching: true,
      err: false,
      errMes: {},
      items: []
    })
  },
  [PLAYER_ITEM_LIST_RECEIVE]: (state, action) => {
    return ({
      ...state,
      fetching: false,
      items: action.payload.data.domainObject || []
    })
  },
  [KEEPING_BACKPACK]: (state, action) => {
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
  items: [],
  keeping: {}
}
export default function (state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type]

  return handler ? handler(state, action) : state
}
