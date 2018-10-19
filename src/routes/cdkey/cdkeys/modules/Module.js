import _ from 'lodash'

import AxiosAPI from '../../../../../utils/axios-api'
import openNotificationWithIcon from '../../../../base/components/Notification'

// ------------------------------------
// Constants
// ------------------------------------
const CDKEY_LIST_REQUEST = 'CDKEY_LIST_REQUEST'
const CDKEY_LIST_REQUEST_ERR = 'CDKEY_LIST_REQUEST_ERR'
const CDKEY_LIST_RECEIVE = 'CDKEY_LIST_RECEIVE'
const CDKEY_LIST_CLEAR = 'CDKEY_LIST_CLEAR'

const CDKEY_CREATE_REQUEST = 'CDKEY_CREATE_REQUEST'
const CDKEY_CREATE_REQUEST_ERR = 'CDKEY_CREATE_REQUEST_ERR'
const CDKEY_CREATE_RECEIVE = 'CDKEY_CREATE_RECEIVE'

const CDKEY_UPDATE_REQUEST = 'CDKEY_UPDATE_REQUEST'
const CDKEY_UPDATE_REQUEST_ERR = 'CDKEY_UPDATE_REQUEST_ERR'
const CDKEY_UPDATE_RECEIVE = 'CDKEY_UPDATE_RECEIVE'

const CDKEY_QUERY_REQUEST = 'CDKEY_QUERY_REQUEST'
const CDKEY_QUERY_REQUEST_ERR = 'CDKEY_QUERY_REQUEST_ERR'
const CDKEY_QUERY_RECEIVE = 'CDKEY_QUERY_RECEIVE'

const CDKEY_GENERATE_REQUEST = 'CDKEY_GENERATE_REQUEST'
const CDKEY_GENERATE_REQUEST_ERR = 'CDKEY_GENERATE_REQUEST_ERR'
const CDKEY_GENERATE_RECEIVE = 'CDKEY_GENERATE_RECEIVE'

const CDKEY_GENERATE_LOG_REQUEST = 'CDKEY_GENERATE_LOG_REQUEST'
const CDKEY_GENERATE_LOG_REQUEST_ERR = 'CDKEY_GENERATE_LOG_REQUEST_ERR'
const CDKEY_GENERATE_LOG_RECEIVE = 'CDKEY_GENERATE_LOG_RECEIVE'

const CDKEY_CHANNEL_GIFT_REQUEST = 'CDKEY_CHANNEL_GIFT_REQUEST'
const CDKEY_CHANNEL_GIFT_REQUEST_ERR = 'CDKEY_CHANNEL_GIFT_REQUEST_ERR'
const CDKEY_CHANNEL_GIFT_RECEIVE = 'CDKEY_CHANNEL_GIFT_RECEIVE'
const CDKEY_CHANNEL_GIFT_CLEAR = 'CDKEY_CHANNEL_GIFT_CLEAR'

const CDKEY_CHANNEL_GIFT_CREATE_REQUEST = 'CDKEY_CHANNEL_GIFT_CREATE_REQUEST'
const CDKEY_CHANNEL_GIFT_CREATE_REQUEST_ERR = 'CDKEY_CHANNEL_GIFT_CREATE_REQUEST_ERR'
const CDKEY_CHANNEL_GIFT_CREATE_RECEIVE = 'CDKEY_CHANNEL_GIFT_CREATE_RECEIVE'

const CDKEY_CHANNEL_GIFT_DELETE_REQUEST = 'CDKEY_CHANNEL_GIFT_DELETE_REQUEST'
const CDKEY_CHANNEL_GIFT_DELETE_REQUEST_ERR = 'CDKEY_CHANNEL_GIFT_DELETE_REQUEST_ERR'
const CDKEY_CHANNEL_GIFT_DELETE_RECEIVE = 'CDKEY_CHANNEL_GIFT_DELETE_RECEIVE'

const CDKEY_KEEPING = 'CDKEY_KEEPING'

// ------------------------------------
// Actions
// ------------------------------------

function requestCDKeys() {
  return {
    type: CDKEY_LIST_REQUEST
  }
}

function requestCDKeysErr(data) {
  return {
    type: CDKEY_LIST_REQUEST_ERR,
    payload: data
  }
}

