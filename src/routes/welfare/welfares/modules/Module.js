/* global API_HOST */
import axios from 'axios'
import openNotificationWithIcon from '../../../../base/components/Notification'

// ------------------------------------
// Constants
// ------------------------------------

const PLAYERS_REQUEST = 'PLAYERS_REQUEST'
const PLAYERS_REQUEST_ERR = 'PLAYERS_REQUEST_ERR'
const PLAYERS_RECEIVE = 'PLAYERS_RECEIVE'

const PLAYER_IMPORT_REQUEST = 'PLAYER_IMPORT_REQUEST'
const PLAYER_IMPORT_REQUEST_ERR = 'PLAYER_IMPORT_REQUEST_ERR'
const PLAYER_IMPORT_RECEIVE = 'PLAYER_IMPORT_RECEIVE'

const PLAYER_ADD_REQUEST = 'PLAYER_ADD_REQUEST'
const PLAYER_ADD_REQUEST_ERR = 'PLAYER_ADD_REQUEST_ERR'
const PLAYER_ADD_RECEIVE = 'PLAYER_ADD_RECEIVE'

const PLAYER_DEL_REQUEST = 'PLAYER_DEL_REQUEST'
const PLAYER_DEL_REQUEST_ERR = 'PLAYER_DEL_REQUEST_ERR'
const PLAYER_DEL_RECEIVE = 'PLAYER_DEL_RECEIVE'

const PLAYER_BATCH_REQUEST = 'PLAYER_BATCH_REQUEST'
const PLAYER_BATCH_REQUEST_ERR = 'PLAYER_BATCH_REQUEST_ERR'
const PLAYER_BATCH_RECEIVE = 'PLAYER_BATCH_RECEIVE'

const WELFARE_KEEPING = 'WELFARE_KEEPING'

// ------------------------------------
// Actions
// ------------------------------------

function requestPlayers() {
  return {
    type: PLAYERS_REQUEST
  }
}

function requestPlayersErr(data) {
  return {
    type: PLAYERS_REQUEST_ERR,
    payload: data
  }
}

function receivePlayers(data) {
  return {
    type: PLAYERS_RECEIVE,
    payload: data
  }
}

function requestPlayerImport() {
  return {
    type: PLAYER_IMPORT_REQUEST
  }
}

function requestPlayersImportErr(data) {
  return {
    type: PLAYER_IMPORT_REQUEST_ERR,
    payload: data
  }
}

function receivePlayerImport(data) {
  return {
    type: PLAYER_IMPORT_RECEIVE,
    payload: data
  }
}

function requestPlayerAdd() {
  return {
    type: PLAYER_ADD_REQUEST
  }
}

function requestPlayerAddErr(data) {
  return {
    type: PLAYER_ADD_REQUEST_ERR,
    payload: data
  }
}

function receivePlayerAdd(data) {
  return {
    type: PLAYER_ADD_RECEIVE,
    payload: data
  }
}

function requestPlayerDel() {
  return {
    type: PLAYER_DEL_REQUEST
  }
}

function requestPlayerDelErr(data) {
  return {
    type: PLAYER_DEL_REQUEST_ERR,
    payload: data
  }
}

function receivePlayerDel(data) {
  return {
    type: PLAYER_DEL_RECEIVE,
    payload: data
  }
}

function requestPlayerBatch() {
  return {
    type: PLAYER_BATCH_REQUEST
  }
}

function requestPlayerBatchErr(data) {
  return {
    type: PLAYER_BATCH_REQUEST_ERR,
    payload: data
  }
}

function receivePlayerBatch(data) {
  return {
    type: PLAYER_BATCH_RECEIVE,
    payload: data
  }
}

function keepWelfare(data) {
  return {
    type: WELFARE_KEEPING,
    payload: data
  }
}

function fetchPlayers(data) {
  return (dispatch) => {

    dispatch(requestPlayers())
    let url = `${API_HOST}/huo/welfares/groups/${data.path.groupId}`
    axios({
      method: 'GET',
      url: url,
      headers: {
        'adminUserId': JSON.parse(sessionStorage.getItem('hoolai')).userId,
        'Authorization': `bearer ${JSON.parse(sessionStorage.getItem('hoolai')).token}`
      }
    }).then(response => {
      dispatch(receivePlayers(response))
    }).catch(error => {
      if (error.response) {
        dispatch(requestPlayersErr(error.response.data))
        openNotificationWithIcon('error', error.response.status, error.response.data.tips)
      } else {
        console.log('Error', error.message)
      }
    })
  }
}

function importPlayers(data) {
  return (dispatch) => {

    dispatch(requestPlayerImport())
    let url = `${API_HOST}/huo/welfares/${data.path.groupId}`
    return axios({
      method: 'POST',
      url: url,
      data: data.form,
      headers: {
        'adminUserId': JSON.parse(sessionStorage.getItem('hoolai')).userId,
        'Authorization': `bearer ${JSON.parse(sessionStorage.getItem('hoolai')).token}`
      }
    }).then(response => {
      dispatch(receivePlayerImport(response))
    }).catch(error => {
      if (error.response) {
        dispatch(requestPlayersImportErr(error.response.data))
        openNotificationWithIcon('error', error.response.status, error.response.data.tips)
      } else {
        console.log('Error', error.message)
      }
    })
  }
}

