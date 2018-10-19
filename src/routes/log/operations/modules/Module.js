import AxiosAPI from '../../../../../utils/axios-api'
import openNotificationWithIcon from '../../../../base/components/Notification'
import alertInfo from '../components/alert'

// ------------------------------------
// Constants
// ------------------------------------
const RECEIVE_LOG_OPERATIONS = 'RECEIVE_LOG_OPERATIONS'
const REQUEST_LOG_OPERATIONS = 'REQUEST_LOG_OPERATIONS'
const CLEAR_LOG_OPERATIONS = 'CLEAR_LOG_OPERATIONS'

const REQUEST_EXPORT_LOG_OPERATIONS = 'REQUEST_EXPORT_LOG_OPERATIONS'
const RECEIVE_EXPORT_LOG_OPERATIONS = 'RECEIVE_EXPORT_LOG_OPERATIONS'

const REQUEST_ERR = 'REQUEST_ERR'

const RECEIVE_OPERATION_SOURCES = 'RECEIVE_OPERATION_SOURCES'
const CLEAR_OPERATION_SOURCES = 'CLEAR_OPERATION_SOURCES'

const SOURCES_ERR = 'SOURCES_ERR'

const KEEP_INITIAL_OPERATION = 'KEEP_INITIAL_OPERATION'
// ------------------------------------
// Operations
// ------------------------------------

function requestLogOperations() {
  return {
    type: REQUEST_LOG_OPERATIONS
  }
}

function receiveLogOperations(data) {
  return {
    type: RECEIVE_LOG_OPERATIONS,
    payload: data
  }
}

function clearLogOperations() {
  return {
    type: CLEAR_LOG_OPERATIONS
  }
}

function requestExportLogOperations() {
  return {
    type: REQUEST_EXPORT_LOG_OPERATIONS
  }
}

function receiveExportLogOperations(item) {
  return {
    type: RECEIVE_EXPORT_LOG_OPERATIONS,
    payload: item
  }
}

function requestErr(data) {
  return {
    type: REQUEST_ERR,
    payload: data
  }
}

function keepInitial(data) {
  return {
    type: KEEP_INITIAL_OPERATION,
    payload: data
  }
}

function fetchLogOperations(data = {}) {
  return (dispatch, getState) => {
    // 验证从复提交
    dispatch(requestLogOperations())
    const url = `/huo/logs/operations`
    AxiosAPI({
      method: 'GET',
      url: url,
      params: data.params
    }).then(response => {
      dispatch(receiveLogOperations(response))
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

function exportLogOperations(data) {
  return (dispatch, getState) => {

    dispatch(requestExportLogOperations())
    openNotificationWithIcon('success', '正在导出,请稍后')
    const url = `/huo/logs/operations/export/batch`
    AxiosAPI({
      method: 'POST',
      url: url,
      data: data.form,
    }).then(response => {
      dispatch(receiveExportLogOperations(response))
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

function receiveOperationSources(data) {
  return {
    type: RECEIVE_OPERATION_SOURCES,
    payload: data
  }
}

function requestSourcesErr(data) {
  return {
    type: REQUEST_ERR,
    payload: data
  }
}

function operationSources() {
  return (dispatch, getState) => {

    const url = `/huo/logs/logsource/3`
    AxiosAPI({
      method: 'GET',
      url: url,
    }).then(response => {
      dispatch(receiveOperationSources(response))
    }).catch(error => {
      if (error.response) {
        dispatch(requestSourcesErr(error.response.data))
      } else {
        console.log('Error', error.message)
      }
    })
  }
}

export {
  fetchLogOperations,
  exportLogOperations,
  operationSources,
  clearLogOperations,
  keepInitial
}

// ------------------------------------
// Operation Handlers
// ------------------------------------
const OPERATION_HANDLERS = {
  [REQUEST_LOG_OPERATIONS]: (state) => {
    return ({
      ...state,
      fetching: true
    })
  },
  [RECEIVE_LOG_OPERATIONS]: (state, action) => {
    return ({
      ...state,
      fetching: false,
      operations: action.payload.data ? action.payload.data : {}
    })
  },
  [CLEAR_LOG_OPERATIONS]: (state) => {
    return ({
      ...state,
      fetching: false,
      operations: {},
      error: null
    })
  },
  [REQUEST_EXPORT_LOG_OPERATIONS]: (state) => {
    return ({
      ...state,
      fetching: true
    })
  },
  [RECEIVE_EXPORT_LOG_OPERATIONS]: (state, action) => {
    return ({
      ...state,
      fetching: false,
      operations: {}
    })
  },
  [REQUEST_ERR]: (state, action) => {
    return ({
      ...state,
      fetching: false,
      error: { tips: action.payload.tips }
    })
  },
  [CLEAR_OPERATION_SOURCES]: (state) => {
    return ({
      ...state,
      operationSources: [],
      sourceError: null
    })
  },
  [RECEIVE_OPERATION_SOURCES]: (state, action) => {
    return ({
      ...state,
      operationSources: action.payload.data.domainObject
    })
  },
  [SOURCES_ERR]: (state, action) => {
    return ({
      ...state,
      sourceError: { tips: action.payload.tips }
    })
  },
  [KEEP_INITIAL_OPERATION]: (state, action) => {
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
  operations: {},
  error: null,
  operationSources: {},
  sourceError: null,
  productId: null,
  keeping: {}
}

  export default function(state = initialState, operation) {
  const handler = OPERATION_HANDLERS[operation.type]

  return handler
    ? handler(state, operation)
    : state
}
