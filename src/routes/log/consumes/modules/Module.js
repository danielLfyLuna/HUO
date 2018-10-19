
import AxiosAPI from '../../../../../utils/axios-api'
import openNotificationWithIcon from '../../../../base/components/Notification'
import alertInfo from '../components/alert'

// ------------------------------------
// Constants
// ------------------------------------
const RECEIVE_LOG_CONSUMES = 'RECEIVE_LOG_CONSUMES'
const REQUEST_LOG_CONSUMES = 'REQUEST_LOG_CONSUMES'
const CLEAR_LOG_CONSUMES = 'CLEAR_LOG_CONSUMES'

const REQUEST_EXPORT_LOG_CONSUMES = 'REQUEST_EXPORT_LOG_CONSUMES'
const RECEIVE_EXPORT_LOG_CONSUMES = 'RECEIVE_EXPORT_LOG_CONSUMES'

const REQUEST_ERR_CONSUMES = 'REQUEST_ERR_CONSUMES'

const RECEIVE_CONSUME_SOURCES = 'RECEIVE_CONSUME_SOURCES'
// const CLEAR_CONSUME_SOURCES = 'CLEAR_CONSUME_SOURCES'


// const RECEIVE_PRODUCE_SOURCES = 'RECEIVE_PRODUCE_SOURCES'
// const CLEAR_PRODUCE_SOURCES = 'CLEAR_PRODUCE_SOURCES'

const SOURCES_ERR = 'SOURCES_ERR'
const KEEP_INITIAL_CONSUME = 'KEEP_INITIAL_CONSUME'
// ------------------------------------
// Consumes
// ------------------------------------

function requestLogConsumes() {
  return {
    type: REQUEST_LOG_CONSUMES
  }
}

function receiveLogConsumes(data) {
  return {
    type: RECEIVE_LOG_CONSUMES,
    payload: data
  }
}

function clearLogConsumes() {
  return {
    type: CLEAR_LOG_CONSUMES
  }
}

function requestExportLogConsumes() {
  return {
    type: REQUEST_EXPORT_LOG_CONSUMES
  }
}

function receiveExportLogConsumes(item) {
  return {
    type: RECEIVE_EXPORT_LOG_CONSUMES,
    payload: item
  }
}

function requestErr(data) {
  return {
    type: REQUEST_ERR_CONSUMES,
    payload: data
  }
}

function keepInitial(data) {
  return {
    type: KEEP_INITIAL_CONSUME,
    payload: data
  }
}

function fetchLogConsumes(data) {
  return (dispatch, getState) => {
    // 验证从复提交
    dispatch(requestLogConsumes())
    const url = `/huo/logs/consumes`
    AxiosAPI({
      method: 'GET',
      url: url,
      params: data.params
    }).then(response => {
      dispatch(receiveLogConsumes(response))
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

function exportLogConsumes(data) {
  return (dispatch, getState) => {

    dispatch(requestExportLogConsumes())
    openNotificationWithIcon('success', '正在导出,请稍后')
    const url = `/huo/logs/consumes/export/batch`
    AxiosAPI({
      method: 'POST',
      url: url,
      data: data.form.list,
    }).then(response => {
      dispatch(receiveExportLogConsumes(response))
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

function receiveConsumeSources(data) {
  return {
    type: RECEIVE_CONSUME_SOURCES,
    payload: data
  }
}

function requestSourcesErr(data) {
  return {
    type: SOURCES_ERR,
    payload: data
  }
}

function consumeSources() {
  return (dispatch, getState) => {

    const url = `/huo/logs/logsource/2`
    AxiosAPI({
      method: 'GET',
      url: url,
    }).then(response => {
      dispatch(receiveConsumeSources(response))
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
  consumeSources,
  exportLogConsumes,
  fetchLogConsumes,
  clearLogConsumes,
  keepInitial
}

// ------------------------------------
// Consume Handlers
// ------------------------------------
const CONSUME_HANDLERS = {
  [REQUEST_LOG_CONSUMES]: (state) => {
    return ({
      ...state,
      fetching: true
    })
  },
  [RECEIVE_LOG_CONSUMES]: (state, action) => {
    return ({
      ...state,
      fetching: false,
      consumes: action.payload.data ? action.payload.data : {}
    })
  },
  [CLEAR_LOG_CONSUMES]: (state) => {
    return ({
      ...state,
      fetching: false,
      consumes: {},
      error: null
    })
  },
  [REQUEST_EXPORT_LOG_CONSUMES]: (state) => {
    return ({
      ...state,
      fetching: true
    })
  },
  [RECEIVE_EXPORT_LOG_CONSUMES]: (state, action) => {
    return ({
      ...state,
      fetching: false,
      consumes: {}
    })
  },
  [REQUEST_ERR_CONSUMES]: (state, action) => {
    return ({
      ...state,
      fetching: false,
      error: { tips: action.payload.tips }
    })
  },
  [RECEIVE_CONSUME_SOURCES]: (state, action) => {
    return ({
      ...state,
      consumeSources: action.payload.data.domainObject
    })
  },
  [SOURCES_ERR]: (state, action) => {
    return ({
      ...state,
      sourceError: { tips: action.payload.tips }
    })
  },
  [KEEP_INITIAL_CONSUME]: (state, action) => {
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
  consumes: {},
  error: null,
  consumeSources: {},
  sourceError: null,
  productId: null,
  keeping: {}
}

  export default function(state = initialState, consume) {
  const handler = CONSUME_HANDLERS[consume.type]

  return handler
    ? handler(state, consume)
    : state
}
