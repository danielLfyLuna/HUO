import _ from 'lodash'
import { notification } from 'antd'

import AxiosAPI from '../../../../../utils/axios-api'
import openNotificationWithIcon from '../../../../base/components/Notification'

// ------------------------------------
// Constants
// ------------------------------------
const SERVER_LIST_REQUEST = 'SERVER_LIST_REQUEST'
const SERVER_LIST_REQUEST_ERR = 'SERVER_LIST_REQUEST_ERR'
const SERVER_LIST_RECEIVE = 'SERVER_LIST_RECEIVE'
const SERVER_LIST_CLEAR = 'SERVER_LIST_CLEAR'

const SERVER_CREATE_REQUEST = 'SERVER_CREATE_REQUEST'
const SERVER_CREATE_REQUEST_ERR = 'SERVER_CREATE_REQUEST_ERR'
const SERVER_CREATE_RECEIVE = 'SERVER_CREATE_RECEIVE'

const SERVER_UPDATE_REQUEST = 'SERVER_UPDATE_REQUEST'
const SERVER_UPDATE_REQUEST_ERR = 'SERVER_UPDATE_REQUEST_ERR'
const SERVER_UPDATE_RECEIVE = 'SERVER_UPDATE_RECEIVE'

const SERVER_MAP_CELL_REQUEST = 'SERVER_MAP_CELL_REQUEST'
const SERVER_MAP_CELL_RECEIVE = 'SERVER_MAP_CELL_RECEIVE'

const REFRESH_SERVERS_REDUCER = 'REFRESH_SERVERS_REDUCER'

const SERVER_SWITCH_REQUEST = 'SERVER_SWITCH_REQUEST'
const SERVER_SWITCH_REQUEST_ERR = 'SERVER_SWITCH_REQUEST_ERR'
const SERVER_SWITCH_RECEIVE = 'SERVER_SWITCH_RECEIVE'

// ------------------------------------
// Actions
// ------------------------------------

function requestServers() {
  return {
    type: SERVER_LIST_REQUEST
  }
}

function requestServersErr(data) {
  return {
    type: SERVER_LIST_REQUEST_ERR,
    payload: data
  }
}

function receiveServers(data) {
  return {
    type: SERVER_LIST_RECEIVE,
    payload: data
  }
}

function clearServers() {
  return {
    type: SERVER_LIST_CLEAR
  }
}

function requestServerCreate() {
  return {
    type: SERVER_CREATE_REQUEST
  }
}

function requestServerCreateErr(data) {
  return {
    type: SERVER_CREATE_REQUEST_ERR,
    payload: data
  }
}

function receiveServerCreate(data) {
  return {
    type: SERVER_CREATE_RECEIVE,
    payload: data
  }
}

function requestServerUpdate() {
  return {
    type: SERVER_UPDATE_REQUEST
  }
}

function requestServerUpdateErr(data) {
  return {
    type: SERVER_UPDATE_REQUEST_ERR,
    payload: data
  }
}

function receiveServerUpdate(data) {
  return {
    type: SERVER_UPDATE_RECEIVE,
    payload: data
  }
}

function requestCellsMap() {
  return {
    type: SERVER_MAP_CELL_REQUEST
  }
}

function receiveCellsMap(data) {
  return {
    type: SERVER_MAP_CELL_RECEIVE,
    payload: data
  }
}

function requestServerSwitch() {
  return {
    type: SERVER_SWITCH_REQUEST
  }
}

function requestServerSwitchErr(data) {
  return {
    type: SERVER_SWITCH_REQUEST_ERR,
    payload: data
  }
}

function receiveServerSwitch(data) {
  return {
    type: SERVER_SWITCH_RECEIVE,
    payload: data
  }
}

function fetchServers(data) {
  return (dispatch, getState) => {

    dispatch(requestServers())
    const url = `/huo/products/${data.path.productId}/servers`
    AxiosAPI({
      method: 'GET',
      url: url,
      params: data.params
    }).then(response => {
      dispatch(receiveServers(response))
    }).catch(error => {
      if (error.response) {
        dispatch(requestServersErr(error.response.data))
        openNotificationWithIcon('error', error.response.status, error.response.data.tips)
      } else {
        console.log('Error', error.message)
      }
    })
  }
}

function createServer(data) {
  return (dispatch, getState) => {

    dispatch(requestServerCreate())
    const url = `/huo/products/${data.path.productId}/servers`
    AxiosAPI({
      method: 'POST',
      url: url,
      data: data.form,
    }).then(response => {
      dispatch(receiveServerCreate(response))
      openNotificationWithIcon('success', '添加成功')
    }).catch(error => {
      if (error.response) {
        dispatch(requestServerCreateErr(error.response.data))
        openNotificationWithIcon('error', error.response.status, error.response.data.tips)
      } else {
        console.log('Error', error.message)
      }
    })
  }
}

function updateServer(data) {
  return (dispatch, getState) => {

    dispatch(requestServerUpdate())
    const url = `/huo/products/${data.path.productId}/servers/${data.path.serverId}`
    AxiosAPI({
      method: 'PUT',
      url: url,
      data: data.form,
    }).then(response => {
      dispatch(receiveServerUpdate(response))
      openNotificationWithIcon('success', '更新成功')
    }).catch(error => {
      if (error.response) {
        dispatch(requestServerUpdateErr(error.response.data))
        openNotificationWithIcon('error', error.response.status, error.response.data.tips)
      } else {
        console.log('Error', error.message)
      }
    })
  }
}

