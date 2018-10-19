import AxiosAPI from '../../../utils/axios-api'
import openNotificationWithIcon from '../components/Notification'
import { signOut } from './Login'

// ------------------------------------
// Constants
// ------------------------------------
const REQUEST_ITEMS = 'REQUEST_ITEMS'
const RECEIVE_ITEMS = 'RECEIVE_ITEMS'


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

export const actions = {
  itemsActionCreator
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
  [RECEIVE_ITEMS]: (state, action) => {
    return ({
      ...state,
      fetching: false,
      data: Object.assign({}, ...state, action.items)
    })
  }
}

// ------------------------------------
// Reducer
// ------------------------------------
const initialState = {
  fetching: false, // 是否正在请求
  data: {}
}
export default function itemsReducer(state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type]

  return handler ? handler(state, action) : state
}
