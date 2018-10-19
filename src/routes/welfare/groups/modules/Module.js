/* global API_HOST */
import axios from 'axios'
import openNotificationWithIcon from '../../../../base/components/Notification'

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
        'adminUserId': JSON.parse(sessionStorage.getItem('hoolai')).userId,
        'Authorization': `bearer ${JSON.parse(sessionStorage.getItem('hoolai')).token}`
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
        'adminUserId': JSON.parse(sessionStorage.getItem('hoolai')).userId,
        'Authorization': `bearer ${JSON.parse(sessionStorage.getItem('hoolai')).token}`
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
        'adminUserId': JSON.parse(sessionStorage.getItem('hoolai')).userId,
        'Authorization': `bearer ${JSON.parse(sessionStorage.getItem('hoolai')).token}`
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

export {
  fetchGroups,
  clearGroups,
  createGroup,
  updateGroup,
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
  logs: [],
  keeping: {}
}

export default function (state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type]

  return handler
    ? handler(state, action)
    : state
}
