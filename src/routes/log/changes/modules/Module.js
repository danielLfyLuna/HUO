
import AxiosAPI from '../../../../../utils/axios-api'
import openNotificationWithIcon from '../../../../base/components/Notification'
import alertInfo from '../components/alert'

// ------------------------------------
// Constants
// ------------------------------------
const RECEIVE_DATACHANGE = 'RECEIVE_DATACHANGE'
const REQUEST_DATACHANGE = 'REQUEST_DATACHANGE'
const CLEAR_DATACHANGE = 'CLEAR_DATACHANGE'

const REQUEST_EXPORT_DATACHANGE = 'REQUEST_EXPORT_DATACHANGE'
const RECEIVE_EXPORT_DATACHANGE = 'RECEIVE_EXPORT_DATACHANGE'

const REQUEST_ERR_DATACHANGE = 'REQUEST_ERR_DATACHANGE'

const RECEIVE_DATACHANGE_SOURCE = 'RECEIVE_DATACHANGE_SOURCE'
const CLEAR_DATACHANGE_SOURCE = 'CLEAR_DATACHANGE_SOURCE'

const DATACHANGE_SOURCE_ERR = 'DATACHANGE_SOURCE_ERR'

const KEEP_INITIAL_DATACHANGE = 'KEEP_INITIAL_DATACHANGE'
// ------------------------------------
// Produces
// ------------------------------------

function requestDatachange() {
  return {
    type: REQUEST_DATACHANGE
  }
}

function receiveDatachange(data) {
  return {
    type: RECEIVE_DATACHANGE,
    payload: data
  }
}

function clearDatachange() {
  return {
    type: CLEAR_DATACHANGE
  }
}

function requestExportDatachange() {
  return {
    type: REQUEST_EXPORT_DATACHANGE
  }
}

function receiveExportDatachange(item) {
  return {
    type: RECEIVE_EXPORT_DATACHANGE,
    payload: item
  }
}

function requestErr(data) {
  return {
    type: REQUEST_ERR_DATACHANGE,
    payload: data
  }
}

function keepInitial(data) {
  return {
    type: KEEP_INITIAL_DATACHANGE,
    payload: data
  }
}

function fetchDatachange(data = {}) {
  return (dispatch, getState) => {
    // 验证从复提交
    dispatch(requestDatachange())
    const url = `/huo/logs/datachanges`
    AxiosAPI({
      method: 'GET',
      url: url,
      params: data.params,
    }).then(response => {
      dispatch(receiveDatachange(response))
      if (response.data.domainObject.length == 0) {
        openNotificationWithIcon('success', '查询成功，没有相关数据')
      }
    }).catch(error => {
      if (error.response) {
        dispatch(requestErr(error.response.data))
        openNotificationWithIcon('error', '查询失败', error.response.data.tips)
      } else {
        console.log('Error', error.message)
      }
    })
  }
}

function exportDatachange(data) {
  return (dispatch, getState) => {

    dispatch(requestExportDatachange())
    openNotificationWithIcon('success', '正在导出,请稍后')
    const url = `/huo/logs/datachanges/export/batch`
    AxiosAPI({
      method: 'POST',
      url: url,
      data: data.form,
    }).then(response => {
      dispatch(receiveExportDatachange(response))
      openNotificationWithIcon('success', '导出成功')
      alertInfo(response)
    }).catch(error => {
      if (error.response) {
        dispatch(requestErr(error.response.data))
        openNotificationWithIcon('error', '导出失败', error.response.data.tips)
      } else {
        console.log('Error', error.message)
      }
    })
  }
}

function clearSource() {
  return {
    type: CLEAR_DATACHANGE_SOURCE
  }
}

function receiveSource(data) {
  return {
    type: RECEIVE_DATACHANGE_SOURCE,
    payload: data
  }
}

function sourceErr(data) {
  return {
    type: DATACHANGE_SOURCE_ERR,
    payload: data
  }
}

function datachangeSources() {
  return (dispatch, getState) => {
    const url = `/huo/logs/logsource/4`
    AxiosAPI({
      method: 'GET',
      url: url,
    }).then(response => {
      dispatch(receiveSource(response))
    }).catch(error => {
      if (error.response) {
        dispatch(sourceErr(error.response.data))
      } else {
        console.log('Error', error.message)
      }
    })
  }
}

export {
  datachangeSources,
  clearSource,
  clearDatachange,
  fetchDatachange,
  exportDatachange,
  keepInitial
}

// ------------------------------------
// Produce Handlers
// ------------------------------------
const PRODUCE_HANDLERS = {
  [REQUEST_DATACHANGE]: (state) => {
    return ({
      ...state,
      fetching: true
    })
  },
  [RECEIVE_DATACHANGE]: (state, action) => {
    return ({
      ...state,
      fetching: false,
      list: action.payload.data ? action.payload.data : {}
    })
  },
  [CLEAR_DATACHANGE]: (state) => {
    return ({
      ...state,
      fetching: false,
      list: {},
      error: null,
      sourceError: null
    })
  },
  [REQUEST_EXPORT_DATACHANGE]: (state) => {
    return ({
      ...state,
      fetching: true
    })
  },
  [RECEIVE_EXPORT_DATACHANGE]: (state, action) => {
    return ({
      ...state,
      fetching: false
    })
  },
  [REQUEST_ERR_DATACHANGE]: (state, action) => {
    return ({
      ...state,
      fetching: false,
      error: { tips: action.payload.tips }
    })
  },

  [CLEAR_DATACHANGE_SOURCE]: (state) => {
    return ({
      ...state,
      source: [],
      sourceError: null
    })
  },
  [RECEIVE_DATACHANGE_SOURCE]: (state, action) => {
    return ({
      ...state,
      source: action.payload.data.domainObject
    })
  },
  [DATACHANGE_SOURCE_ERR]: (state, action) => {
    return ({
      ...state,
      sourceError: { tips: action.payload.tips }
    })
  },
  [KEEP_INITIAL_DATACHANGE]: (state, action) => {
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
  list: {},
  error: null,
  source: {},
  sourceError: null,
  keeping: {}
}

export default function(state = initialState, action) {
const handler = PRODUCE_HANDLERS[action.type]

return handler ? handler(state, action) : state
}