function receiveCDKeys(data) {
  return {
    type: CDKEY_LIST_RECEIVE,
    payload: data
  }
}

function clearCDKeys() {
  return {
    type: CDKEY_LIST_CLEAR
  }
}

function requestCDKeyCreate() {
  return {
    type: CDKEY_CREATE_REQUEST
  }
}

function requestCDKeyCreateErr(data) {
  return {
    type: CDKEY_CREATE_REQUEST_ERR,
    payload: data
  }
}

function receiveCDKeyCreate(data) {
  return {
    type: CDKEY_CREATE_RECEIVE,
    payload: data
  }
}

function requestCDKeyUpdate() {
  return {
    type: CDKEY_UPDATE_REQUEST
  }
}

function requestCDKeyUpdateErr(data) {
  return {
    type: CDKEY_UPDATE_REQUEST_ERR,
    payload: data
  }
}

function receiveCDKeyUpdate(data) {
  return {
    type: CDKEY_UPDATE_RECEIVE,
    payload: data
  }
}

function requestCDKeyQuery() {
  return {
    type: CDKEY_QUERY_REQUEST
  }
}

function requestCDKeyQueryErr(data) {
  return {
    type: CDKEY_QUERY_REQUEST_ERR,
    payload: data
  }
}

function receiveCDKeyQuery(data) {
  return {
    type: CDKEY_QUERY_RECEIVE,
    payload: data
  }
}

function requestCDKeyGenerate() {
  return {
    type: CDKEY_GENERATE_REQUEST
  }
}

function requestCDKeyGenerateErr(data) {
  return {
    type: CDKEY_GENERATE_REQUEST_ERR,
    payload: data
  }
}

function receiveCDKeyGenerate(data) {
  return {
    type: CDKEY_GENERATE_RECEIVE,
    payload: data
  }
}

function requestCDKeyGenerateLog() {
  return {
    type: CDKEY_GENERATE_LOG_REQUEST
  }
}

function requestCDKeyGenerateLogErr(data) {
  return {
    type: CDKEY_GENERATE_REQUEST_ERR,
    payload: data
  }
}

function receiveCDKeyGenerateLog(data) {
  return {
    type: CDKEY_GENERATE_LOG_RECEIVE,
    payload: data
  }
}

function requestChannelGifts() {
  return {
    type: CDKEY_CHANNEL_GIFT_REQUEST
  }
}

function requestChannelGiftsErr(data) {
  return {
    type: CDKEY_CHANNEL_GIFT_REQUEST_ERR,
    payload: data
  }
}

function receiveChannelGifts(data) {
  return {
    type: CDKEY_CHANNEL_GIFT_RECEIVE,
    payload: data
  }
}

function clearChannelGifts() {
  return {
    type: CDKEY_CHANNEL_GIFT_CLEAR
  }
}

function requestChannelGiftCreate() {
  return {
    type: CDKEY_CHANNEL_GIFT_CREATE_REQUEST
  }
}

function requestChannelGiftCreateErr(data) {
  return {
    type: CDKEY_CHANNEL_GIFT_CREATE_REQUEST_ERR,
    payload: data
  }
}

function receiveChannelGiftCreate(data) {
  return {
    type: CDKEY_CHANNEL_GIFT_CREATE_RECEIVE,
    payload: data
  }
}

function requestChannelGiftDelete() {
  return {
    type: CDKEY_CHANNEL_GIFT_DELETE_REQUEST
  }
}

function requestChannelGiftDeleteErr(data) {
  return {
    type: CDKEY_CHANNEL_GIFT_DELETE_REQUEST_ERR,
    payload: data
  }
}

function receiveChannelGiftDelete(data) {
  return {
    type: CDKEY_CHANNEL_GIFT_DELETE_RECEIVE,
    payload: data
  }
}

function keepCDKey(data) {
  return {
    type: CDKEY_KEEPING,
    payload: data
  }
}


function fetchCDKeys(data) {
  return (dispatch, getState) => {

    dispatch(requestCDKeys())
    const url = `/huo/products/${data.path.productId}/cdkeyactivities`
    AxiosAPI({
      method: 'GET',
      url: url,
    }).then(response => {
      dispatch(receiveCDKeys(response))
    }).catch(error => {
      if (error.response) {
        dispatch(requestCDKeysErr(error.response.data))
        openNotificationWithIcon('error', error.response.status, error.response.data.tips)
      } else {
        console.log('Error', error.message)
      }
    })
  }
}

