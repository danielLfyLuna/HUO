/* global API_HOST */
import axios from 'axios'

import openNotificationWithIcon from '../../../../base/components/Notification'


// ------------------------------------
// Constants
// ------------------------------------
const REQUEST_LOGS_CONFIG = 'REQUEST_LOGS_CONFIG'
const RECEIVE_LOGS_CONFIG = 'RECEIVE_LOGS_CONFIG'
const CLEAR_LOGS_CONFIG = 'CLEAR_LOGS_CONFIG'

const REQUEST_LOGS_MODULE = 'REQUEST_LOGS_MODULE'
const RECEIVE_LOGS_MODULE = 'RECEIVE_LOGS_MODULE'
const CLEAR_LOGS_MODULE = 'CLEAR_LOGS_MODULE'

const LOGS_CONFIG_ERR = 'LOGS_CONFIG_ERR'
const LOGS_MODULE_ERR = 'LOGS_MODULE_ERR'


const REQUEST_DUMP_LOGS = 'REQUEST_DUMP_LOGS'
const RECEIVE_DUMP_LOGS = 'RECEIVE_DUMP_LOGS'
const CLEAR_DUMP_LOGS = 'CLEAR_DUMP_LOGS'

const REQUEST_PULL_LOGS = 'REQUEST_PULL_LOGS'
const RECEIVE_PULL_LOGS = 'RECEIVE_PULL_LOGS'
const CLEAR_PULL_LOGS = 'CLEAR_PULL_LOGS'

const REQUEST_LOGS = 'REQUEST_LOGS'
const RECEIVE_LOGS = 'RECEIVE_LOGS'
const CLEAR_LOGS = 'CLEAR_LOGS'

const DUMP_LOGS_ERR = 'DUMP_LOGS_ERR'
const PULL_LOGS_ERR = 'PULL_LOGS_ERR'
const LOGS_ERR = 'LOGS_ERR'
// ------------------------------------
// Actions
// ------------------------------------

function requestLogsConfig () {
  return {
    type: REQUEST_LOGS_CONFIG
  }
}
function receiveLogsConfig (data) {
  return {
    type: RECEIVE_LOGS_CONFIG,
    payload: data
  }
}

function clearLogsConfig() {
  return {
    type: CLEAR_LOGS_CONFIG
  }
}

function logsConfigErr(data) {
  return {
    type: LOGS_CONFIG_ERR,
    payload: data
  }
}

function requestLogsModule() {
  return {
    type: REQUEST_LOGS_MODULE
  }
}
function receiveLogsModule(data) {
  return {
    type: RECEIVE_LOGS_MODULE,
    payload: data
  }
}

function clearLogsModule() {
  return {
    type: CLEAR_LOGS_MODULE
  }
}

function logsModuleErr(data) {
  return {
    type: LOGS_MODULE_ERR,
    payload: data
  }
}



function requestDumpLogs() {
  return {
    type: REQUEST_DUMP_LOGS
  }
}
function receiveDumpLogs(data) {
  return {
    type: RECEIVE_DUMP_LOGS,
    payload: data
  }
}

function clearDumpLogs() {
  return {
    type: CLEAR_DUMP_LOGS
  }
}

function dumpLogsErr(data) {
  return {
    type: DUMP_LOGS_ERR,
    payload: data
  }
}

function requestPullLogs() {
  return {
    type: REQUEST_PULL_LOGS
  }
}
function receivePullLogs(data) {
  return {
    type: RECEIVE_PULL_LOGS,
    payload: data
  }
}

function clearPullLogs() {
  return {
    type: CLEAR_PULL_LOGS
  }
}

function pullLogsErr(data) {
  return {
    type: PULL_LOGS_ERR,
    payload: data
  }
}

function requestLogs() {
  return {
    type: REQUEST_LOGS
  }
}
function receiveLogs(data) {
  return {
    type: RECEIVE_LOGS,
    payload: data
  }
}

function clearLogs() {
  return {
    type: CLEAR_LOGS
  }
}

function logsErr(data) {
  return {
    type: LOGS_ERR,
    payload: data
  }
}

