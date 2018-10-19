/* global API_HOST */
import axios from 'axios'
import openNotificationWithIcon from '../../../base/components/Notification'
// ------------------------------------
// Constants
// ------------------------------------
const RECEIVE_RANK = 'RECEIVE_RANK'
const REQUEST_RANK = 'REQUEST_RANK'
const CLEAR_RANK = 'CLEAR_RANK'

const RANK_REQUEST_ERR = 'RANK_REQUEST_ERR'

const KEEP_INITIAL_RANK = 'KEEP_INITIAL_RANK'

const RANK_SPECIAL_REQUEST = 'RANK_SPECIAL_REQUEST'
const RANK_SPECIAL_RECEIVE = 'RANK_SPECIAL_RECEIVE'

// ------------------------------------
// Actions
// ------------------------------------

function requestRank() {
  return {
    type: REQUEST_RANK
  }
}

function receiveRank(data) {
  return {
    type: RECEIVE_RANK,
    payload: data
  }
}

function clearRank() {
  return {
    type: CLEAR_RANK
  }
}

function requestErr(data) {
  return {
    type: RANK_REQUEST_ERR,
    payload: data
  }
}

function keepInitial(data) {
  return {
    type: KEEP_INITIAL_RANK,
    payload: data
  }
}

function requestSpecial() {
  return {
    type: RANK_SPECIAL_REQUEST
  }
}

function receiveSpecial(data) {
  return {
    type: RANK_SPECIAL_RECEIVE,
    payload: data
  }
}

function fetchRank(value) {
  return (dispatch, getState) => {
    // 验证从复提交
    if (getState().rank.fetching) {
      return
    }

    dispatch(requestRank())
    let url = `${API_HOST}/products/${value.path.products[0]}/servers/${value.path.products[1]}/ranks/${value.path.rankType[0]}`
    if (value.path.specialType) {
      url = `${url}/${value.path.specialType[0]}`
    }
    axios({
      method: 'GET',
      url: url,
      headers: {
        'adminUserId': JSON.parse(sessionStorage.getItem('hoolai')).userId,
        'Authorization': `bearer ${JSON.parse(sessionStorage.getItem('hoolai')).token}`
      }
    }).then(response => {
      dispatch(receiveRank(response))
    }).catch(error => {
      if (error.response) {
        dispatch(requestErr(error.response.data))
        openNotificationWithIcon('error', error.response.data.tips)
      } else {
        console.log('Error', error.message)
      }
    })
  }
}

function fetchSpecialTypes(data) {
  return (dispatch, getState) => {

    dispatch(requestSpecial())
    let url = `${API_HOST}/products/${data.path.products[0]}/servers/${data.path.products[1]}/ranks/${data.path.type}`
    axios({
      method: 'GET',
      url: url,
      headers: {
        adminUserId: JSON.parse(sessionStorage.getItem('hoolai')).userId,
        Authorization: `bearer ${JSON.parse(sessionStorage.getItem('hoolai')).token}`
      }
    }).then(response => {
      dispatch(receiveSpecial(response))
    }).catch(error => {
      if (error.response) {
        openNotificationWithIcon('error', error.response.data.tips)
      } else {
        console.log('Error', error.message)
      }
    })
  }
}

export {
  fetchRank,
  clearRank,
  keepInitial,
  fetchSpecialTypes
}

// ------------------------------------
// Action Handlers
// ------------------------------------
const ACTION_HANDLERS = {
  [REQUEST_RANK]: (state) => {
    return ({
      ...state,
      fetching: true
    })
  },
  [RECEIVE_RANK]: (state, action) => {
    return ({
      ...state,
      fetching: false,
      ranks: action.payload ? action.payload.data.domainObject : []
    })
  },
  [CLEAR_RANK]: (state) => {
    return ({
      ...state,
      fetching: false,
      ranks: [],
      error: null
    })
  },
  [RANK_REQUEST_ERR]: (state, action) => {
    return ({
      ...state,
      fetching: false,
      error: { tips: action.payload.tips }
    })
  },
  [KEEP_INITIAL_RANK]: (state, action) => {
    return ({
      ...state,
      keeping: {
        ...state.keeping,
        ...action.payload
      }
    })
  },
  [RANK_SPECIAL_REQUEST]: (state) => {
    return ({
      ...state,
      fetching: true,
      error: null,
      types: {}
    })
  },
  [RANK_SPECIAL_RECEIVE]: (state, action) => {
    return ({
      ...state,
      fetching: false,
      types: action.payload.data.domainObject || {}
    })
  }
}

// ------------------------------------
// Reducer
// ------------------------------------
const initialState = { // 数据结构
  fetching: false,
  ranks: [],
  error: null,
  keeping: {},
  types: {}
}

  export default function(state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type]

  return handler
    ? handler(state, action)
    : state
}
