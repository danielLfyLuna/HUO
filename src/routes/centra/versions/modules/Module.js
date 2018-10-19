import _ from 'lodash'

import AxiosAPI from '../../../../../utils/axios-api'
import openNotificationWithIcon from '../../../../base/components/Notification'

// ------------------------------------
// Constants
// ------------------------------------
const VERSION_LIST_REQUEST = 'VERSION_LIST_REQUEST'
const VERSION_LIST_REQUEST_ERR = 'VERSION_LIST_REQUEST_ERR'
const VERSION_LIST_RECEIVE = 'VERSION_LIST_RECEIVE'
const VERSION_LIST_CLEAR = 'VERSION_LIST_CLEAR'

const VERSION_CREATE_REQUEST = 'VERSION_CREATE_REQUEST'
const VERSION_CREATE_REQUEST_ERR = 'VERSION_CREATE_REQUEST_ERR'
const VERSION_CREATE_RECEIVE = 'VERSION_CREATE_RECEIVE'

const VERSION_UPDATE_REQUEST = 'VERSION_UPDATE_REQUEST'
const VERSION_UPDATE_REQUEST_ERR = 'VERSION_UPDATE_REQUEST_ERR'
const VERSION_UPDATE_RECEIVE = 'VERSION_UPDATE_RECEIVE'

const REFRESH_VERSIONS_REDUCER = 'REFRESH_VERSIONS_REDUCER'

// const VERSION_DELETE_REQUEST = 'VERSION_DELETE_REQUEST'
const VERSION_DELETE_REQUEST_ERR = 'VERSION_DELETE_REQUEST_ERR'
// const VERSION_DELETE_RECEIVE = 'VERSION_DELETE_RECEIVE'

// ------------------------------------
// Actions
// ------------------------------------

// function requestVersionDelete() {
//   return {
//     type: VERSION_DELETE_REQUEST
//   }
// }

function requestVersionDeleteErr(data) {
  return {
    type: VERSION_DELETE_REQUEST_ERR,
    payload: data
  }
}

// function receiveVersionDelete(data) {
//   return {
//     type: VERSION_DELETE_RECEIVE,
//     payload: data
//   }
// }

function requestVersions() {
  return {
    type: VERSION_LIST_REQUEST
  }
}

function requestVersionsErr(data) {
  return {
    type: VERSION_LIST_REQUEST_ERR,
    payload: data
  }
}

function receiveVersions(data) {
  return {
    type: VERSION_LIST_RECEIVE,
    payload: data
  }
}

function clearVersions() {
  return {
    type: VERSION_LIST_CLEAR
  }
}

function requestCreateVersion() {
  return {
    type: VERSION_CREATE_REQUEST
  }
}

function requestCreateVersionErr(data) {
  return {
    type: VERSION_CREATE_REQUEST_ERR,
    payload: data
  }
}

function receiveCreateVersion(data) {
  return {
    type: VERSION_CREATE_RECEIVE,
    payload: data
  }
}

function requestUpdateVersion() {
  return {
    type: VERSION_UPDATE_REQUEST
  }
}

function requestUpdateVersionErr(data) {
  return {
    type: VERSION_UPDATE_REQUEST_ERR,
    payload: data
  }
}

function receiveUpdateVersion(data) {
  return {
    type: VERSION_UPDATE_RECEIVE,
    payload: data
  }
}

function refreshVersionReducer(data) {
  return {
    type: REFRESH_VERSIONS_REDUCER,
    data: data
  }
}

function fetchVersions(data) {
  return (dispatch, getState) => {

    dispatch(requestVersions())
    let url = `/huo/products/${data.path.productId}/versions`

    AxiosAPI({
      method: 'GET',
      url: url
    }).then(response => {
      dispatch(receiveVersions(response))
    }).catch(error => {
      if (error.response) {
        dispatch(requestVersionsErr(error.response.data))
        openNotificationWithIcon('error', error.response.status, error.response.data.tips)
      } else {
        console.log('Error', error.message)
      }
    })
  }
}

function deleteVersion(data) {
  return (dispatch, getState) => {

    // dispatch(requestVersionDelete())
    let url = `/huo/products/${data.path.productId}/versions/${data.path.version}`
    AxiosAPI({
      method: 'DELETE',
      url: url,
    }).then(response => {
      openNotificationWithIcon('success', '删除成功')
      dispatch(fetchVersions(data))
    }).catch(error => {
      if (error.response) {
        dispatch(requestVersionDeleteErr(error.response.data))
        openNotificationWithIcon('error', error.response.data.tips)
      } else {
        console.log('Error', error.message)
      }
    })
  }
}

