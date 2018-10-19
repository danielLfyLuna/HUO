/* global API_HOST */
import AxiosAPI from '../../../../../utils/axios-api'
import openNotificationWithIcon from '../../../../base/components/Notification'

// ------------------------------------
// Constants
// ------------------------------------
const ORDERS_REQUEST = 'ORDERS_REQUEST'
const ORDERS_REQUEST_ERR = 'ORDERS_REQUEST_ERR'
const ORDERS_RECEIVE = 'ORDERS_RECEIVE'
const ORDERS_CLEAR = 'ORDERS_CLEAR'

const ORDERS_EXPORT_REQUEST = 'ORDERS_EXPORT_REQUEST'
const ORDERS_EXPORT_REQUEST_ERR = 'ORDERS_EXPORT_REQUEST_ERR'
const ORDERS_EXPROT_RECEIVE = 'ORDERS_EXPROT_RECEIVE'

const ORDERS_REPAIR_REQUEST = 'ORDERS_REPAIR_REQUEST'
const ORDERS_REPAIR_REQUEST_ERR = 'ORDERS_REPAIR_REQUEST_ERR'
const ORDERS_REPAIR_RECEIVE = 'ORDERS_REPAIR_RECEIVE'

const RECHARGE_REQUEST = 'RECHARGE_REQUEST'
const RECHARGE_REQUEST_ERR = 'RECHARGE_REQUEST_ERR'
const RECHARGE_RECEIVE = 'RECHARGE_RECEIVE'

const RECHARGE_MAP_REQUEST = 'RECHARGE_MAP_REQUEST'
const RECHARGE_MAP_REQUEST_ERR = 'RECHARGE_MAP_REQUEST_ERR'
const RECHARGE_MAP_RECEIVE = 'RECHARGE_MAP_RECEIVE'

const RECHARGE_LOG_REQUEST = 'RECHARGE_LOG_REQUEST'
const RECHARGE_LOG_REQUEST_ERR = 'RECHARGE_LOG_REQUEST_ERR'
const RECHARGE_LOG_RECEIVE = 'RECHARGE_LOG_RECEIVE'

const RECHARGE_RESET_REQUEST = 'RECHARGE_RESET_REQUEST'
const RECHARGE_RESET_REQUEST_ERR = 'RECHARGE_RESET_REQUEST_ERR'
const RECHARGE_RESET_RECEIVE = 'RECHARGE_RESET_RECEIVE'

const RECHARGE_MONTHCARD_REQUEST = 'RECHARGE_MONTHCARD_REQUEST'
const RECHARGE_MONTHCARD_ERR = 'RECHARGE_MONTHCARD_ERR'
const RECHARGE_MONTHCARD_RECEIVE = 'RECHARGE_MONTHCARD_RECEIVE'

const RATES_REQUEST = 'RATES_REQUEST'
const RATES_REQUEST_ERR = 'RATES_REQUEST_ERR'
const RATES_RECEIVE = 'RATES_RECEIVE'
const RATES_CLEAR = 'RATES_CLEAR'

const RATES_CREATE_REQUEST = 'RATES_CREATE_REQUEST'
const RATES_CREATE_REQUEST_ERR = 'RATES_CREATE_REQUEST_ERR'
const RATES_CREATE_RECEIVE = 'RATES_CREATE_RECEIVE'

const RATES_DELETE_REQUEST = 'RATES_DELETE_REQUEST'
const RATES_DELETE_REQUEST_ERR = 'RATES_DELETE_REQUEST_ERR'
const RATES_DELETE_RECEIVE = 'RATES_DELETE_RECEIVE'

const RECHARGE_KEEPING = 'RECHARGE_KEEPING'

// ------------------------------------
// Actions
// ------------------------------------

function requestOrders() {
  return {
    type: ORDERS_REQUEST
  }
}

function requestOrdersErr(data) {
  return {
    type: ORDERS_REQUEST_ERR,
    payload: data
  }
}

function receiveOrders(data) {
  return {
    type: ORDERS_RECEIVE,
    payload: data
  }
}

function clearOrders() {
  return {
    type: ORDERS_CLEAR
  }
}

function requestOrderExport() {
  return {
    type: ORDERS_EXPORT_REQUEST
  }
}

function requestOrderExportErr(data) {
  return {
    type: ORDERS_EXPORT_REQUEST_ERR,
    payload: data
  }
}

function receiveOrderExport(data) {
  return {
    type: ORDERS_EXPROT_RECEIVE,
    payload: data
  }
}