// 按模块设置log等级 -- 查询
function fetchLogsConfig(value = {}) {
  return (dispatch, getState) => {
    dispatch(requestLogsConfig())
    let url = `${API_HOST}/huo/products/${value.products[0]}/servers/${value.products[1]}/players/logconfig?nickname=${value.nickname}`
    axios({
      method: 'GET',
      url: url,
      headers: {
        'productId': value.products[0],
        'serverId': value.products[1],
        'adminUserId': JSON.parse(sessionStorage.getItem('hoolai')).userId,
        'Authorization': `bearer ${JSON.parse(sessionStorage.getItem('hoolai')).token}`
      }
    }).then(response => {
      dispatch(receiveLogsConfig(response))
      openNotificationWithIcon('success', '获取成功,请稍后')
    }).catch(error => {
      if (error) {
        dispatch(logsConfigErr(error))
      } else {
        console.log('Error', error.message)
      }
    })
  }
}

// 按模块设置log等级 -- 修改
function updateLogsModule(value) {
  return (dispatch, getState) => {
    dispatch(clearLogsConfig())
    dispatch(requestLogsModule())
    let url = `${API_HOST}/huo/products/${value.products[0]}/servers/${value.products[1]}/players/modulelevel`
    axios({
      method: 'PUT',
      url: url,
      data: value.list,
      headers: {
        'productId': value.products[0],
        'serverId': value.products[1],
        'adminUserId': JSON.parse(sessionStorage.getItem('hoolai')).userId,
        'Authorization': `bearer ${JSON.parse(sessionStorage.getItem('hoolai')).token}`
      }
    }).then(response => {
      dispatch(receiveLogsModule(response))
      openNotificationWithIcon('success', response.data.msg)
    }).catch(error => {
      if (error) {
        dispatch(logsModuleErr(error))
      } else {
        console.log('Error', error.message)
      }
    })
  }
}

// dump logs
function fetchDumpLogs(value = {}) {
  return (dispatch, getState) => {
    dispatch(requestDumpLogs())
    openNotificationWithIcon('info', '请稍后')
    let url = `${API_HOST}/huo/products/${value.products[0]}/servers/${value.products[1]}/players/dumpview?nickname=${value.nickname}`
    axios({
      method: 'GET',
      url: url,
      headers: {
        'productId': value.products[0],
        'serverId': value.products[1],
        'adminUserId': JSON.parse(sessionStorage.getItem('hoolai')).userId,
        'Authorization': `bearer ${JSON.parse(sessionStorage.getItem('hoolai')).token}`
      }
    }).then(response => {
      dispatch(receiveDumpLogs(response))
      if (response.data.msg) {
        openNotificationWithIcon('success', response.data.msg)
      }
    }).catch(error => {
      if (error) {
        dispatch(dumpLogsErr(error))
        openNotificationWithIcon('error', error.data.tips)
      } else {
        console.log('Error', error.message)
      }
    })
  }
}

// pull logs
function fetchPullLogs(value = {}) {
  return (dispatch, getState) => {
    dispatch(requestPullLogs())
    openNotificationWithIcon('info', '请稍后')
    let url = `${API_HOST}/huo/products/${value.products[0]}/servers/${value.products[1]}/players/pulllogs?nickname=${value.nickname}`
    axios({
      method: 'GET',
      url: url,
      headers: {
        'productId': value.products[0],
        'serverId': value.products[1],
        'adminUserId': JSON.parse(sessionStorage.getItem('hoolai')).userId,
        'Authorization': `bearer ${JSON.parse(sessionStorage.getItem('hoolai')).token}`
      }
    }).then(response => {
      dispatch(receivePullLogs(response))
      if (response.data.msg) {
        openNotificationWithIcon('success', response.data.msg)
      }
    }).catch(error => {
      if (error) {
        dispatch(pullLogsErr(error))
        openNotificationWithIcon('error', error.data.tips)
      } else {
        console.log('Error', error.message)
      }
    })
  }
}

// get logs
function fetchLogs(value = {}) {
  return (dispatch, getState) => {
    dispatch(requestLogs())
    openNotificationWithIcon('info', '请稍后')
    let url = `${API_HOST}/huo/products/${value.products[0]}/servers/${value.products[1]}/players/getlogs?nickname=${value.nickname}`
    axios({
      method: 'GET',
      url: url,
      headers: {
        'productId': value.products[0],
        'serverId': value.products[1],
        'adminUserId': JSON.parse(sessionStorage.getItem('hoolai')).userId,
        'Authorization': `bearer ${JSON.parse(sessionStorage.getItem('hoolai')).token}`
      }
    }).then(response => {
      dispatch(receiveLogs(response))
      if (response.data.domainObject && response.data.domainObject.length == 0) {
        openNotificationWithIcon('success', '查询成功，没有相关数据')
      }
    }).catch(error => {
      if (error) {
        dispatch(logsErr(error))
      } else {
        console.log('Error', error.message)
      }
    })
  }
}

