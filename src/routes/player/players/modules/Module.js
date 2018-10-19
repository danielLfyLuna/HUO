
import AxiosAPI from '../../../../../utils/axios-api'
import openNotificationWithIcon from '../../../../base/components/Notification'

import { signOut } from '../../../../base/modules/Login'

// ------------------------------------
// Constants
// ------------------------------------
const PLAYER_LIST_REQUEST = 'PLAYER_LIST_REQUEST'
const PLAYER_LIST_REQUEST_ERR = 'PLAYER_LIST_REQUEST_ERR'
const PLAYER_LIST_RECEIVE = 'PLAYER_LIST_RECEIVE'
const PLAYER_LIST_CLEAR = 'PLAYER_LIST_CLEAR'

const PLAYER_CLEAR_AVATAR_REQUEST = 'PLAYER_CLEAR_AVATAR_REQUEST'
const PLAYER_CLEAR_AVATAR_RECEIVE = 'PLAYER_CLEAR_AVATAR_RECEIVE'

const PLAYER_SKIP_NOVICE_REQUEST = 'PLAYER_SKIP_NOVICE_REQUEST'
const PLAYER_SKIP_NOVICE_RECEIVE = 'PLAYER_SKIP_NOVICE_RECEIVE'

const PLAYER_SKIP_NOVICES_REQUEST = 'PLAYER_SKIP_NOVICES_REQUEST'
const PLAYER_SKIP_NOVICES_RECEIVE = 'PLAYER_SKIP_NOVICES_RECEIVE'

const PLAYER_RENAME_REQUEST = 'PLAYER_RENAME_REQUEST'
const PLAYER_RENAME_RECEIVE = 'PLAYER_RENAME_RECEIVE'

const PLAYER_KICKOUT_REQUEST = 'PLAYER_KICKOUT_REQUEST'
const PLAYER_KICKOUT_RECEIVE = 'PLAYER_KICKOUT_RECEIVE'

const PLAYER_KEEPING = 'PLAYER_KEEPING'
// ------------------------------------
// Actions
// ------------------------------------

function requestPlayers() {
  return {
    type: PLAYER_LIST_REQUEST
  }
}

function requestPlayersErr(data) {
  return {
    type: PLAYER_LIST_REQUEST_ERR,
    payload: data
  }
}

function receivePlayers(data) {
  return {
    type: PLAYER_LIST_RECEIVE,
    payload: data
  }
}

function clearPlayers() {
  return {
    PLAYER_LIST_CLEAR
  }
}

function requestAvatarClear() {
  return {
    type: PLAYER_CLEAR_AVATAR_REQUEST
  }
}

function receiveAvatarClear(data) {
  return {
    type: PLAYER_CLEAR_AVATAR_RECEIVE,
    payload: data
  }
}

function requestNoviceSkip() {
  return {
    type: PLAYER_SKIP_NOVICE_REQUEST
  }
}
function receiveNoviceSkip(data) {
  return {
    type: PLAYER_SKIP_NOVICE_RECEIVE,
    payload: data
  }
}

function requestNovicesSkip() {
  return {
    type: PLAYER_SKIP_NOVICES_REQUEST
  }
}

function receiveNovicesSkip(data) {
  return {
    type: PLAYER_SKIP_NOVICES_RECEIVE,
    payload: data
  }
}

function requestRename() {
  return {
    type: PLAYER_RENAME_REQUEST
  }
}

function receiveRename(data) {
  return {
    type: PLAYER_RENAME_RECEIVE,
    payload: data
  }
}

function requestKickout() {
  return {
    type: PLAYER_KICKOUT_REQUEST
  }
}

function receiveKickout(data) {
  return {
    type: PLAYER_KICKOUT_RECEIVE,
    payload: data
  }
}

