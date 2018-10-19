import _ from 'lodash'

import AxiosApi from '../../../../../utils/axios-api'
import openNotificationWithIcon from '../../../../base/components/Notification'

// ------------------------------------
// Constants
// ------------------------------------
const GROUP_LIST_REQUEST = 'GROUP_LIST_REQUEST'
const GROUP_LIST_REQUEST_ERR = 'GROUP_LIST_REQUEST_ERR'
const GROUP_LIST_RECEIVE = 'GROUP_LIST_RECEIVE'
const GROUP_LIST_CLEAR = 'GROUP_LIST_CLEAR'

const GROUP_CREATE_REQUEST = 'GROUP_CREATE_REQUEST'
const GROUP_CREATE_REQUEST_ERR = 'GROUP_CREATE_REQUEST_ERR'
const GROUP_CREATE_RECEIVE = 'GROUP_CREATE_RECEIVE'

const GROUP_UPDATE_REQUEST = 'GROUP_UPDATE_REQUEST'
const GROUP_UPDATE_REQUEST_ERR = 'GROUP_UPDATE_REQUEST_ERR'
const GROUP_UPDATE_RECEIVE = 'GROUP_UPDATE_RECEIVE'

const GROUP_DELETE_REQUEST = 'GROUP_DELETE_REQUEST'
const GROUP_DELETE_REQUEST_ERR = 'GROUP_DELETE_REQUEST_ERR'
const GROUP_DELETE_RECEIVE = 'GROUP_DELETE_RECEIVE'

// ------------------------------------
// Actions
// ------------------------------------

function requestGroups() {
  return {
    type: GROUP_LIST_REQUEST
  }
}

function requestGroupsErr(data) {
  return {
    type: GROUP_LIST_REQUEST_ERR,
    payload: data
  }
}

function receiveGroups(data) {
  return {
    type: GROUP_LIST_RECEIVE,
    payload: data
  }
}

function clearGroups() {
  return {
    type: GROUP_LIST_CLEAR
  }
}

function requestGroupCreate() {
  return {
    type: GROUP_CREATE_REQUEST
  }
}

function requestGroupCreateErr(data) {
  return {
    type: GROUP_CREATE_REQUEST_ERR,
    payload: data
  }
}

function receiveGroupCreate(data) {
  return {
    type: GROUP_CREATE_RECEIVE,
    payload: data
  }
}

function requestGroupUpdate() {
  return {
    type: GROUP_UPDATE_REQUEST
  }
}

function requestGroupUpdateErr(data) {
  return {
    type: GROUP_UPDATE_REQUEST_ERR,
    payload: data
  }
}

function receiveGroupUpdate(data) {
  return {
    type: GROUP_UPDATE_RECEIVE,
    payload: data
  }
}

function requestGroupDelete() {
  return {
    type: GROUP_DELETE_REQUEST
  }
}

function requestGroupDeleteErr(data) {
  return {
    type: GROUP_DELETE_REQUEST_ERR,
    payload: data
  }
}

function receiveGroupDelete(data) {
  return {
    type: GROUP_DELETE_RECEIVE,
    payload: data
  }
}

function fetchGroups() {
  return (dispatch, getState) => {

    dispatch(requestGroups())
    const url = `/huo/groups`
    AxiosApi({
      method: 'GET',
      url: url,
    }).then(response => {
      dispatch(receiveGroups(response))
    }).catch(error => {
      if (error.response) {
        dispatch(requestGroupsErr(error.response.data))
        openNotificationWithIcon('error', error.response.data.tips)
      } else {
        console.log('Error', error.message)
      }
    })
  }
}

function createGroup(data) {
  return (dispatch, getState) => {

    dispatch(requestGroupCreate())
    const url = `/huo/groups`
    AxiosApi({
      method: 'POST',
      url: url,
      data: data.form,
    }).then(response => {
      dispatch(receiveGroupCreate(response))
      openNotificationWithIcon('success', '添加成功')
    }).catch(error => {
      if (error.response) {
        dispatch(requestGroupCreateErr(error.response.data))
        openNotificationWithIcon('error', error.response.data.tips)
      } else {
        console.log('Error', error.message)
      }
    })
  }
}

