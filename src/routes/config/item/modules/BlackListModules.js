/* global API_HOST */
import axios from 'axios'
import _ from 'lodash'

import openNotificationWithIcon from '../../../../base/components/Notification'
import {singOut} from '../../../../base/modules/Login'

// ------------------------------------
// Constants
// ------------------------------------
const REQUEST_BLACK_LIST_ADD = 'REQUEST_BLACK_LIST_ADD'
const RECEIVE_BLACK_LIST_ADD = 'RECEIVE_BLACK_LIST_ADD'

const REQUEST_BLACK_LIST_GET = 'REQUEST_BLACK_LIST_GET'
const RECEIVE_BLACK_LIST_GET = 'RECEIVE_BLACK_LIST_GET'

const REQUEST_BLACK_LIST_DEL = 'REQUEST_BLACK_LIST_DEL'

// ------------------------------------
// Actions
// ------------------------------------
function requestAdd() {
  return {
    type: REQUEST_BLACK_LIST_ADD
  }
}
function receiveAdd() {
  return {
    type: RECEIVE_BLACK_LIST_ADD
  }
}

function requestGet() {
  return {
    type: REQUEST_BLACK_LIST_GET
  }
}
function receiveGet(data) {
  return {
    type: RECEIVE_BLACK_LIST_GET,
    list: data
  }
}

function requestDelete() {
  return {
    type: REQUEST_BLACK_LIST_DEL
  }
}

function fetchAdd(value) {
  return (dispatch, getState) => {
    let myState = getState()
    console.log('getState():', myState)
    console.log('Search values of form: ', value)

    dispatch(requestAdd())
    let url = `${API_HOST}/products/_/items/blacklist/${value.type}/templates/${value.itemList[0]}`
    axios({
      method: 'post',
      url: url,
      headers: {
        'adminUserId': JSON.parse(sessionStorage.getItem('sango2')).userId,
        'Authorization': `bearer ${JSON.parse(sessionStorage.getItem('sango2')).token}`
      }
    }).then(data => {
      dispatch(receiveAdd())
      openNotificationWithIcon('success', '加入道具黑名单成功')
    }).catch(error => {
      if (error.response) {
        if (error.response.data.message === 'token异常，请重新登录。') {
          openNotificationWithIcon('warning', '登录过期', error.response.data.message, 3)
          dispatch(singOut())
        }
      } else if (error.request) {
        console.log(error.request)
      } else {
        console.log('Error', error.message)
      }
    })
  }
}
function fetchGet(type) {
  return (dispatch, getState) => {
    let myState = getState()
    console.log('getState():', myState)
    console.log('Search values of form: ', type)

    dispatch(requestGet())
    let url = `${API_HOST}/products/_/items/blacklist/${type}`
    axios({
      method: 'get',
      url: url,
      headers: {
        'adminUserId': JSON.parse(sessionStorage.getItem('sango2')).userId,
        'Authorization': `bearer ${JSON.parse(sessionStorage.getItem('sango2')).token}`
      }
    }).then(data => {
      dispatch(receiveGet(data.data.blackList))
    }).catch(error => {
      if (error.response) {
        if (error.response.data.message === 'token异常，请重新登录。') {
          openNotificationWithIcon('warning', '登录过期', error.response.data.message, 3)
          dispatch(singOut())
        }
      } else if (error.request) {
        console.log(error.request)
      } else {
        console.log('Error', error.message)
      }
    })
  }
}
function fetchDelete(value, list) {
  return (dispatch, getState) => {
    let myState = getState()
    console.log('getState():', myState)
    console.log('Search values of form: ', value)

    dispatch(requestDelete())
    let url = `${API_HOST}/products/_/items/blacklist/${value.requestType}/templates/${value.itemId}`
    axios({
      method: 'delete',
      url: url,
      headers: {
        'adminUserId': JSON.parse(sessionStorage.getItem('sango2')).userId,
        'Authorization': `bearer ${JSON.parse(sessionStorage.getItem('sango2')).token}`
      }
    }).then(data => {
      let newData = {}
      _.forEach(list, function(v, key, collection) {
        if (v.itemId !== value.itemId) {
          newData[key] = v
        }
      })
      dispatch(receiveGet(newData))
      openNotificationWithIcon('success', '删除道具黑名单成功')
    }).catch(error => {
      if (error.response) {
        if (error.response.data.message === 'token异常，请重新登录。') {
          openNotificationWithIcon('warning', '登录过期', error.response.data.message, 3)
          dispatch(singOut())
        }
      } else if (error.request) {
        console.log(error.request)
      } else {
        console.log('Error', error.message)
      }
    })
  }
}

export {
  fetchAdd,
  fetchGet,
  fetchDelete
}

// ------------------------------------
// Action Handlers
// ------------------------------------
const ACTION_HANDLERS = {
  [REQUEST_BLACK_LIST_ADD]: (state) => {
    return ({
      ...state,
      fetching: true
    })
  },
  [RECEIVE_BLACK_LIST_ADD]: (state) => {
    return ({
      ...state,
      fetching: false
    })
  },
  [REQUEST_BLACK_LIST_GET]: (state) => {
    return ({
      ...state,
      getFetching: true
    })
  },
  [RECEIVE_BLACK_LIST_GET]: (state, action) => {
    return ({
      ...state,
      list: Object.assign({}, action.list),
      getFetching: false
    })
  }
}

// ------------------------------------
// Reducer
// ------------------------------------
const initialState = {
  fetching: false,
  getFetching: false,
  list: {}
}
export default function mailsReducer (state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type]

  return handler ? handler(state, action) : state
}