function requestOrderRepair() {
  return {
    type: ORDERS_REPAIR_REQUEST
  }
}

function requestOrderRepairErr(data) {
  return {
    type: ORDERS_REPAIR_REQUEST_ERR,
    payload: data
  }
}

function receiveOrderRepair(data) {
  return {
    type: ORDERS_REPAIR_RECEIVE,
    payload: data
  }
}

function requestRecharge() {
  return {
    type: RECHARGE_REQUEST
  }
}

function requestRechargeErr(data) {
  return {
    type: RECHARGE_REQUEST_ERR,
    payload: data
  }
}

function receiveRecharge(data) {
  return {
    type: RECHARGE_RECEIVE,
    payload: data
  }
}

function requestRechargeMap() {
  return {
    type: RECHARGE_MAP_REQUEST
  }
}

function requestRechargeMapErr(data) {
  return {
    type: RECHARGE_MAP_REQUEST_ERR,
    payload: data
  }
}

function receiveRechargeMap(data) {
  return {
    type: RECHARGE_MAP_RECEIVE,
    payload: data
  }
}

function requestRechargeLog() {
  return {
    type: RECHARGE_LOG_REQUEST
  }
}

function requestRechargeLogErr(data) {
  return {
    type: RECHARGE_LOG_REQUEST_ERR,
    payload: data
  }
}

function receiveRechargeLog(data) {
  return {
    type: RECHARGE_LOG_RECEIVE,
    payload: data
  }
}

function requestRechargeReset() {
  return {
    type: RECHARGE_RESET_REQUEST
  }
}

function requestRechargeResetErr(data) {
  return {
    type: RECHARGE_RESET_REQUEST_ERR,
    payload: data
  }
}

function receiveRechargeReset(data) {
  return {
    type: RECHARGE_RESET_RECEIVE,
    payload: data
  }
}

function requestRates() {
  return {
    type: RATES_REQUEST
  }
}

function requestRatesErr(data) {
  return {
    type: RATES_REQUEST_ERR,
    payload: data
  }
}

function receiveRates(data) {
  return {
    type: RATES_RECEIVE,
    payload: data
  }
}

function clearRates() {
  return {
    type: RATES_CLEAR
  }
}

function requestRatesCreate() {
  return {
    type: RATES_CREATE_REQUEST
  }
}

function requestRatesCreateErr(data) {
  return {
    type: RATES_CREATE_REQUEST_ERR,
    payload: data
  }
}

function receiveRatesCreate(data) {
  return {
    type: RATES_CREATE_RECEIVE,
    payload: data
  }
}

function requestRatesDelete() {
  return {
    type: RATES_DELETE_REQUEST
  }
}

function requestRatesDeleteErr(data) {
  return {
    type: RATES_DELETE_REQUEST_ERR,
    payload: data
  }
}

function receiveRatesDelete(data) {
  return {
    type: RATES_DELETE_RECEIVE,
    payload: data
  }
}

function keepRecharge(data) {
  return {
    type: RECHARGE_KEEPING,
    payload: data
  }
}


function requestMonthCard() {
  return {
    type: RECHARGE_MONTHCARD_REQUEST
  }
}

function requestMonthCardErr(data) {
  return {
    type: RECHARGE_MONTHCARD_ERR,
    payload: data
  }
}

function receiveMonthCard() {
  return {
    type: RECHARGE_MONTHCARD_RECEIVE
  }
}

function fetchOrders({ path, params } = {}) {
  return (dispatch) => {

    dispatch(requestOrders())
    const url = `/huo/products/${path.productId}/servers/${path.serverId}/pay/orders`
    AxiosAPI({
      method: 'GET',
      url: url,
      params,
    }).then(response => {
      dispatch(receiveOrders(response))
    }).catch(error => {
      if (error.response) {
        dispatch(requestOrdersErr(error.response.data))
        openNotificationWithIcon('error', error.response.status, error.response.data.tips)
      } else {
        console.log('Error', error.message)
      }
    })
  }
}

function orderExport({ path, params } = {}) {
  return (dispatch) => {

    dispatch(requestOrderExport())
    const url = `/huo/products/${path.productId}/servers/${path.serverId}/pay/export`
    AxiosAPI({
      method: 'GET',
      url: url,
      params,
    }).then(response => {
      dispatch(receiveOrderExport(response))
      if (response.data.downloadLink) {
        let link = `${API_HOST}/huo/products/${path.productId}/servers/${path.serverId}/pay/${response.data.downloadLink}`
        window.open(link)
      }
    }).catch(error => {
      if (error.response) {
        dispatch(requestOrderExportErr(error.response.data))
        openNotificationWithIcon('error', error.response.status, error.response.data.tips)
      } else {
        console.log('Error', error.message)
      }
    })
  }
}