function fetchPlayers(data = {}) {
  return (dispatch, getState) => {

    dispatch(requestPlayers())
    let url = `/huo/products/${data.path.productId}/servers/${data.path.serverId}/players`
    AxiosAPI({
      method: 'GET',
      url: url,
      params: data.params
    }).then(response => {
      dispatch(receivePlayers(response))
      if (response.data.domainObject.length <= 0) {
        openNotificationWithIcon('info', '未找到该用户', '', 3)
      }
    }).catch(error => {
      if (error.response) {
        dispatch(requestPlayersErr(error.response.data))
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

function clearHeadImage(data) {
  return (dispatch, getState) => {

    dispatch(requestAvatarClear())
    let url = `/huo/products/${data.path.productId}/servers/${data.path.serverId}/players/${data.path.playerId}/clear/headimg`
    AxiosAPI({
      method: 'GET',
      url: url,
    }).then(response => {
      openNotificationWithIcon('info', '操作成功', response.data.msg, 3)
      // dispatch(receivePlayers(response))
      dispatch(receiveAvatarClear(response))
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

function skipNovice(data) {
  return (dispatch, getState) => {

    dispatch(requestNoviceSkip())
    let url = `/huo/products/${data.path.productId}/servers/${data.path.serverId}/players/skipnovice`
    AxiosAPI({
      method: 'GET',
      url: url,
      params: { nickname: data.path.nickname }
    }).then(response => {
      openNotificationWithIcon('info', '操作成功', response.data.msg, 3)
      dispatch(receiveNoviceSkip(response))
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

function skipNovices(data) {
  return (dispatch, getState) => {

    dispatch(requestNovicesSkip())
    let url = `/huo/products/${data.path.productId}/servers/${data.path.serverId}/players/skipnovicebatch`
    AxiosAPI({
      method: 'POST',
      url: url,
      data: data.form,
    }).then(response => {
      openNotificationWithIcon('info', '操作成功', response.data.msg, 3)
      dispatch(receiveNovicesSkip(response))
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

function modifyNickname(data) {
  return (dispatch, getState) => {

    dispatch(requestRename())
    let url = `/huo/products/${data.path.productId}/servers/${data.path.serverId}/players/rename`
    AxiosAPI({
      method: 'PUT',
      url: url,
      data: data.form
    }).then(response => {
      openNotificationWithIcon('info', response.data.msg, response.data.msg === 'success' ? '修改成功请重新拉取列表' : '', 3)
      dispatch(receiveRename(response))
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

function kickoutPlayer(data) {
  return (dispatch, getState) => {
    dispatch(requestKickout())
    let url = `/huo/products/${data.path.productId}/servers/${data.path.serverId}/players/${data.path.platformId}/kickout`
    AxiosAPI({
      method: 'PUT',
      url: url,
    }).then(response => {
      openNotificationWithIcon('info', '', response.data.msg, 5)
      dispatch(receiveKickout(response))
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

function keepPlayer(data) {
  return {
    type: PLAYER_KEEPING,
    payload: data
  }
}

export {
  fetchPlayers,
  clearPlayers,
  clearHeadImage,
  kickoutPlayer,
  receivePlayers,
  skipNovice,
  skipNovices,
  modifyNickname,
  keepPlayer
}

// ------------------------------------
// Action Handlers
// ------------------------------------
const ACTION_HANDLERS = {
  [PLAYER_LIST_REQUEST]: (state) => {
    return ({
      ...state,
      fetching: true,
      err: false,
      errMes: {},
      players: []
    })
  },
  [PLAYER_LIST_REQUEST_ERR]: (state, action) => {
    return ({
      ...state,
      fetching: false,
      err: true,
      errMes: { tips: action.payload.response.data.tips }
    })
  },
  [PLAYER_LIST_RECEIVE]: (state, action) => {
    return ({
      ...state,
      fetching: false,
      players: action.payload.data.domainObject || []
    })
  },
  [PLAYER_LIST_CLEAR]: (state) => {
    return ({
      ...state,
      fetching: false,
      players: []
    })
  },
  [PLAYER_CLEAR_AVATAR_REQUEST]: (state) => {
    return ({
      ...state,
      fetching: true,
      avatar: {}
    })
  },
  [PLAYER_CLEAR_AVATAR_RECEIVE]: (state, action) => {
    return ({
      ...state,
      fetching: false,
      avatar: action.payload.data
    })
  },
  [PLAYER_SKIP_NOVICE_REQUEST]: (state) => {
    return ({
      ...state,
      fetching: true,
      novice: {}
    })
  },
  [PLAYER_SKIP_NOVICE_RECEIVE]: (state, action) => {
    return ({
      ...state,
      fetching: false,
      novice: action.payload.data
    })
  },
  [PLAYER_SKIP_NOVICES_REQUEST]: (state) => {
    return ({
      ...state,
      fetching: true,
      novices: [],
    })
  },
  [PLAYER_SKIP_NOVICES_RECEIVE]: (state, action) => {
    return ({
      ...state,
      fetching: false,
      novices: action.payload.data
    })
  },
  [PLAYER_RENAME_REQUEST]: (state) => {
    return ({
      ...state,
      fetching: true,
      rename: {}
    })
  },
  [PLAYER_RENAME_RECEIVE]: (state, action) => {
    return ({
      ...state,
      fetching: false,
      rename: action.payload.data
    })
  },
  [PLAYER_KICKOUT_REQUEST]: (state) => {
    return ({
      ...state,
      fetching: true,
      kickout: {}
    })
  },
  [PLAYER_KICKOUT_RECEIVE]: (state, action) => {
    return ({
      ...state,
      fetching: false,
      kickout: action.payload.data
    })
  },
  [PLAYER_KEEPING]: (state, action) => {
    return ({
      ...state,
      keeping: {
        ...state.keeping,
        ...action.payload
      }
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
  players: [],
  avatar: {},
  novice: {},
  novices: [],
  rename: {},
  kickout: {},
  keeping: {}
}

export default function(state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type]

  return handler ? handler(state, action) : state
}
