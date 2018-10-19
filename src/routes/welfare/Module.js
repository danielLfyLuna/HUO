/* global API_HOST */
import axios from 'axios'
import openNotificationWithIcon from '../../base/components/Notification'

// ------------------------------------
// Constants
// ------------------------------------
const GROUPS_REQUEST = 'GROUPS_REQUEST'
const GROUPS_REQUEST_ERR = 'GROUPS_REQUEST_ERR'
const GROUPS_RECEIVE = 'GROUPS_RECEIVE'
const GROUPS_CLEAR = 'GROUPS_CLEAR'

const GROUP_ADD_REQUEST = 'GROUP_ADD_REQUEST'
const GROUP_ADD_REQUEST_ERR = 'GROUP_ADD_REQUEST_ERR'
const GROUP_ADD_RECEIVE = 'GROUP_ADD_RECEIVE'

const GROUP_MOD_REQUEST = 'GROUP_MOD_REQUEST'
const GROUP_MOD_REQUEST_ERR = 'GROUP_MOD_REQUEST_ERR'
const GROUP_MOD_RECEIVE = 'GROUP_MOD_RECEIVE'

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

const PLAYER_BATCH_LOGS_REQUEST = 'PLAYER_BATCH_LOGS_REQUEST'
const PLAYER_BATCH_LOGS_REQUEST_ERR = 'PLAYER_BATCH_LOGS_REQUEST_ERR'
const PLAYER_BATCH_LOGS_RECEIVE = 'PLAYER_BATCH_LOGS_RECEIVE'
const PLAYER_BATCH_LOGS_CLEAR = 'PLAYER_BATCH_LOGS_CLEAR'

const WELFARE_KEEPING = 'WELFARE_KEEPING'

// ------------------------------------
// Actions
// ------------------------------------

function requestGroups() {
  return {
    type: GROUPS_REQUEST
  }
}

function requestGroupsErr(data) {
  return {
    type: GROUPS_REQUEST_ERR,
    payload: data
  }
}

function receiveGroups(data) {
  return {
    type: GROUPS_RECEIVE,
    payload: data
  }
}

function clearGroups() {
  return {
    type: GROUPS_CLEAR
  }
}

function requestGroupAdd() {
  return {
    type: GROUP_ADD_REQUEST
  }
}

function requestGroupAddErr(data) {
  return {
    type: GROUP_ADD_REQUEST_ERR,
    payload: data
  }
}

function receiveGroupAdd(data) {
  return {
    type: GROUP_ADD_RECEIVE,
    payload: data
  }
}

function requestGroupMod() {
  return {
    type: GROUP_MOD_REQUEST
  }
}

function requestGroupModErr(data) {
  return {
    type: GROUP_MOD_REQUEST_ERR,
    payload: data
  }
}

function receiveGroupMod(data) {
  return {
    type: GROUP_MOD_RECEIVE,
    payload: data
  }
}

function keepWelfare(data) {
  return {
    type: WELFARE_KEEPING,
    payload: data
  }
}

function fetchGroups() {
  return (dispatch) => {

    dispatch(requestGroups())
    let url = `${API_HOST}/huo/welfares/groups`
    return axios({
      method: 'GET',
      url: url,
      headers: {
        'adminUserId': JSON.parse(sessionStorage.getItem('sango2')).userId,
        'Authorization': `bearer ${JSON.parse(sessionStorage.getItem('sango2')).token}`
      }
    }).then(response => {
      dispatch(receiveGroups(response))
    }).catch(error => {
      if (error.response) {
        dispatch(requestGroupsErr(error.response.data))
        openNotificationWithIcon('error', error.response.status, error.response.data.tips)
      } else {
        console.log('Error', error.message)
      }
    })
  }
}

function createGroup(data) {
  return (dispatch) => {

    dispatch(requestGroupAdd())
    let url = `${API_HOST}/huo/welfares/groups/add`
    return axios({
      method: 'POST',
      url: url,
      data: data.form,
      headers: {
        'adminUserId': JSON.parse(sessionStorage.getItem('sango2')).userId,
        'Authorization': `bearer ${JSON.parse(sessionStorage.getItem('sango2')).token}`
      }
    }).then(response => {
      dispatch(receiveGroupAdd(response))
      openNotificationWithIcon('success', '添加用户操作完成！')
    }).catch(error => {
      if (error.response) {
        dispatch(requestGroupAddErr(error.response.data))
        openNotificationWithIcon('error', error.response.status, error.response.data.tips)
      } else {
        console.log('Error', error.message)
      }
    })
  }
}

function updateGroup(data) {
  return (dispatch) => {

    dispatch(requestGroupMod())
    let url = `${API_HOST}/huo/welfares/groups/edit`
    axios({
      method: 'PUT',
      url: url,
      data: data.form,
      headers: {
        'adminUserId': JSON.parse(sessionStorage.getItem('sango2')).userId,
        'Authorization': `bearer ${JSON.parse(sessionStorage.getItem('sango2')).token}`
      }
    }).then(response => {
      dispatch(receiveGroupMod(response))
    }).catch(error => {
      if (error.response) {
        dispatch(requestGroupModErr(error.response.data))
        openNotificationWithIcon('error', error.response.status, error.response.data.tips)
      } else {
        console.log('Error', error.message)
      }
    })
  }
}

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