function orderRepair(data) {
  return (dispatch) => {

    dispatch(requestOrderRepair())
    const url = `/huo/products/${data.path.productId}/servers/${data.path.serverId}/pay/repair`
    AxiosAPI({
      method: 'POST',
      url: url,
      data: data.form,
    }).then(response => {
      dispatch(receiveOrderRepair(response))
      if (response.data.msg.includes('补单成功')) {
        openNotificationWithIcon('success', '补单成功！')
      } else {
        openNotificationWithIcon('warning', response.data.msg)
      }
    }).catch(error => {
      if (error.response) {
        dispatch(requestOrderRepairErr(error.response.data))
        openNotificationWithIcon('error', error.response.status, error.response.data.tips)
      } else {
        console.log('Error', error.message)
      }
    })
  }
}

function sendRecharge(data) {
  return (dispatch) => {

    dispatch(requestRecharge())
    const url = `/huo/products/${data.path.productId}/servers/${data.path.serverId}/pay/recharge`
    AxiosAPI({
      method: 'POST',
      url: url,
      data: data.form,
    }).then(response => {
      dispatch(receiveRecharge(response))
      if (response.data.msg === 'OK') {
        openNotificationWithIcon('success', '充值成功！')
      } else if (response.data.msg === 'failed') {
        openNotificationWithIcon('error', '充值失败！')
      } else {
        openNotificationWithIcon('info', response.data.msg)
      }
    }).catch(error => {
      if (error.response) {
        dispatch(requestRechargeErr(error.response.data))
        openNotificationWithIcon('error', error.response.status, error.response.data.tips)
      } else {
        console.log('Error', error.message)
      }
    })
  }
}

function fetchRechargeMap(data) {
  return (dispatch) => {

    dispatch(requestRechargeMap())
    const url = `/huo/products/${data.path.productId}/servers/${data.path.serverId}/pay/rechargemap`
    AxiosAPI({
      method: 'GET',
      url: url,
    }).then(response => {
      dispatch(receiveRechargeMap(response))
    }).catch(error => {
      if (error.response) {
        dispatch(requestRechargeMapErr(error.response.data))
        openNotificationWithIcon('error', error.response.status, error.response.data.tips)
      } else {
        console.log('Error', error.message)
      }
    })
  }
}

function fetchRechargeLog({ path, params } = {}) {
  return async (dispatch) => {

    dispatch(requestRechargeLog())
    const url = `/huo/products/${path.productId}/servers/${path.serverId}/pay/rechargelog`
    try {
      const response = await AxiosAPI.get(url, { params })
      dispatch(receiveRechargeLog(response))
    } catch (error) {
      if (error.response) {
        dispatch(requestRechargeLogErr(error.response.data))
        openNotificationWithIcon('error', error.response.status, error.response.data.tips)
      } else {
        console.log('Error', error.message)
      }
    }
  }
}

function resetRecharge({ path, form } = {}) {
  return async (dispatch) => {

    dispatch(requestRechargeReset())
    const url = `/huo/products/${path.productId}/servers/${path.serverId}/pay/rechargereset`
    try {
      const response = await AxiosAPI.put(url, form)
      dispatch(receiveRechargeReset(response))
    } catch (error) {
      if (error.response) {
        dispatch(requestRechargeResetErr(error.response.data))
        openNotificationWithIcon('error', error.response.status, error.response.data.tips)
      } else {
        console.log('Error', error.message)
      }
    }
  }
}

function fetchRates(data) {
  return (dispatch) => {

    dispatch(requestRates())
    const url = `/huo/products/${data.path.productId}/rebate/rates`
    AxiosAPI({
      method: 'GET',
      url: url,
    }).then(response => {
      dispatch(receiveRates(response))
      openNotificationWithIcon('success', '成功！')
    }).catch(error => {
      if (error.response) {
        dispatch(requestRatesErr(error.response.data))
        openNotificationWithIcon('error', error.response.status, error.response.data.tips)
      } else {
        console.log('Error', error.message)
      }
    })
  }
}

function createRate(data) {
  return (dispatch) => {

    dispatch(requestRatesCreate())
    const url = `/huo/products/${data.path.productId}/rebate/rates`
    AxiosAPI({
      method: 'POST',
      data: data.form,
      url: url,
    }).then(response => {
      dispatch(receiveRatesCreate(response))
      openNotificationWithIcon('success', '成功！')
    }).catch(error => {
      if (error.response) {
        dispatch(requestRatesCreateErr(error.response.data))
        openNotificationWithIcon('error', error.response.status, error.response.data.tips)
      } else {
        console.log('Error', error.message)
      }
    })
  }
}