function createCDKey(data) {
  return (dispatch, getState) => {

    dispatch(requestCDKeyCreate())
    const url = `/huo/products/${data.path.productId}/cdkeyactivities`
    AxiosAPI({
      method: 'POST',
      url: url,
      data: data.form,
    }).then(response => {
      dispatch(receiveCDKeyCreate(response))
      openNotificationWithIcon('success', '添加成功')
    }).catch(error => {
      if (error.response) {
        dispatch(requestCDKeyCreateErr(error.response.data))
        openNotificationWithIcon('error', error.response.status, error.response.data.tips)
      } else {
        console.log('Error', error.message)
      }
    })
  }
}

function updateCDKey(data) {
  return (dispatch, getState) => {

    dispatch(requestCDKeyUpdate())
    const url = `/huo/products/${data.path.productId}/cdkeyactivities/${data.form.activityId}`
    AxiosAPI({
      method: 'PUT',
      url: url,
      data: data.form,
    }).then(response => {
      dispatch(receiveCDKeyUpdate(response))
      openNotificationWithIcon('success', '修改成功')
    }).catch(error => {
      if (error.response) {
        dispatch(requestCDKeyUpdateErr(error.response.data))
        openNotificationWithIcon('error', error.response.status, error.response.data.tips)
      } else {
        console.log('Error', error.message)
      }
    })
  }
}

function generateCDKey(data) {
  return (dispatch, getState) => {

    dispatch(requestCDKeyGenerate())
    let url = `/huo/products/${data.path.productId}/cdkeyactivities/${data.path.activityId}/cdkeys`
    AxiosAPI({
      method: 'POST',
      data: data.form,
      url: url,
    }).then(response => {
      dispatch(receiveCDKeyGenerate(response))
      openNotificationWithIcon('success', '生成cdkey成功')
    }).catch(error => {
      if (error.response) {
        dispatch(requestCDKeyGenerateErr(error.response.data))
        openNotificationWithIcon('error', error.response.status, error.response.data.tips)
      } else {
        console.log('Error', error.message)
      }
    })
  }
}

function fetchGenerateLog(data) {
  return (dispatch, getState) => {

    dispatch(requestCDKeyGenerateLog())
    let url = `/huo/products/${data.path.productId}/cdkeyactivities/${data.path.activityId}/cdkeys`
    AxiosAPI({
      method: 'GET',
      url: url,
    }).then(response => {
      dispatch(receiveCDKeyGenerateLog(response))
    }).catch(error => {
      if (error.response) {
        dispatch(requestCDKeyGenerateLogErr(error.response.data))
        openNotificationWithIcon('error', error.response.status, error.response.data.tips)
      } else {
        console.log('Error', error.message)
      }
    })
  }
}

function queryCDKey(data) {
  return (dispatch, getState) => {

    dispatch(requestCDKeyQuery())
    let url = `/huo/products/_/cdkeyactivities/cdkeys/${data.path.cdkey}`
    AxiosAPI({
      method: 'GET',
      url: url,
    }).then(response => {
      dispatch(receiveCDKeyQuery(response))
    }).catch(error => {
      if (error.response) {
        dispatch(requestCDKeyQueryErr(error.response.data))
        openNotificationWithIcon('error', error.response.status, error.response.data.tips)
      } else {
        console.log('Error', error.message)
      }
    })
  }
}

function fetchChannelGifts(data) {
  return (dispatch, getState) => {

    dispatch(requestChannelGifts())
    const url = `/huo/products/${data.path.productId}/cdkeyactivities/channelgift/link`
    AxiosAPI({
      method: 'GET',
      url: url,
    }).then(response => {
      dispatch(receiveChannelGifts(response))
    }).catch(error => {
      if (error.response) {
        dispatch(requestChannelGiftsErr(error.response.data))
        openNotificationWithIcon('error', error.response.data.tips)
      } else {
        console.log('Error', error.message)
      }
    })
  }
}