function createVersion(data) {
  return (dispatch, getState) => {

    data.productId = data.products[0]
    // data.VERSION = data.VERSIONs[0]
    data.type = data.type[0]
    data.status = data.status[0]
    data.group = data.groups[0]

    dispatch(requestCreateVersion())
    let url = `/huo/products/${data.productId}/versions`
    AxiosAPI({
      method: 'POST',
      data: data,
      url: url
    }).then(response => {
      dispatch(receiveCreateVersion(response))
      openNotificationWithIcon('success', '添加成功')
    }).catch(error => {
      if (error.response) {
        dispatch(requestCreateVersionErr(error.response.data))
        openNotificationWithIcon('error', error.response.status, error.response.data.tips)
      } else {
        console.log('Error', error.message)
      }
    })
  }
}

function updateVersion(data) {
  return (dispatch, getState) => {

    data.productId = data.products[0]
    // data.VERSION = data.VERSIONs[0]
    data.type = data.type[0]
    data.status = data.status[0]
    data.group = data.groups[0]

    dispatch(requestUpdateVersion())
    let url = `/huo/products/${data.productId}/versions/${data.version}`
    AxiosAPI({
      method: 'PUT',
      data: data,
      url: url
    }).then(response => {
      dispatch(receiveUpdateVersion(response))
      dispatch(refreshVersionReducer(response))
      openNotificationWithIcon('success', '更新成功')
    }).catch(error => {
      if (error.response) {
        dispatch(requestUpdateVersionErr(error.response.data))
        openNotificationWithIcon('error', error.response.status, error.response.data.tips)
      } else {
        console.log('Error', error.message)
      }
    })
  }
}


export {
  clearVersions,
  fetchVersions,
  createVersion,
  updateVersion,
  deleteVersion
}

// ------------------------------------
// Action Handlers
// ------------------------------------
const ACTION_HANDLERS = {
  [VERSION_LIST_REQUEST]: (state) => {
    return ({
      ...state,
      fetching: true
    })
  },
  [VERSION_LIST_RECEIVE]: (state, action) => {
    return ({
      ...state,
      fetching: false,
      list: action.payload.data.domainObject
    })
  },
  [VERSION_LIST_CLEAR]: (state) => {
    return ({
      ...state,
      fetching: false,
      err: false,
      errMes: {},
      list: []
    })
  },
  [VERSION_LIST_REQUEST_ERR]: (state, action) => {
    return ({
      ...state,
      fetching: false,
      errMes: { tips: action.payload.tips }
    })
  },
  [VERSION_CREATE_REQUEST]: (state) => {
    return ({
      ...state,
      fetching: true,
      err: false,
      errMes: {}
    })
  },
  [VERSION_CREATE_REQUEST_ERR]: (state, action) => {
    return ({
      ...state,
      fetching: false,
      err: true,
      errMes: action.payload ? { tips: action.payload.response.data.tips } : {}
    })
  },
  [VERSION_CREATE_RECEIVE]: (state, action) => {
    return ({
      ...state,
      fetching: false,
      create: action.payload.data
    })
  },
  [VERSION_UPDATE_REQUEST]: (state) => {
    return ({
      ...state,
      fetching: true,
      err: false,
      errMes: {}
    })
  },
  [VERSION_UPDATE_REQUEST_ERR]: (state, action) => {

    return ({
      ...state,
      fetching: false,
      err: true,
      errMes: action.payload ? { tips: action.payload.response.tips } : {}
    })
  },
  [VERSION_UPDATE_RECEIVE]: (state, action) => {
    return ({
      ...state,
      fetching: false,
      update: action.payload.data
    })
  },
  // [VERSION_DELETE_RECEIVE]: (state, action) => {
  //   return ({
  //     ...state,
  //     fetching: false,
  //     update: action.payload.data
  //   })
  // },
  [REFRESH_VERSIONS_REDUCER]: (state, action) => {
    const list = [...state.list]
    _.map(list, (val, index) => {
      if (val.version === action.data.data.version) {
        val = Object.assign(val, action.data.data)
      }
    })
    return ({
      ...state,
      list: [...list]
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
  update: {}
}

export default function(state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type]

  return handler
    ? handler(state, action)
    : state
}