function deleteRate(data) {
  return (dispatch) => {

    dispatch(requestRatesDelete())
    const url = `/huo/products/${data.path.productId}/rebate/${data.path.amount}`
    AxiosAPI({
      method: 'DELETE',
      url: url,
    }).then(response => {
      dispatch(receiveRatesDelete(response))
      openNotificationWithIcon('success', '成功！')
    }).catch(error => {
      if (error.response) {
        dispatch(requestRatesDeleteErr(error.response.data))
        openNotificationWithIcon('error', error.response.status, error.response.data.tips)
      } else {
        console.log('Error', error.message)
      }
    })
  }
}

function sendMonthCard({ path, form } = {}) {
  return (dispatch, getState) => {

    dispatch(requestMonthCard())
    const url = `/huo/products/${path.productId}/servers/${path.serverId}/pay/recharge/monthcard`
    AxiosAPI({
      method: 'POST',
      url: url,
      data: form,
    }).then(response => {
      dispatch(receiveMonthCard())
      if (response.data.msg == '充值成功') {
        openNotificationWithIcon('success', response.data.msg)
      } else {
        openNotificationWithIcon('error', response.data.msg)
      }
    }).catch(error => {
      if (error.response) {
        dispatch(requestMonthCardErr(error.response.data))
        openNotificationWithIcon('error', error.response.status, error.response.data.tips)
      } else {
        console.log('Error', error.message)
      }
    })
  }
}

export {
  fetchOrders,
  clearOrders,
  orderExport,
  orderRepair,
  sendRecharge,
  sendMonthCard,
  fetchRechargeMap,
  fetchRechargeLog,
  resetRecharge,
  fetchRates,
  clearRates,
  createRate,
  deleteRate,
  keepRecharge
}