function createChannelGift(data) {
  return (dispatch, getState) => {

    dispatch(requestChannelGiftCreate())
    const url = `/huo/products/${data.path.productId}/cdkeyactivities/channelgift/link`
    AxiosAPI({
      method: 'POST',
      url: url,
      data: data.form,
    }).then(response => {
      dispatch(receiveChannelGiftCreate(response))
      openNotificationWithIcon('success', '添加成功')
      dispatch(fetchChannelGifts(data))
    }).catch(error => {
      if (error.response) {
        dispatch(requestChannelGiftCreateErr(error.response.data))
        openNotificationWithIcon('error', error.response.data.tips)
      } else {
        console.log('Error', error.message)
      }
    })
  }
}

function deleteChannelGift(data) {
  return (dispatch, getState) => {

    dispatch(requestChannelGiftDelete())
    const url = `/huo/products/${data.path.productId}/cdkeyactivities/channelgift/link`
    AxiosAPI({
      method: 'DELETE',
      url: url,
      data: data.form,
    }).then(response => {
      dispatch(receiveChannelGiftDelete(response))
      openNotificationWithIcon('success', '删除成功')
    }).catch(error => {
      if (error.response) {
        dispatch(requestChannelGiftDeleteErr(error.response.data))
        openNotificationWithIcon('error', error.response.data.tips)
      } else {
        console.log('Error', error.message)
      }
    })
  }
}

export {
  clearCDKeys,
  fetchCDKeys,
  createCDKey,
  updateCDKey,
  generateCDKey,
  keepCDKey,
  fetchGenerateLog,
  queryCDKey,
  fetchChannelGifts,
  clearChannelGifts,
  createChannelGift,
  deleteChannelGift
}

