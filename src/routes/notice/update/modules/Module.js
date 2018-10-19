
import AxiosAPI from '../../../../../utils/axios-api'
// import _ from 'lodash'
import openNotificationWithIcon from '../../../../base/components/Notification'

// ------------------------------------
// Constants
// ------------------------------------
const REQUEST_NOTICES_UPDATE = 'REQUEST_NOTICES_UPDATE'
const RECEIVE_NOTICES_UPDATE = 'RECEIVE_NOTICES_UPDATE'
const CLEAR_NOTICES_UPDATE = 'CLEAR_NOTICES_UPDATE'
const REFRESH_NOTICES_REDUCER = 'REFRESH_NOTICES_REDUCER'

const REQUEST_ERR = 'REQUEST_ERR'

const KEEPING_UPDATE = 'KEEPING_UPDATE'

// ------------------------------------
// Actions
// ------------------------------------


function requestNoticesUpdate() {
  return {
    type: REQUEST_NOTICES_UPDATE
  }
}

function receiveNoticesUpdate(data) {
  return {
    type: RECEIVE_NOTICES_UPDATE,
    payload: data
  }
}

function clearNoticesUpdate() {
  return {
    type: CLEAR_NOTICES_UPDATE
  }
}

function requestErr(data) {
  return {
    type: REQUEST_ERR,
    data: data
  }
}

function refreshNoticesReducer(data) {
  return {
    type: REFRESH_NOTICES_REDUCER,
    data: data
  }
}

function keepUpdate(data) {
  return {
    type: KEEPING_UPDATE,
    payload: data
  }
}

function fetchNoticesUpdate(value = {}) {
  return (dispatch, getState) => {
    // 验证从复提交
    if (getState().updateNotice.fetching) {
      return
    }

    dispatch(requestNoticesUpdate())
    // let url = `${SANGO2_API_HOST}/products/${value.products[0]}/updatenotices/servers/${value.products[1]}`
    let url = `/huo/products/${value.products[0]}/updatenotices/servers/${value.products[1]}`
    AxiosAPI({
      method: 'GET',
      url: url,
      headers: {
        'adminUserId': JSON.parse(sessionStorage.getItem('hoolai')).userId,
        'Authorization': `bearer ${JSON.parse(sessionStorage.getItem('hoolai')).token}`
      }
    }).then(response => {
      dispatch(receiveNoticesUpdate(response))
      dispatch(keepUpdate({value: value.products}))
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

function addUpdateNotice(notice) {
  return (dispatch, getState) => {
    let rewards = []
    notice.keys.map(function(elem, index) {
      let item = {
        itemId: notice[`item-${elem}`],
        num: notice[`number-${elem}`]
      }
      rewards.push(item)
    })
    let url = `/huo/products/${notice.productId}/updatenotices`
    AxiosAPI({
      method: 'POST',
      data: {
        title: notice.title,
        content: notice.content,
        productId: notice.productId,
        serverIds: notice.serverIds,
        appversion: notice.appversion,
        rewards: rewards
      },
      url: url,
      headers: {
        'adminUserId': JSON.parse(sessionStorage.getItem('hoolai')).userId,
        'Authorization': `bearer ${JSON.parse(sessionStorage.getItem('hoolai')).token}`
      }
    }).then(response => {
      openNotificationWithIcon('success', '添加成功')
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

function updateUpdateNotice(notice) {
  // console.log(notice)
  return (dispatch, getState) => {
    let rewards = []
    notice.keys.map(function(elem, index) {
      let item = {
        itemId: notice[`item-${elem}`],
        num: notice[`number-${elem}`]
      }
      rewards.push(item)
    })
    let url = `/huo/products/${notice.productId}/updatenotices`
    AxiosAPI({
      method: 'PUT',
      data: {
        title: notice.title,
        content: notice.content,
        open: notice.open,
        productId: notice.productId,
        serverIds: notice.serverIds,
        appversion: notice.appversion,
        rewards: rewards
      },
      url: url,
      headers: {
        'adminUserId': JSON.parse(sessionStorage.getItem('hoolai')).userId,
        'Authorization': `bearer ${JSON.parse(sessionStorage.getItem('hoolai')).token}`
      }
    }).then(response => {
      dispatch(refreshNoticesReducer(response))
      openNotificationWithIcon('success', '更新成功')
      dispatch(fetchNoticesUpdate({products: getState().updateNotice.keeping.value}))
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


export {
  requestNoticesUpdate,
  receiveNoticesUpdate,
  clearNoticesUpdate,
  fetchNoticesUpdate,
  addUpdateNotice,
  updateUpdateNotice,
  keepUpdate
}

// ------------------------------------
// Action Handlers
// ------------------------------------
const ACTION_HANDLERS = {
  [REQUEST_NOTICES_UPDATE]: (state) => {
    return ({
      ...state,
      fetching: true
    })
  },
  [RECEIVE_NOTICES_UPDATE]: (state, action) => {
    return ({
      ...state,
      fetching: false,
      notices: action.payload ? action.payload.data.domainObject : []
    })
  },
  [CLEAR_NOTICES_UPDATE]: (state) => {
    return ({
      ...state,
      fetching: false,
      notices: [],
      error: null
    })
  },
  [REQUEST_ERR]: (state, action) => {
    return ({
      ...state,
      fetching: false,
      error: { tips: action.payload.response.data.tips }
    })
  },
  [REFRESH_NOTICES_REDUCER]: (state) => {
    // const notices = [...state.notices]
    // _.map(notices, (val, index) => {
    //   if (val.id === action.data.data.id) {
    //     val = Object.assign(val, action.data.data)
    //   }
    // })
    return ({
      ...state,
      fetching: false
    })
  },
  [KEEPING_UPDATE]: (state, action) => {
    // console.log(action.payload)
    return ({
      ...state,
      keeping: Object.assign({}, action.payload)
    })
  }
}

// ------------------------------------
// Reducer
// ------------------------------------
const initialState = { // 数据结构
  fetching: false,
  notices: [],
  error: null,
  keeping: {}
}

  export default function(state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type]

  return handler
    ? handler(state, action)
    : state
}
