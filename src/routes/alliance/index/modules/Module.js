import AxiosAPI from '../../../../../utils/axios-api'
import openNotificationWithIcon from '../../../../base/components/Notification'

// ------------------------------------
// Constants
// ------------------------------------
const ALLIANCE_REQUEST = 'ALLIANCE_REQUEST'
const ALLIANCE_REQUEST_ERR = 'ALLIANCE_REQUEST_ERR'
const ALLIANCE_RECEIVE = 'ALLIANCE_RECEIVE'
const ALLIANCE_CLEAR = 'ALLIANCE_CLEAR'

const ALLIANCE_MEMBERS_REQUEST = 'ALLIANCE_MEMBERS_REQUEST'
const ALLIANCE_MEMBERS_REQUEST_ERR = 'ALLIANCE_MEMBERS_REQUEST_ERR'
const ALLIANCE_MEMBERS_RECEIVE = 'ALLIANCE_MEMBERS_RECEIVE'

const ALLIANCE_KEEPING = 'ALLIANCE_KEEPING'

// ------------------------------------
// Actions  actionCreator
// ------------------------------------

function requestAlliances() {
  return {
    type: ALLIANCE_REQUEST
  }
}

function requestAlliancesErr(data) {
  return {
    type: ALLIANCE_REQUEST_ERR,
    payload: data
  }
}

function receiveAlliances(data) {
  return {
    type: ALLIANCE_RECEIVE,
    payload: data
  }
}

function clearAlliances() {
  return {
    type: ALLIANCE_CLEAR
  }
}

function requestAllianceMembers() {
  return {
    type: ALLIANCE_MEMBERS_REQUEST
  }
}

function requestAllianceMembersErr(data) {
  return {
    type: ALLIANCE_MEMBERS_REQUEST_ERR,
    payload: data
  }
}

function receiveAllianceMembers(data) {
  return {
    type: ALLIANCE_MEMBERS_RECEIVE,
    payload: data
  }
}

function keepAlliance(data) {
  return {
    type: ALLIANCE_KEEPING,
    payload: data
  }
}

function fetchAlliances(data) {
  return (dispatch) => {

    dispatch(requestAlliances())
    let url = `/huo/products/${data.path.productId}/servers/${data.path.serverId}/alliances`
    return AxiosAPI({
      method: 'GET',
      url: url
    }).then(response => {
      dispatch(receiveAlliances(response))
    }).catch(error => {
      if (error.response) {
        dispatch(requestAlliancesErr(error.response.data))
        openNotificationWithIcon('error', error.response.status, error.response.data.tips)
      } else {
        console.log('Error', error.message)
      }
    })
  }
}

function fetchAllianceMembers(data) {
  return (dispatch) => {
    dispatch(requestAllianceMembers())
    let url = `/huo/products/${data.path.productId}/servers/${data.path.serverId}/alliances/${data.path.allianceId}`
    AxiosAPI({
      method: 'GET',
      url: url
    }).then(response => {
      dispatch(receiveAllianceMembers(response))
    }).catch(error => {
      if (error.response) {
        dispatch(requestAllianceMembersErr(error.response.data))
        openNotificationWithIcon('error', error.response.status, error.response.data.tips)
      } else {
        console.log('Error', error.message)
      }
    })
  }
}

export {
  fetchAlliances,
  clearAlliances,
  fetchAllianceMembers,
  keepAlliance
}

// ------------------------------------
// Action Handlers
// ------------------------------------
const ACTION_HANDLERS = {
  [ALLIANCE_REQUEST]: (state) => {
    return ({
      ...state,
      fetching: true,
      err: false,
      errMes: {},
      list: []
    })
  },
  [ALLIANCE_REQUEST_ERR]: (state, action) => {
    return ({
      ...state,
      fetching: false,
      err: true,
      errMes: { tips: action.payload.response.data.tips }
    })
  },
  [ALLIANCE_RECEIVE]: (state, action) => {
    return ({
      ...state,
      fetching: false,
      list: action.payload.data.domainObject || []
    })
  },
  [ALLIANCE_CLEAR]: (state) => {
    return ({
      ...state,
      fetching: false,
      err: false,
      errMes: {},
      list: [],
      exports: {}
    })
  },
  [ALLIANCE_MEMBERS_REQUEST]: (state) => {
    return ({
      ...state,
      fetching: true,
      err: false,
      errMes: {},
      members: []
    })
  },
  [ALLIANCE_MEMBERS_REQUEST_ERR]: (state, action) => {
    return ({
      ...state,
      fetching: false,
      err: true,
      errMes: action.payload ? { tips: action.payload.response.data.tips } : {}
    })
  },
  [ALLIANCE_MEMBERS_RECEIVE]: (state, action) => {
    return ({
      ...state,
      fetching: false,
      members: action.payload.data.domainObject || []
    })
  },
  [ALLIANCE_KEEPING]: (state, action) => {
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
  list: [],
  members: [],
  exports: {},
  keeping: {}
}

// Reducers 生成器
export default function(state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type]

  return handler
    ? handler(state, action)
    : state
}
