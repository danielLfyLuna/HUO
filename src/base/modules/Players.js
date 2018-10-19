import AxiosAPI from '../../../utils/axios-api'
import openNotificationWithIcon from '../../base/components/Notification'

// ------------------------------------
// Constants
// ------------------------------------
const PLAYERS_REQUEST = 'PLAYERS_REQUEST'
const PLAYERS_RECEIVE = 'PLAYERS_RECEIVE'
const PLAYERS_CLEAR = 'PLAYERS_CLEAR'

// ------------------------------------
// Actions
// ------------------------------------
function requestPlayers() {
  return {
    type: PLAYERS_REQUEST
  }
}

function receivePlayers(data) {
  return {
    type: PLAYERS_RECEIVE,
    payload: data
  }
}

function clearPlayers() {
  return {
    type: PLAYERS_CLEAR
  }
}

function fetchPlayers(data) {
  return (dispatch, getState) => {
    dispatch(requestPlayers())
    let url = `/huo/products/${data.path.productId}/servers/${data.path.serverId}/players`
    AxiosAPI({
      method: 'GET',
      url: url,
      params: data.params,
      headers: {
        'adminUserId': JSON.parse(sessionStorage.getItem('hoolai')).userId,
        'Authorization': `bearer ${JSON.parse(sessionStorage.getItem('hoolai')).token}`
      }
    }).then(response => {
      dispatch(receivePlayers(response))
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

export {
  fetchPlayers,
  clearPlayers
}

// ------------------------------------
// Action Handlers
// ------------------------------------
const ACTION_HANDLERS = {
  [PLAYERS_REQUEST]: (state) => {
    return ({
      ...state,
      fetching: true,
      list: []
    })
  },
  [PLAYERS_RECEIVE]: (state, action) => {
    return ({
      ...state,
      fetching: false,
      list: action.payload.data.domainObject
    })
  },
  [PLAYERS_CLEAR]: (state) => {
    return ({
      ...state,
      fetching: false,
      list: []
    })
  }
}

// ------------------------------------
// Reducer
// ------------------------------------
const initialState = {
  fetching: false, // 是否正在请求
  list: []
}

export default function playersReducer(state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type]

  return handler ? handler(state, action) : state
}
