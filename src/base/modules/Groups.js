import AxiosAPI from '../../../utils/axios-api'

// ------------------------------------
// Constants
// ------------------------------------

const REQUEST_GROUPS_MAP = 'REQUEST_GROUPS_MAP'
const RECEIVE_GROUPS_MAP = 'RECEIVE_GROUPS_MAP'

// ------------------------------------
// Actions
// ------------------------------------

function requestGroupsMap() {
  return {
    type: REQUEST_GROUPS_MAP
  }
}

function receiveGroupsMap(data) {
  return {
    type: RECEIVE_GROUPS_MAP,
    payload: data
  }
}

function fetchGroupsMap() {
  return (dispatch, getState) => {
    dispatch(requestGroupsMap())
    let url = '/huo/groups/map'
    AxiosAPI({
      method: 'GET',
      url: url,
      headers: {
        adminUserId: JSON.parse(sessionStorage.getItem('hoolai')).userId,
        Authorization: `bearer ${JSON.parse(sessionStorage.getItem('hoolai')).token}`
      }
    }).then(response => {
      dispatch(receiveGroupsMap(response))
    }).catch(error => {
      if (error.response) {
        console.log(error.response.data)
      } else {
        // 一些错误是在设置请求的时候触发
        console.log('Error', error.message)
      }
    })
  }
}

export {
  fetchGroupsMap
}

// ------------------------------------
// Action Handlers
// ------------------------------------
const ACTION_HANDLERS = {
  [REQUEST_GROUPS_MAP]: (state) => {
    return ({
      ...state,
      fetching: true
    })
  },
  [RECEIVE_GROUPS_MAP]: (state, action) => {
    return ({
      ...state,
      fetching: false,
      map: action.payload.data.domainObject
    })
  }
}

// ------------------------------------
// Reducer
// ------------------------------------
const initialState = {
  fetching: false, // 是否正在请求
  map: []
}

export default function groupsReducer(state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type]

  return handler
    ? handler(state, action)
    : state
}