// ------------------------------------
// Action Handlers
// ------------------------------------
const ACTION_HANDLERS = {
  [ORDERS_REQUEST]: (state) => {
    return ({
      ...state,
      fetching: true,
      err: false,
      errMes: {},
      orders: []
    })
  },
  [ORDERS_REQUEST_ERR]: (state, action) => {
    return ({
      ...state,
      fetching: false,
      err: true,
      errMes: { tips: action.payload.response.data.tips }
    })
  },
  [ORDERS_RECEIVE]: (state, action) => {
    return ({
      ...state,
      fetching: false,
      orders: action.payload.data.domainObject || []
    })
  },
  [ORDERS_CLEAR]: (state) => {
    return ({
      ...state,
      fetching: false,
      err: false,
      errMes: {},
      orders: []
    })
  },
  [ORDERS_EXPORT_REQUEST]: (state) => {
    return ({
      ...state,
      fetching: true,
      err: false,
      errMes: {},
      export: {}
    })
  },
  [ORDERS_EXPORT_REQUEST_ERR]: (state, action) => {
    return ({
      ...state,
      fetching: false,
      err: true,
      errMes: action.payload ? { tips: action.payload.response.data.tips } : {}
    })
  },
  [ORDERS_EXPROT_RECEIVE]: (state, action) => {
    return ({
      ...state,
      fetching: false,
      export: action.payload.data
    })
  },
  [ORDERS_REPAIR_REQUEST]: (state) => {
    return ({
      ...state,
      fetching: true,
      err: false,
      errMes: {},
      repair: {}
    })
  },
  [ORDERS_REPAIR_REQUEST_ERR]: (state, action) => {
    return ({
      ...state,
      fetching: false,
      err: true,
      errMes: action.payload ? { tips: action.payload.response.data.tips } : {}
    })
  },
  [ORDERS_REPAIR_RECEIVE]: (state, action) => {
    return ({
      ...state,
      fetching: false,
      repair: action.payload.data
    })
  },
  [RECHARGE_REQUEST]: (state) => {
    return ({
      ...state,
      fetching: true,
      err: false,
      errMes: {},
      payment: {}
    })
  },
  [RECHARGE_REQUEST_ERR]: (state, action) => {
    return ({
      ...state,
      fetching: false,
      err: true,
      errMes: action.payload ? { tips: action.payload.response.data.tips } : {}
    })
  },
  [RECHARGE_RECEIVE]: (state, action) => {
    return ({
      ...state,
      fetching: false,
      payment: action.payload.data
    })
  },
  [RECHARGE_MAP_REQUEST]: (state) => {
    return ({
      ...state,
      fetching: true,
      err: false,
      errMes: {},
      remaps: {}
    })
  },
  [RECHARGE_MAP_REQUEST_ERR]: (state, action) => {
    return ({
      ...state,
      fetching: false,
      err: true,
      errMes: action.payload ? { tips: action.payload.response.data.tips } : {}
    })
  },
  [RECHARGE_MAP_RECEIVE]: (state, action) => {
    return ({
      ...state,
      fetching: false,
      remaps: action.payload.data.domainObject || {},
      groupList: action.payload.data.groupList || []
    })
  },
  [RECHARGE_LOG_REQUEST]: (state) => {
    return ({
      ...state,
      fetching: true,
      err: false,
      errMes: {},
      relogs: []
    })
  },
  [RECHARGE_LOG_REQUEST_ERR]: (state, action) => {
    return ({
      ...state,
      fetching: false,
      err: true,
      errMes: action.payload ? { tips: action.payload.response.data.tips } : {}
    })
  },
  [RECHARGE_LOG_RECEIVE]: (state, action) => {
    return ({
      ...state,
      fetching: false,
      relogs: action.payload.data.domainObject || [],
      groupList: action.payload.data.groupList || []
    })
  },
  [RECHARGE_RESET_REQUEST]: (state) => {
    return ({
      ...state,
      fetching: true,
      err: false,
      errMes: {},
      reset: {}
    })
  },
  [RECHARGE_RESET_REQUEST_ERR]: (state, action) => {
    return ({
      ...state,
      fetching: false,
      err: true,
      errMes: action.payload ? { tips: action.payload.response.data.tips } : {}
    })
  },
  [RECHARGE_RESET_RECEIVE]: (state, action) => {
    return ({
      ...state,
      fetching: false,
      reset: action.payload.data || {},
    })
  },
  [RATES_REQUEST]: (state) => {
    return ({
      ...state,
      fetching: true,
      err: false,
      errMes: {},
      rates: []
    })
  },
  [RATES_REQUEST_ERR]: (state, action) => {
    return ({
      ...state,
      fetching: false,
      err: true,
      errMes: action.payload ? { tips: action.payload.response.data.tips } : {}
    })
  },
  [RATES_RECEIVE]: (state, action) => {
    return ({
      ...state,
      fetching: false,
      rates: action.payload.data.domainObject || []
    })
  },
  [RATES_CREATE_REQUEST]: (state) => {
    return ({
      ...state,
      fetching: true,
      err: false,
      errMes: {},
      rateAdd: {}
    })
  },
  [RATES_CREATE_REQUEST_ERR]: (state, action) => {
    return ({
      ...state,
      fetching: false,
      err: true,
      errMes: action.payload ? { tips: action.payload.response.data.tips } : {}
    })
  },
  [RATES_CREATE_RECEIVE]: (state, action) => {
    return ({
      ...state,
      fetching: false,
      rateAdd: action.payload.data
    })
  },
  [RATES_DELETE_REQUEST]: (state) => {
    return ({
      ...state,
      fetching: true,
      err: false,
      errMes: {},
      rateDel: {}
    })
  },
  [RATES_DELETE_REQUEST_ERR]: (state, action) => {
    return ({
      ...state,
      fetching: false,
      err: true,
      errMes: action.payload ? { tips: action.payload.response.data.tips } : {}
    })
  },
  [RATES_DELETE_RECEIVE]: (state, action) => {
    return ({
      ...state,
      fetching: false,
      rateDel: action.payload.data
    })
  },
  [RECHARGE_MONTHCARD_REQUEST]: (state) => {
    return ({
      ...state,
      fetching: true,
      err: false,
      errMes: {}
    })
  },
  [RECHARGE_MONTHCARD_ERR]: (state, action) => {
    return ({
      ...state,
      fetching: false,
      err: true,
      errMes: action.payload ? { tips: action.payload.response.data.tips } : {}
    })
  },
  [RECHARGE_MONTHCARD_RECEIVE]: (state) => {
    return ({
      ...state,
      fetching: false
    })
  },
  [RECHARGE_KEEPING]: (state, action) => {
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
  orders: [],
  export: {},
  repair: {},
  payment: {},
  remaps: {},
  relogs: [],
  reset: {},
  groupList: [],
  rates: [],
  rateAdd: {},
  rateDel: {},
  keeping: {}
}

export default function(state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type]

  return handler ? handler(state, action) : state
}
