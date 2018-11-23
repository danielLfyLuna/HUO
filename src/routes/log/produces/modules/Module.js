
import AxiosAPI from '../../../../../utils/axios-api'
import openNotificationWithIcon from '../../../../base/components/Notification'
import alertInfo from '../components/alert'

// ------------------------------------
// Constants
// ------------------------------------
const RECEIVE_LOG_PRODUCES = 'RECEIVE_LOG_PRODUCES'
const REQUEST_LOG_PRODUCES = 'REQUEST_LOG_PRODUCES'
const CLEAR_LOG_PRODUCES = 'CLEAR_LOG_PRODUCES'

const REQUEST_EXPORT_LOG_PRODUCES = 'REQUEST_EXPORT_LOG_PRODUCES'
const RECEIVE_EXPORT_LOG_PRODUCES = 'RECEIVE_EXPORT_LOG_PRODUCES'

const REQUEST_ERR_PRODUCES = 'REQUEST_ERR_PRODUCES'

const RECEIVE_PRODUCE_SOURCES = 'RECEIVE_PRODUCE_SOURCES'
const CLEAR_PRODUCE_SOURCES = 'CLEAR_PRODUCE_SOURCES'

const SOURCES_ERR = 'SOURCES_ERR'

const KEEP_INITIAL_PRODUCE = 'KEEP_INITIAL_PRODUCE'

// ------------------------------------
// Produces
// ------------------------------------

function requestLogProduces() {
  return {
    type: REQUEST_LOG_PRODUCES
  }
}

function receiveLogProduces(data) {
  return {
    type: RECEIVE_LOG_PRODUCES,
    payload: data
  }
}

function clearLogProduces() {
  return {
    type: CLEAR_LOG_PRODUCES
  }
}

function requestExportLogProduces() {
  return {
    type: REQUEST_EXPORT_LOG_PRODUCES
  }
}

function receiveExportLogProduces(item) {
  return {
    type: RECEIVE_EXPORT_LOG_PRODUCES,
    payload: item
  }
}

function requestErr(data) {
  return {
    type: REQUEST_ERR_PRODUCES,
    payload: data
  }
}

function keepInitial(data) {
  return {
    type: KEEP_INITIAL_PRODUCE,
    payload: data
  }
}

function fetchLogProduces(data = {}) {
  return (dispatch, getState) => {
    // 验证从复提交
    dispatch(requestLogProduces())
    const url = '/huo/logs/produces'
    AxiosAPI({
      method: 'GET',
      url: url,
      params: data.params
    }).then(response => {
      dispatch(receiveLogProduces(response))
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

function exportLogProduces(data) {
  return (dispatch, getState) => {

    dispatch(requestExportLogProduces())
    openNotificationWithIcon('success', '正在导出,请稍后')
    const url = '/huo/logs/produces/export/batch'
    AxiosAPI({
      method: 'POST',
      url: url,
      data: data.form,
    }).then(response => {
      dispatch(receiveExportLogProduces(response))
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

export function clearProduceSources() {
  return {
    type: CLEAR_PRODUCE_SOURCES
  }
}

function receiveProduceSources(data) {
  return {
    type: RECEIVE_PRODUCE_SOURCES,
    payload: data
  }
}

function requestSourcesErr(data) {
  return {
    type: SOURCES_ERR,
    payload: data
  }
}

function produceSources() {
  return (dispatch, getState) => {

    const url = '/huo/logs/logsource/1'
    AxiosAPI({
      method: 'GET',
      url: url,
    }).then(response => {
      dispatch(receiveProduceSources(response))
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
  produceSources,
  clearLogProduces,
  fetchLogProduces,
  exportLogProduces,
  keepInitial
}

// ------------------------------------
// Produce Handlers
// ------------------------------------
const PRODUCE_HANDLERS = {
  [REQUEST_LOG_PRODUCES]: (state) => {
    return ({
      ...state,
      fetching: true
    })
  },
  [RECEIVE_LOG_PRODUCES]: (state, action) => {
    return ({
      ...state,
      fetching: false,
      produces: action.payload.data ? action.payload.data : {}
    })
  },
  [CLEAR_LOG_PRODUCES]: (state) => {
    return ({
      ...state,
      fetching: false,
      produces: {},
      error: null
    })
  },
  [REQUEST_EXPORT_LOG_PRODUCES]: (state) => {
    return ({
      ...state,
      fetching: true
    })
  },
  [RECEIVE_EXPORT_LOG_PRODUCES]: (state, action) => {
    return ({
      ...state,
      fetching: false,
      produces: {}
    })
  },
  [REQUEST_ERR_PRODUCES]: (state, action) => {
    return ({
      ...state,
      fetching: false,
      error: { tips: action.payload.tips }
    })
  },
  [CLEAR_PRODUCE_SOURCES]: (state) => {
    return ({
      ...state,
      produceSources: [],
      sourceError: null
    })
  },
  [RECEIVE_PRODUCE_SOURCES]: (state, action) => {
    return ({
      ...state,
      produceSources: action.payload.data.domainObject
    })
  },
  [SOURCES_ERR]: (state, action) => {
    return ({
      ...state,
      sourceError: { tips: action.payload.tips }
    })
  },
  [KEEP_INITIAL_PRODUCE]: (state, action) => {
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
  produces: {},
  error: null,
  produceSources: {},
  sourceError: null,
  productId: null,
  keeping: {}
}

  export default function(state = initialState, produce) {
  const handler = PRODUCE_HANDLERS[produce.type]

  return handler
    ? handler(state, produce)
    : state
}
