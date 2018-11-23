/* global API_HOST */
import AxiosAPI from '../../../../../utils/axios-api'
import openNotificationWithIcon from '../../../../base/components/Notification'

// ------------------------------------
// Constants
// ------------------------------------
const ACTION_LIST_REQUEST = 'ACTION_LIST_REQUEST'
const ACTION_LIST_REQUEST_ERR = 'ACTION_LIST_REQUEST_ERR'
const ACTION_LIST_RECEIVE = 'ACTION_LIST_RECEIVE'

const ACTION_EXPORT_REQUEST = 'ACTION_EXPORT_REQUEST'
const ACTION_EXPORT_RECEIVE = 'ACTION_EXPORT_RECEIVE'

const ACTION_OPERATES_RECEIVE = 'ACTION_OPERATES_RECEIVE'
const ACTION_CONSUMES_RECEIVE = 'ACTION_CONSUMES_RECEIVE'
const ACTION_PRODUCES_RECEIVE = 'ACTION_PRODUCES_RECEIVE'

const ACTION_KEEPING = 'ACTION_KEEPING'
// ------------------------------------
// Actions
// ------------------------------------

function keepAction(data) {
  return {
    type: ACTION_KEEPING,
    payload: data
  }
}

function requestActions() {
  return {
    type: ACTION_LIST_REQUEST
  }
}

function requestActionsErr(data) {
  return {
    type: ACTION_LIST_REQUEST_ERR,
    payload: data
  }
}

function receiveActions(data) {
  return {
    type: ACTION_LIST_RECEIVE,
    payload: data
  }
}

function fetchLogActions(data = {}) {
  return (dispatch, getState) => {
    // 验证从复提交
    dispatch(requestActions())
    const url = '/huo/logs/actions'
    AxiosAPI({
      method: 'GET',
      url: url,
      params: data.params
    }).then(response => {
      dispatch(receiveActions(response))
      if (response.data.domainObject.length == 0) {
        openNotificationWithIcon('success', '查询成功，没有相关数据')
      }
    }).catch(error => {
      if (error.response) {
        dispatch(requestActionsErr(error.response.data))
        openNotificationWithIcon('error', '查询失败', error.response.data.tips)
      } else {
        console.log('Error', error.message)
      }
    })
  }
}

function requestActionExpor() {
  return {
    type: ACTION_EXPORT_REQUEST
  }
}

function receiveActionExpor(item) {
  const data = window.open(`${API_HOST}/huo/${item.data.downloadLink}`)
  return {
    type: ACTION_EXPORT_RECEIVE,
    payload: data
  }
}

function exportLogActions(data) {
  return (dispatch, getState) => {

    dispatch(requestActionExpor())
    openNotificationWithIcon('success', '正在导出,请稍后')
    const url = '/huo/logs/actions/export'
    AxiosAPI({
      method: 'POST',
      url: url,
      data: data.form,
    }).then(response => {
      dispatch(receiveActionExpor(response))
      openNotificationWithIcon('success', '导出成功')
    }).catch(error => {
      if (error.response) {
        dispatch(requestActionsErr(error.response.data))
        openNotificationWithIcon('error', '导出失败', error.response.data.tips)
      } else {
        console.log('Error', error.message)
      }
    })
  }
}

function receiveOperates(data) {
  return {
    type: ACTION_OPERATES_RECEIVE,
    payload: data
  }
}

function receiveConsumes(data) {
  return {
    type: ACTION_CONSUMES_RECEIVE,
    payload: data
  }
}

function receiveProduces(data) {
  return {
    type: ACTION_PRODUCES_RECEIVE,
    payload: data
  }
}

function fetchOperateType() {
  return async (dispatch, getState) => {

    const url = '/huo/logs/logsource/3'
    try {
      const response = await AxiosAPI.get(url)
      dispatch(receiveOperates(response))
    } catch (error) {
      console.log('Error', error.message)
    }
  }
}

function fetchConsumeSources() {
  return async (dispatch, getState) => {

    const url = '/huo/logs/logsource/2'
    try {
      const response = await AxiosAPI.get(url)
      dispatch(receiveConsumes(response))
    } catch (error) {
      console.log('Error', error.message)
    }
  }
}

function fetchProduceSources() {
  return async (dispatch, getState) => {

    const url = '/huo/logs/logsource/1'
    try {
      const response = await AxiosAPI.get(url)
      dispatch(receiveProduces(response))
    } catch (error) {
      console.log('Error', error.message)
    }
  }
}

export {
  keepAction,
  fetchLogActions,
  exportLogActions,
  fetchOperateType,
  fetchConsumeSources,
  fetchProduceSources
}

// ------------------------------------
// Action Handlers
// ------------------------------------
const ACTION_HANDLERS = {
  [ACTION_LIST_REQUEST]: (state) => {
    return ({
      ...state,
      fetching: true,
      err: false,
      errMsg: {},
      actions: []
    })
  },
  [ACTION_LIST_REQUEST_ERR]: (state, action) => {
    return ({
      ...state,
      fetching: false,
      err: true,
      errMsg: { tips: action.payload.tips }
    })
  },
  [ACTION_LIST_RECEIVE]: (state, action) => {
    return ({
      ...state,
      fetching: false,
      actions: action.payload.data ? action.payload.data.domainObject : []
    })
  },
  [ACTION_EXPORT_REQUEST]: (state) => {
    return ({
      ...state,
      fetching: true,
      err: false,
      errMsg: {}
    })
  },
  [ACTION_EXPORT_RECEIVE]: (state, action) => {
    return ({
      ...state,
      fetching: false
    })
  },
  [ACTION_OPERATES_RECEIVE]: (state, action) => {
    return ({
      ...state,
      fetching: false,
      operates: action.payload.data.domainObject
    })
  },
  [ACTION_CONSUMES_RECEIVE]: (state, action) => {
    return ({
      ...state,
      fetching: false,
      consumes: action.payload.data.domainObject
    })
  },
  [ACTION_PRODUCES_RECEIVE]: (state, action) => {
    return ({
      ...state,
      fetching: false,
      produces: action.payload.data.domainObject
    })
  },
  [ACTION_KEEPING]: (state, action) => {
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
  err: null,
  errMsg: {},
  actions: [],
  operates: [],
  consumes: [],
  produces: [],
  keeping: {}
}

  export default function(state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type]

  return handler
    ? handler(state, action)
    : state
}