function fetchPlayers(data) {
  return (dispatch) => {

    dispatch(requestPlayers())
    let url = `${API_HOST}/huo/welfares/groups/${data.path.groupId}`
    axios({
      method: 'GET',
      url: url,
      headers: {
        'adminUserId': JSON.parse(sessionStorage.getItem('sango2')).userId,
        'Authorization': `bearer ${JSON.parse(sessionStorage.getItem('sango2')).token}`
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
        'adminUserId': JSON.parse(sessionStorage.getItem('sango2')).userId,
        'Authorization': `bearer ${JSON.parse(sessionStorage.getItem('sango2')).token}`
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
        'adminUserId': JSON.parse(sessionStorage.getItem('sango2')).userId,
        'Authorization': `bearer ${JSON.parse(sessionStorage.getItem('sango2')).token}`
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
        'adminUserId': JSON.parse(sessionStorage.getItem('sango2')).userId,
        'Authorization': `bearer ${JSON.parse(sessionStorage.getItem('sango2')).token}`
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
        'adminUserId': JSON.parse(sessionStorage.getItem('sango2')).userId,
        'Authorization': `bearer ${JSON.parse(sessionStorage.getItem('sango2')).token}`
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

function requestPlayerBatchLogs() {
  return {
    type: PLAYER_BATCH_LOGS_REQUEST
  }
}

function requestPlayerBatchLogsErr(data) {
  return {
    type: PLAYER_BATCH_LOGS_REQUEST_ERR,
    payload: data
  }
}

function receivePlayerBatchLogs(data) {
  return {
    type: PLAYER_BATCH_LOGS_RECEIVE,
    payload: data
  }
}

function clearPlayerLogs() {
  return {
    type: PLAYER_BATCH_LOGS_CLEAR
  }
}

function fetchBatchPlayers(data) {
  return (dispatch) => {

    dispatch(requestPlayerBatchLogs())
    let url = `${API_HOST}/huo/welfares/products/${data.path.productId}/servers/${data.path.serverId}/benefitopen`
    axios({
      method: 'GET',
      url: url,
      params: data.params,
      headers: {
        'adminUserId': JSON.parse(sessionStorage.getItem('sango2')).userId,
        'Authorization': `bearer ${JSON.parse(sessionStorage.getItem('sango2')).token}`
      }
    }).then(response => {
      dispatch(receivePlayerBatchLogs(response))
    }).catch(error => {
      if (error.response) {
        dispatch(requestPlayerBatchLogsErr(error.response.data))
        openNotificationWithIcon('error', error.response.status, error.response.data.tips)
      } else {
        console.log('Error', error.message)
      }
    })
  }
}

export {
  fetchGroups,
  clearGroups,
  createGroup,
  updateGroup,
  fetchPlayers,
  importPlayers,
  createPlayer,
  deletePlayer,
  batchPlayers,
  fetchBatchPlayers,
  clearPlayerLogs,
  keepWelfare
}

// ------------------------------------
// Action Handlers
// ------------------------------------
const ACTION_HANDLERS = {
  [GROUPS_REQUEST]: (state) => {
    return ({
      ...state,
      fetching: true,
      err: false,
      errMes: {}
    })
  },
  [GROUPS_REQUEST_ERR]: (state, action) => {
    return ({
      ...state,
      fetching: false,
      err: true,
      errMes: { tips: action.payload.response.data.tips }
    })
  },
  [GROUPS_RECEIVE]: (state, action) => {
    return ({
      ...state,
      fetching: false,
      groups: action.payload.data.welfareGroups || []
    })
  },
  [GROUPS_CLEAR]: (state) => {
    return ({
      ...state,
      fetching: false,
      err: false,
      errMes: {},
      groups: []
    })
  },
  [GROUP_ADD_REQUEST]: (state) => {
    return ({
      ...state,
      fetching: true,
      err: false,
      errMes: {}
    })
  },
  [GROUP_ADD_REQUEST_ERR]: (state, action) => {
    return ({
      ...state,
      fetching: false,
      err: true,
      errMes: action.payload ? { tips: action.payload.response.data.tips } : {}
    })
  },
  [GROUP_ADD_RECEIVE]: (state, action) => {
    return ({
      ...state,
      fetching: false,
      groups: action.payload.data.welfareGroups || []
    })
  },
  [GROUP_MOD_REQUEST]: (state) => {
    return ({
      ...state,
      fetching: true,
      err: false,
      errMes: {}
    })
  },
  [GROUP_MOD_REQUEST_ERR]: (state, action) => {
    return ({
      ...state,
      fetching: false,
      err: true,
      errMes: action.payload ? { tips: action.payload.response.data.tips } : {}
    })
  },
  [GROUP_MOD_RECEIVE]: (state, action) => {
    return ({
      ...state,
      fetching: false,
      groups: action.payload.data.welfareGroups || []
    })
  },
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
  [PLAYER_BATCH_LOGS_REQUEST]: (state) => {
    return ({
      ...state,
      fetching: true,
      err: false,
      errMes: {},
      logs: []
    })
  },
  [PLAYER_BATCH_LOGS_REQUEST_ERR]: (state, action) => {
    return ({
      ...state,
      fetching: false,
      err: true,
      errMes: action.payload ? { tips: action.payload.response.data.tips } : {}
    })
  },
  [PLAYER_BATCH_LOGS_RECEIVE]: (state, action) => {
    return ({
      ...state,
      fetching: false,
      logs: action.payload.data.list || []
    })
  },
  [PLAYER_BATCH_LOGS_CLEAR]: (state) => {
    return ({
      ...state,
      fetching: false,
      err: false,
      errMes: {},
      logs: [],
      clear: false
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
  clear: true,
  keeping: {}
}

export default function (state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type]

  return handler
    ? handler(state, action)
    : state
}