function fetchCellsMap() {
  return (dispatch, getState) => {

    dispatch(requestCellsMap())
    const url = `/huo/products/cells`
    AxiosAPI({
      method: 'GET',
      url: url,
    }).then(response => {
      dispatch(receiveCellsMap(response))
    }).catch(error => {
      if (error.response) {
        openNotificationWithIcon('error', error.response.status, error.response.data.tips)
      } else {
        console.log('Error', error.message)
      }
    })
  }
}

function switchServers(data) {
  return (dispatch, getState) => {

    dispatch(requestServerSwitch())
    const url = `/huo/products/${data.path.productId}/servers`
    AxiosAPI({
      method: 'PUT',
      url: url,
      data: data.form,
    }).then(response => {
      dispatch(receiveServerSwitch(response))
      let operation = { 1: '开服', 2: '维护', 3: '不可用' }
      let result = _.reduce(response.data.domainObject, (result, option) => {
        result.push(`服务器：${option.servers}，操作：${operation[option.operation]}，结果：${option.success ? '成功' : '失败'}`)
        return result
      }, [])
      notification.info({
        message: '服务器批量操作结果',
        description: result.join('；'),
        duration: 0
      })
      dispatch(fetchServers({path: data.path}))
    }).catch(error => {
      if (error.response) {
        dispatch(requestServerSwitchErr(error.response.data))
        openNotificationWithIcon('error', error.response.status, error.response.data.tips)
      } else {
        console.log('Error', error.message)
      }
    })
  }
}

export {
  clearServers,
  fetchServers,
  createServer,
  updateServer,
  fetchCellsMap,
  switchServers
}

// ------------------------------------
// Action Handlers
// ------------------------------------
const ACTION_HANDLERS = {
  [SERVER_LIST_REQUEST]: (state) => {
    return ({
      ...state,
      fetching: true
    })
  },
  [SERVER_LIST_RECEIVE]: (state, action) => {
    return ({
      ...state,
      fetching: false,
      list: action.payload ? action.payload.data.domainObject : []
    })
  },
  [SERVER_LIST_CLEAR]: (state) => {
    return ({
      ...state,
      fetching: false,
      err: false,
      errMes: {},
      list: []
    })
  },
  [SERVER_LIST_REQUEST_ERR]: (state, action) => {
    return ({
      ...state,
      fetching: false,
      errMes: { tips: action.payload.response.data.tips }
    })
  },
  [SERVER_CREATE_REQUEST]: (state) => {
    return ({
      ...state,
      fetching: true,
      err: false,
      errMes: {}
    })
  },
  [SERVER_CREATE_REQUEST_ERR]: (state, action) => {
    return ({
      ...state,
      fetching: false,
      err: true,
      errMes: action.payload ? { tips: action.payload.response.data.tips } : {}
    })
  },
  [SERVER_CREATE_RECEIVE]: (state, action) => {
    return ({
      ...state,
      fetching: false,
      create: action.payload.data
    })
  },
  [SERVER_UPDATE_REQUEST]: (state) => {
    return ({
      ...state,
      fetching: true,
      err: false,
      errMes: {}
    })
  },
  [SERVER_UPDATE_REQUEST_ERR]: (state, action) => {
    return ({
      ...state,
      fetching: false,
      err: true,
      errMes: action.payload ? { tips: action.payload.response.data.tips } : {}
    })
  },
  [SERVER_UPDATE_RECEIVE]: (state, action) => {
    return ({
      ...state,
      fetching: false,
      update: action.payload.data
    })
  },
  [SERVER_MAP_CELL_REQUEST]: (state) => {
    return ({
      ...state,
      fetching: true,
      err: false,
      errMes: {}
    })
  },
  [SERVER_MAP_CELL_RECEIVE]: (state, action) => {
    return ({
      ...state,
      fetching: false,
      cells: action.payload.data.productCellMap
    })
  },
  [REFRESH_SERVERS_REDUCER]: (state, action) => {
    const list = [...state.list]
    _.map(list, (val, index) => {
      if (val.serverId === action.data.data.serverId) {
        val = Object.assign(val, action.data.data)
      }
    })
    return ({
      ...state,
      list: [...list]
    })
  },
  [SERVER_SWITCH_REQUEST]: (state) => {
    return ({
      ...state,
      fetching: true,
      err: false,
      errMes: {}
    })
  },
  [SERVER_SWITCH_REQUEST_ERR]: (state, action) => {
    return ({
      ...state,
      fetching: false,
      err: true,
      errMes: action.payload ? { tips: action.payload.response.data.tips } : {}
    })
  },
  [SERVER_SWITCH_RECEIVE]: (state, action) => {
    return ({
      ...state,
      fetching: false,
      operation: action.payload.data.domainObject
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
  list: [],
  create: {},
  update: {},
  cells: {},
  operation: {}
}

export default function(state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type]

  return handler
    ? handler(state, action)
    : state
}