function createPlayer(data) {
  return (dispatch) => {

    dispatch(requestPlayerAdd())
    let url = `${API_HOST}/huo/welfares/${data.path.groupId}/addplayer`
    return axios({
      method: 'POST',
      url: url,
      data: data.form,
      headers: {
        'adminUserId': JSON.parse(sessionStorage.getItem('hoolai')).userId,
        'Authorization': `bearer ${JSON.parse(sessionStorage.getItem('hoolai')).token}`
      }
    }).then(response => {
      dispatch(receivePlayerAdd(response))
      openNotificationWithIcon('success', '添加操作完成！')
    }).catch(error => {
      if (error.response) {
        dispatch(requestPlayerAddErr(error.response.data))
        openNotificationWithIcon('error', error.response.status, error.response.data.tips)
      } else {
        console.log('Error', error.message)
      }
    })
  }
}

function deletePlayer(data) {
  return (dispatch) => {

    dispatch(requestPlayerDel())
    let url = `${API_HOST}/huo/welfares/${data.path.groupId}/delplayer`
    axios({
      method: 'POST',
      url: url,
      data: data.form,
      headers: {
        'adminUserId': JSON.parse(sessionStorage.getItem('hoolai')).userId,
        'Authorization': `bearer ${JSON.parse(sessionStorage.getItem('hoolai')).token}`
      }
    }).then(response => {
      dispatch(receivePlayerDel(response))
    }).catch(error => {
      if (error.response) {
        dispatch(requestPlayerDelErr(error.response.data))
        openNotificationWithIcon('error', error.response.status, error.response.data.tips)
      } else {
        console.log('Error', error.message)
      }
    })
  }
}

function batchPlayers(data) {
  return (dispatch) => {

    dispatch(requestPlayerBatch())
    let url = `${API_HOST}/huo/welfares/${data.path.groupId}/benefitopen`
    axios({
      method: 'PUT',
      url: url,
      data: data.form,
      headers: {
        'adminUserId': JSON.parse(sessionStorage.getItem('hoolai')).userId,
        'Authorization': `bearer ${JSON.parse(sessionStorage.getItem('hoolai')).token}`
      }
    }).then(response => {
      dispatch(receivePlayerBatch(response))
    }).catch(error => {
      if (error.response) {
        dispatch(requestPlayerBatchErr(error.response.data))
        openNotificationWithIcon('error', error.response.status, error.response.data.tips)
      } else {
        console.log('Error', error.message)
      }
    })
  }
}

export {
  fetchPlayers,
  importPlayers,
  createPlayer,
  deletePlayer,
  batchPlayers,
  keepWelfare
}

// ------------------------------------
// Action Handlers
// ------------------------------------
const ACTION_HANDLERS = {
  [PLAYERS_REQUEST]: (state) => {
    return ({
      ...state,
      fetching: true,
      err: false,
      errMes: {}
    })
  },
  [PLAYERS_REQUEST_ERR]: (state, action) => {
    return ({
      ...state,
      fetching: false,
      err: true,
      errMes: { tips: action.payload.response.data.tips }
    })
  },
  [PLAYERS_RECEIVE]: (state, action) => {
    return ({
      ...state,
      fetching: false,
      players: action.payload.data.players
    })
  },
  [PLAYER_IMPORT_REQUEST]: (state) => {
    return ({
      ...state,
      fetching: true,
      err: false,
      errMes: {}
    })
  },
  [PLAYER_IMPORT_REQUEST_ERR]: (state, action) => {
    return ({
      ...state,
      fetching: false,
      err: true,
      errMes: { tips: action.payload.response.data.tips }
    })
  },
  [PLAYER_IMPORT_RECEIVE]: (state, action) => {
    return ({
      ...state,
      fetching: false,
      players: action.payload.data.welfareGroupPlayerList || []
    })
  },
  [PLAYER_ADD_REQUEST]: (state) => {
    return ({
      ...state,
      fetching: true,
      err: false,
      errMes: {}
    })
  },
  [PLAYER_ADD_REQUEST_ERR]: (state, action) => {
    return ({
      ...state,
      fetching: false,
      err: true,
      errMes: action.payload ? { tips: action.payload.response.data.tips } : {}
    })
  },
  [PLAYER_ADD_RECEIVE]: (state, action) => {
    return ({
      ...state,
      fetching: false,
      players: action.payload.data.welfareGroupPlayerList || []
    })
  },
  [PLAYER_DEL_REQUEST]: (state) => {
    return ({
      ...state,
      fetching: true,
      err: false,
      errMes: {},
      player: []
    })
  },
  [PLAYER_DEL_REQUEST_ERR]: (state, action) => {
    return ({
      ...state,
      fetching: false,
      err: true,
      errMes: action.payload ? { tips: action.payload.response.data.tips } : {}
    })
  },
  [PLAYER_DEL_RECEIVE]: (state, action) => {
    return ({
      ...state,
      fetching: false,
      players: action.payload.data.welfareGroupPlayerList || [],
      player: action.payload.data.welfareGroupPlayerList || []
    })
  },
  [PLAYER_BATCH_REQUEST]: (state) => {
    return ({
      ...state,
      fetching: true,
      err: false,
      errMes: {},
      batch: []
    })
  },
  [PLAYER_BATCH_REQUEST_ERR]: (state, action) => {
    return ({
      ...state,
      fetching: false,
      err: true,
      errMes: action.payload ? { tips: action.payload.response.data.tips } : {}
    })
  },
  [PLAYER_BATCH_RECEIVE]: (state, action) => {
    return ({
      ...state,
      fetching: false,
      players: action.payload.data.welfareGroupPlayerList,
      batch: action.payload.data.welfareGroupPlayerList
    })
  },
  [WELFARE_KEEPING]: (state, action) => {
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
const initialState = { // 数据结构
  fetching: false,
  err: false,
  errMes: {},
  groups: [],
  players: [],
  player: [],
  batch: [],
  logs: [],
  keeping: {}
}

export default function (state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type]

  return handler
    ? handler(state, action)
    : state
}