function updateGroup(data) {
  return (dispatch, getState) => {

    dispatch(requestGroupUpdate())
    const url = `/huo/groups`
    AxiosApi({
      method: 'PUT',
      url: url,
      data: data.form,
    }).then(response => {
      dispatch(receiveGroupUpdate(response))
      openNotificationWithIcon('success', '更新成功')
    }).catch(error => {
      if (error.response) {
        dispatch(requestGroupUpdateErr(error.response.data))
        openNotificationWithIcon('error', error.response.data.tips)
      } else {
        console.log('Error', error.message)
      }
    })
  }
}

function deleteGroup(data) {
  return (dispatch, getState) => {

    dispatch(requestGroupDelete())
    const url = `/huo/groups/${data.path.group}`
    AxiosApi({
      method: 'DELETE',
      url: url,
    }).then(response => {
      dispatch(receiveGroupDelete(response))
      openNotificationWithIcon('success', '删除成功')
    }).catch(error => {
      if (error.response) {
        dispatch(requestGroupDeleteErr(error.response.data))
        openNotificationWithIcon('error', error.response.data.tips)
      } else {
        console.log('Error', error.message)
      }
    })
  }
}

export {
  clearGroups,
  fetchGroups,
  createGroup,
  updateGroup,
  deleteGroup
}

// ------------------------------------
// Action Handlers
// ------------------------------------
const ACTION_HANDLERS = {
  [GROUP_LIST_REQUEST]: (state) => {
    return ({
      ...state,
      fetching: true
    })
  },
  [GROUP_LIST_RECEIVE]: (state, action) => {
    return ({
      ...state,
      fetching: false,
      list: action.payload.data.domainObject
    })
  },
  [GROUP_LIST_CLEAR]: (state) => {
    return ({
      ...state,
      fetching: false,
      err: false,
      errMes: {},
      list: []
    })
  },
  [GROUP_LIST_REQUEST_ERR]: (state, action) => {
    return ({
      ...state,
      fetching: false,
      errMes: { tips: action.payload.response.data.tips }
    })
  },
  [GROUP_CREATE_REQUEST]: (state) => {
    return ({
      ...state,
      fetching: true,
      err: false,
      errMes: {}
    })
  },
  [GROUP_CREATE_REQUEST_ERR]: (state, action) => {
    return ({
      ...state,
      fetching: false,
      err: true,
      errMes: action.payload ? { tips: action.payload.response.data.tips } : {}
    })
  },
  [GROUP_CREATE_RECEIVE]: (state, action) => {
    const list = state.list
    const data = action.payload.data
    return ({
      ...state,
      fetching: false,
      list: [{ ...data }, ...list],
      create: { ...data }
    })
  },
  [GROUP_UPDATE_REQUEST]: (state) => {
    return ({
      ...state,
      fetching: true,
      err: false,
      errMes: {}
    })
  },
  [GROUP_UPDATE_REQUEST_ERR]: (state, action) => {
    return ({
      ...state,
      fetching: false,
      err: true,
      errMes: action.payload ? { tips: action.payload.response.data.tips } : {}
    })
  },
  [GROUP_UPDATE_RECEIVE]: (state, action) => {
    const list = state.list
    const data = action.payload.data
    _.map(list, (val) => {
      if (val.group === data.group) {
        Object.assign(val, data)
      }
    })
    return ({
      ...state,
      fetching: false,
      list: [ ...list ],
      update: { ...data }
    })
  },
  [GROUP_DELETE_REQUEST]: (state) => {
    return ({
      ...state,
      fetching: true,
      err: false,
      errMes: {}
    })
  },
  [GROUP_DELETE_REQUEST_ERR]: (state, action) => {
    return ({
      ...state,
      fetching: false,
      err: true,
      errMes: action.payload ? { tips: action.payload.response.data.tips } : {}
    })
  },
  [GROUP_DELETE_RECEIVE]: (state, action) => {
    const data = action.payload.data
    const list = state.list.filter(v => v.group != data.group)
    return ({
      ...state,
      fetching: false,
      list: [ ...list ],
      delete: { ...data }
    })
  },
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
  delete: {}
}

export default function(state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type]

  return handler
    ? handler(state, action)
    : state
}