export {
  fetchLogsConfig,
  updateLogsModule,
  clearLogsConfig,
  clearLogsModule,
  fetchDumpLogs,
  clearDumpLogs,
  fetchPullLogs,
  clearPullLogs,
  fetchLogs,
  clearLogs
}

// ------------------------------------
// Action Handlers
// ------------------------------------
const ACTION_HANDLERS = {
  [REQUEST_LOGS_CONFIG]: (state) => {
    return ({
      ...state,
      fetching: true,
      visit: false
    })
  },
  [RECEIVE_LOGS_CONFIG]: (state, action) => {
    return ({
      ...state,
      fetching: false,
      visit: true,
      logsConfig: action.payload ? action.payload.data.domainObject : {}
    })
  },
  [CLEAR_LOGS_CONFIG]: (state) => {
    return ({
      ...state,
      fetching: false,
      visit: false,
      logsConfig: {},
      configErr: null
    })
  },
  [LOGS_CONFIG_ERR]: (state, action) => {
    return ({
      ...state,
      visit: false,
      configErr: { tips: action.payload.response.data.tips }
    })
  },
  [REQUEST_LOGS_MODULE]: (state) => {
    return ({
      ...state,
      fetching: true
    })
  },
  [RECEIVE_LOGS_MODULE]: (state, action) => {
    return ({
      ...state,
      fetching: false,
      logsModule: action.payload ? action.payload.data.domainObject : {}
    })
  },
  [CLEAR_LOGS_MODULE]: (state) => {
    return ({
      ...state,
      fetching: false,
      logsModule: {},
      moduleErr: null
    })
  },
  [LOGS_MODULE_ERR]: (state, action) => {
    return ({
      ...state,
      moduleErr: { tips: action.payload.response.data.tips }
    })
  },


  [REQUEST_DUMP_LOGS]: (state) => {
    return ({
      ...state,
      fetching: true
    })
  },
  [RECEIVE_DUMP_LOGS]: (state, action) => {
    return ({
      ...state,
      fetching: false,
      dumpLogs: action.payload ? action.payload.data.msg : {}
    })
  },
  [CLEAR_DUMP_LOGS]: (state) => {
    return ({
      ...state,
      fetching: false,
      dumpLogs: {},
      dumpLogsErr: null
    })
  },
  [DUMP_LOGS_ERR]: (state, action) => {
    return ({
      ...state,
      dumpLogsErr: { tips: action.payload.response.data.tips }
    })
  },

  [REQUEST_PULL_LOGS]: (state) => {
    return ({
      ...state,
      fetching: true
    })
  },
  [RECEIVE_PULL_LOGS]: (state, action) => {
    return ({
      ...state,
      fetching: false,
      pullLogs: action.payload ? action.payload.data.msg : {}
    })
  },
  [CLEAR_PULL_LOGS]: (state) => {
    return ({
      ...state,
      fetching: false,
      pullLogs: {},
      pullLogsErr: null
    })
  },
  [DUMP_LOGS_ERR]: (state, action) => {
    return ({
      ...state,
      pullLogsErr: { tips: action.payload.response.data.tips }
    })
  },

  [REQUEST_LOGS]: (state) => {
    return ({
      ...state,
      loading: true
    })
  },
  [RECEIVE_LOGS]: (state, action) => {
    return ({
      ...state,
      loading: false,
      logs: action.payload ? action.payload.data.domainObject : []
    })
  },
  [CLEAR_LOGS]: (state) => {
    return ({
      ...state,
      loading: false,
      logs: [],
      logsErr: null
    })
  },
  [LOGS_ERR]: (state, action) => {
    return ({
      ...state,
      logsErr: { tips: action.payload.response.data.tips }
    })
  }
}
// ------------------------------------
// Reducer
// ------------------------------------
const initialState = {
  fetching: false,
  visit: false,
  loading: false,
  logsConfig: {},
  logsModule: {},
  dumpLogs: {},
  pullLogs: {},
  logs: [],
  configErr: null,
  moduleErr: null,
  dumpLogsErr: null,
  pullLogsErr: null,
  logsErr: null
}
export default function mailsReducer (state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type]

  return handler ? handler(state, action) : state
}
