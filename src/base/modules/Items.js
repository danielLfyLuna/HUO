import AxiosAPI from '../../../utils/axios-api'
import openNotificationWithIcon from '../components/Notification'
import { signOut } from './Login'

// ------------------------------------
// Constants
// ------------------------------------
const REQUEST_ITEMS = 'REQUEST_ITEMS'
const RECEIVE_ITEMS = 'RECEIVE_ITEMS'
const RECEIVE_ITEMS_LIST = 'RECEIVE_ITEMS_LIST'
const REQUEST_OPERATE_BLACK_REWARD_ITEM = 'REQUEST_OPERATE_BLACK_REWARD_ITEM'
const REQUEST_SYNC_ITEMS = 'REQUEST_SYNC_ITEMS'


// ------------------------------------
// Actions
// ------------------------------------
function requestItems() {
  return {
    type: REQUEST_ITEMS
  }
}
function receiveItems(data) {
  return {
    type: RECEIVE_ITEMS,
    items: data
  }
}
function requestSyncItems() {
  return {
    type: REQUEST_SYNC_ITEMS
  }
}

function receiveItemList(data) {
  return {
    type: RECEIVE_ITEMS_LIST,
    list: data
  }
}

function operateBlackRewardItem() {
  return {
    type: REQUEST_OPERATE_BLACK_REWARD_ITEM
  }
}

/**
 * [isLoginActionCreator 登录异步请求]
 * @param  {Object}  [value={}] [表单]
 * @return {Boolean}            [action]
 */
export function itemsActionCreator(value = {}, type = 0) {
  return (dispatch, getState) => {

    dispatch(requestItems())
    let url = `/huo/products/${value[0]}/items/${type}`
    AxiosAPI({
      method: 'GET',
      url: url,
      headers: {
        'adminUserId': JSON.parse(sessionStorage.getItem('hoolai')).userId,
        'Authorization': `bearer ${JSON.parse(sessionStorage.getItem('hoolai')).token}`
      }
    }).then(data => {
      dispatch(receiveItems(data.data.domainObject))
    }).catch(error => {
      if (error.response) {
        if (error.response.data.message === 'token异常，请重新登录。') {
          openNotificationWithIcon('warning', '登录过期', error.response.data.message, 3)
          dispatch(signOut())
        }
      } else if (error.request) {
        console.log(error.request)
      } else {
        console.log('Error', error.message)
      }
    })
  }
}

export function fetchAllRewadItemList() {
  return (dispatch, getState) => {
    dispatch(requestItems())
    let url = `/huo/products/0/items/alllist`
    AxiosAPI({
      method: 'GET',
      url: url,
      headers: {
        'adminUserId': JSON.parse(sessionStorage.getItem('hoolai')).userId,
        'Authorization': `bearer ${JSON.parse(sessionStorage.getItem('hoolai')).token}`
      }
    }).then(data => {
      dispatch(receiveItemList(data.data.domainObject))
    }).catch(error => {
      if (error.response) {
        if (error.response.data.message === 'token异常，请重新登录。') {
          openNotificationWithIcon('warning', '登录过期', error.response.data.message, 3)
          dispatch(signOut())
        }
      } else if (error.request) {
        console.log(error.request)
      } else {
        console.log('Error', error.message)
      }
    })
  }
}

export function editBlackRewardItem(templateId, rewardType, operation) {
  return (dispatch, getState) => {
    dispatch(operateBlackRewardItem())
    let url = `/huo/products/0/items/blacklist/${rewardType}/templates/${templateId}/operation/${operation}`
    AxiosAPI({
      method: 'POST',
      url: url,
    }).then(data => {
        openNotificationWithIcon('success', '操作完成！')
        dispatch(receiveItemList(data.data.domainObject))
    }).catch(error => {
      if (error.response) {
        if (error.response.data.message === 'token异常，请重新登录。') {
          openNotificationWithIcon('error', '登录过期', error.response.data.message, 3)
          dispatch(signOut())
        }
        if (error.response.data.error) {
          openNotificationWithIcon('error', error.response.data.status, error.response.data.message, 10)
        }
      } else if (error.request) {
        console.log(error.request)
      } else {
        console.log('Error', error.message)
      }
    })
  }
}

export function handleSyncItem(productId, serverId) {
  return (dispatch, getState) => {
    dispatch(requestSyncItems())
    let url = `/huo/products/${productId}/items/servers/${serverId}/synctemplate`
    AxiosAPI({
      method: 'POST',
      url: url,
      headers: {
        'adminUserId': JSON.parse(sessionStorage.getItem('hoolai')).userId,
        'Authorization': `bearer ${JSON.parse(sessionStorage.getItem('hoolai')).token}`
      }
    }).then(data => {
      openNotificationWithIcon('success', '同步完成！')
      dispatch(receiveItemList(data.data.domainObject))
    }).catch(error => {
      if (error.response) {
        if (error.response.data.message === 'token异常，请重新登录。') {
          openNotificationWithIcon('warning', '登录过期', error.response.data.message, 3)
          dispatch(signOut())
        }
      } else if (error.request) {
        console.log(error.request)
      } else {
        console.log('Error', error.message)
      }
    })
  }
}

export const actions = {
  itemsActionCreator,
  fetchAllRewadItemList,
  editBlackRewardItem
}

// ------------------------------------
// Action Handlers
// ------------------------------------
const ACTION_HANDLERS = {
  [REQUEST_ITEMS]: (state) => {
    return ({
      ...state,
      fetching: true
    })
  },
  [REQUEST_SYNC_ITEMS]: (state) => {
    return ({
      ...state,
      fetching: true
    })
  },
  [RECEIVE_ITEMS]: (state, action) => {
    return ({
      ...state,
      fetching: false,
      data: Object.assign({}, ...state, action.items)
    })
  },
  [RECEIVE_ITEMS_LIST]: (state, action) => {
    return ({
      ...state,
      fetching: false,
      list: Object.assign({}, ...state, action)
    })
  }
}

// ------------------------------------
// Reducer
// ------------------------------------
const initialState = {
  fetching: false, // 是否正在请求
  data: {},
  list: []
}
export default function itemsReducer(state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type]

  return handler ? handler(state, action) : state
}