// ------------------------------------
// Action Handlers
// ------------------------------------
const ACTION_HANDLERS = {
  [CDKEY_LIST_REQUEST]: (state) => {
    return ({
      ...state,
      fetching: true,
      err: false,
      errMes: {},
      list: []
    })
  },
  [CDKEY_LIST_REQUEST_ERR]: (state, action) => {
    return ({
      ...state,
      fetching: false,
      err: true,
      errMes: { tips: action.payload.response.data.tips }
    })
  },
  [CDKEY_LIST_RECEIVE]: (state, action) => {
    return ({
      ...state,
      fetching: false,
      list: action.payload.data.domainObject
    })
  },
  [CDKEY_LIST_CLEAR]: (state) => {
    return ({
      ...state,
      fetching: false,
      err: false,
      errMes: {},
      list: []
    })
  },
  [CDKEY_CREATE_REQUEST]: (state) => {
    return ({
      ...state,
      fetching: true,
      err: false,
      errMes: {},
      create: {}
    })
  },
  [CDKEY_CREATE_REQUEST_ERR]: (state, action) => {
    return ({
      ...state,
      fetching: false,
      err: true,
      errMes: action.payload ? { tips: action.payload.response.data.tips } : {}
    })
  },
  [CDKEY_CREATE_RECEIVE]: (state, action) => {
    const list = state.list
    const data = action.payload.data
    return ({
      ...state,
      fetching: false,
      list: [{...data}, ...list],
      create: {...data}
    })
  },
  [CDKEY_UPDATE_REQUEST]: (state) => {
    return ({
      ...state,
      fetching: true,
      err: false,
      errMes: {},
      update: {}
    })
  },
  [CDKEY_UPDATE_REQUEST_ERR]: (state, action) => {
    return ({
      ...state,
      fetching: false,
      err: true,
      errMes: action.payload ? { tips: action.payload.response.data.tips } : {}
    })
  },
  [CDKEY_UPDATE_RECEIVE]: (state, action) => {
    const list = [...state.list]
    const cdkey = action.payload.data
    _.map(list, (val, index) => {
      if (cdkey.activityId && val.activityId === cdkey.activityId) {
        Object.assign(val, cdkey)
      }
    })
    return ({
      ...state,
      fetching: false,
      list: [...list],
      update: cdkey
    })
  },
  [CDKEY_GENERATE_REQUEST]: (state) => {
    return ({
      ...state,
      fetching: true,
      err: false,
      errMes: {},
      generate: {}
    })
  },
  [CDKEY_GENERATE_REQUEST_ERR]: (state, action) => {
    return ({
      ...state,
      fetching: false,
      err: true,
      errMes: action.payload ? { tips: action.payload.response.data.tips } : {}
    })
  },
  [CDKEY_GENERATE_RECEIVE]: (state, action) => {
    return ({
      ...state,
      fetching: false,
      generate: action.payload.data
    })
  },
  [CDKEY_GENERATE_LOG_REQUEST]: (state) => {
    return ({
      ...state,
      fetching: true,
      err: false,
      errMes: {},
      generateLogs: []
    })
  },
  [CDKEY_GENERATE_LOG_REQUEST_ERR]: (state, action) => {
    return ({
      ...state,
      fetching: false,
      err: true,
      errMes: { tips: action.payload.response.data.tips } || {}
    })
  },
  [CDKEY_GENERATE_LOG_RECEIVE]: (state, action) => {
    return ({
      ...state,
      fetching: false,
      generateLogs: action.payload.data.domainObject || []
    })
  },
  [CDKEY_QUERY_REQUEST]: (state) => {
    return ({
      ...state,
      fetching: true,
      err: false,
      errMes: {},
      query: {}
    })
  },
  [CDKEY_QUERY_REQUEST_ERR]: (state, action) => {
    return ({
      ...state,
      fetching: false,
      err: true,
      errMes: action.payload ? { tips: action.payload.response.data.tips } : {}
    })
  },
  [CDKEY_QUERY_RECEIVE]: (state, action) => {
    return ({
      ...state,
      fetching: false,
      query: action.payload.data.domainObject || {}
    })
  },
  [CDKEY_CHANNEL_GIFT_REQUEST]: (state) => {
    return ({
      ...state,
      fetching: true,
      err: false,
      errMes: {},
      channel: []
    })
  },
  [CDKEY_CHANNEL_GIFT_RECEIVE]: (state, action) => {
    return ({
      ...state,
      fetching: false,
      channel: action.payload.data.domainObject
    })
  },
  [CDKEY_CHANNEL_GIFT_CLEAR]: (state) => {
    return ({
      ...state,
      fetching: false,
      err: false,
      errMes: {},
      channel: []
    })
  },
  [CDKEY_CHANNEL_GIFT_REQUEST_ERR]: (state, action) => {
    return ({
      ...state,
      fetching: false,
      err: true,
      errMes: action.payload ? { tips: action.payload.response.data.tips } : {}
    })
  },
  [CDKEY_CHANNEL_GIFT_CREATE_REQUEST]: (state) => {
    return ({
      ...state,
      fetching: true,
      err: false,
      errMes: {},
      createGift: {}
    })
  },
  [CDKEY_CHANNEL_GIFT_CREATE_REQUEST_ERR]: (state, action) => {
    return ({
      ...state,
      fetching: false,
      err: true,
      errMes: action.payload ? { tips: action.payload.response.data.tips } : {}
    })
  },
  [CDKEY_CHANNEL_GIFT_CREATE_RECEIVE]: (state, action) => {
    return ({
      ...state,
      fetching: false,
      createGift: action.payload.data
    })
  },
  [CDKEY_CHANNEL_GIFT_DELETE_REQUEST]: (state) => {
    return ({
      ...state,
      fetching: true,
      err: false,
      errMes: {},
      deleteGift: {}
    })
  },
  [CDKEY_CHANNEL_GIFT_DELETE_REQUEST_ERR]: (state, action) => {
    return ({
      ...state,
      fetching: false,
      err: true,
      errMes: action.payload ? { tips: action.payload.response.data.tips } : {}
    })
  },
  [CDKEY_CHANNEL_GIFT_DELETE_RECEIVE]: (state, action) => {
    state.channel = _.filter(state.channel, (v, i) => v.cdkey !== action.payload.data.cdkey)
    return ({
      ...state,
      fetching: false,
      deleteGift: action.payload.data
    })
  },
  [CDKEY_KEEPING]: (state, action) => {
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
  create: {},
  update: {},
  generate: {},
  generateLogs: [],
  query: {},
  channel: [],
  createGift: {},
  deleteGift: {},
  keeping: {}
}

export default function(state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type]

  return handler ? handler(state, action) : state
}
