import AxiosAPI from '../../../utils/axios-api'
import openNotificationWithIcon from '../components/Notification'

// ------------------------------------
// Constants
// ------------------------------------

const GLOBAL_KEEPING = 'GLOBAL_KEEPING'

const GLOBAL_PRODUCTS_REQUEST = 'GLOBAL_PRODUCTS_REQUEST'
const GLOBAL_PRODUCTS_RECEIVE = 'GLOBAL_PRODUCTS_RECEIVE'

const GLOBAL_PLAYERS_REQUEST = 'GLOBAL_PLAYERS_REQUEST'
const GLOBAL_PLAYERS_RECEIVE = 'GLOBAL_PLAYERS_RECEIVE'

const GLOBAL_CHANNELS_REQUEST = 'GLOBAL_CHANNELS_REQUEST'
const GLOBAL_CHANNELS_RECEIVE = 'GLOBAL_CHANNELS_RECEIVE'

const GLOBAL_GROUPS_REQUEST = 'GLOBAL_GROUPS_REQUEST'
const GLOBAL_GROUPS_RECEIVE = 'GLOBAL_GROUPS_RECEIVE'

const GLOBAL_GOODS_REQUEST = 'GLOBAL_GOODS_REQUEST'
const GLOBAL_GOODS_RECEIVE = 'GLOBAL_GOODS_RECEIVE'

const GLOBAL_ITEMS_REQUEST = 'GLOBAL_ITEMS_REQUEST'
const GLOBAL_ITEMS_RECEIVE = 'GLOBAL_ITEMS_RECEIVE'

// ------------------------------------
// Actions
// ------------------------------------

function keepGlobals(data) {
  return {
    type: GLOBAL_KEEPING,
    payload: data
  }
}

function requestProducts() {
  return {
    type: GLOBAL_PRODUCTS_REQUEST
  }
}

function receiveProducts(data) {
  return {
    type: GLOBAL_PRODUCTS_RECEIVE,
    payload: data
  }
}

function fetchGlobalProducts() {
  return async (dispatch, getState) => {

    dispatch(requestProducts())
    const url = '/huo/products/server/options'
    try {
      const response = await AxiosAPI.get(url)
      dispatch(receiveProducts(response))
    } catch (error) {
      if (error.response) {
        openNotificationWithIcon('error', '查询出错', error.response.data.tips, 3)
      } else {
        // 一些错误是在设置请求的时候触发
        console.log('Error', error.message)
      }
    }
  }
}

function requestPlayers() {
  return {
    type: GLOBAL_PLAYERS_REQUEST
  }
}

function receivePlayers(data) {
  return {
    type: GLOBAL_PLAYERS_RECEIVE,
    payload: data
  }
}

function fetchGlobalPlayers(data) {
  return (dispatch, getState) => {

    dispatch(requestPlayers())
    const url = `/huo/products/${data.path.productId}/servers/${data.path.serverId}/players`
    AxiosAPI({
      method: 'GET',
      url: url,
      params: data.params,
    }).then(response => {
      dispatch(receivePlayers(response))
    }).catch(error => {
      if (error.response) {
        openNotificationWithIcon('error', '查询出错', error.response.data.tips, 3)
      } else {
        // 一些错误是在设置请求的时候触发
        console.log('Error', error.message)
      }
    })
  }
}

function requestChannels() {
  return {
    type: GLOBAL_CHANNELS_REQUEST
  }
}

function receiveChannels(data) {
  return {
    type: GLOBAL_CHANNELS_RECEIVE,
    payload: data
  }
}

function fetchGlobalChannels() {
  return (dispatch, getState) => {

    dispatch(requestChannels())
    const url = '/huo/channels'
    AxiosAPI({
      method: 'GET',
      url: url,
    }).then(response => {
      dispatch(receiveChannels(response))
    }).catch(error => {
      if (error.response) {
        console.log(error.response.data)
      } else {
        // 一些错误是在设置请求的时候触发
        console.log('Error', error.message)
      }
    })
  }
}

function requestGroups() {
  return {
    type: GLOBAL_GROUPS_REQUEST
  }
}

function receiveGroups(data) {
  return {
    type: GLOBAL_GROUPS_RECEIVE,
    payload: data
  }
}

function fetchGlobalGroups() {
  return (dispatch, getState) => {

    dispatch(requestGroups())
    const url = '/huo/groups/map'
    AxiosAPI({
      method: 'GET',
      url: url,
    }).then(response => {
      dispatch(receiveGroups(response))
    }).catch(error => {
      if (error.response) {
        console.log(error.response.data)
      } else {
        // 一些错误是在设置请求的时候触发
        console.log('Error', error.message)
      }
    })
  }
}

function requestGoods() {
  return {
    type: GLOBAL_GOODS_REQUEST
  }
}
function receiveGoods(data) {
  return {
    type: GLOBAL_GOODS_RECEIVE,
    payload: data
  }
}


function fetchGlobalGoods(data) {
  return (dispatch, getState) => {

    dispatch(requestGoods())
    const url = `/huo/products/${data.path.productId}/items/items`
    AxiosAPI({
      method: 'GET',
      url: url,
    }).then(response => {
      dispatch(receiveGoods(response))
    }).catch(error => {
      if (error.response) {
        console.log(error.response.data)
      } else {
        // 一些错误是在设置请求的时候触发
        console.log('Error', error.message)
      }
    })
  }
}

function requestItems() {
  return {
    type: GLOBAL_ITEMS_REQUEST
  }
}

function receiveItems(data) {
  return {
    type: GLOBAL_ITEMS_RECEIVE,
    payload: data
  }
}

function fetchGlobalItems(data) {
  return (dispatch, getState) => {

    dispatch(requestItems())
    const url = `/huo/products/${data.path.productId}/items/${data.path.itemType}`
    AxiosAPI({
      method: 'GET',
      url: url,
    }).then(response => {
      dispatch(receiveItems(response))
    }).catch(error => {
      if (error.response) {
        if (error.response.data.message === 'token异常，请重新登录。') {
          openNotificationWithIcon('warning', '登录过期', error.response.data.message, 3)
        }
      } else if (error.request) {
        console.log(error.request)
      } else {
        console.log('Error', error.message)
      }
    })
  }
}

export {
  keepGlobals,
  fetchGlobalProducts,
  fetchGlobalPlayers,
  fetchGlobalChannels,
  fetchGlobalGroups,
  fetchGlobalGoods,
  fetchGlobalItems
}

// ------------------------------------
// Action Handlers
// ------------------------------------
const ACTION_HANDLERS = {
  [GLOBAL_KEEPING]: (state, action) => {
    return ({
      ...state,
      keeping: {
        ...state.keeping,
        ...action.payload
      }
    })
  },
  [GLOBAL_PRODUCTS_REQUEST]: (state) => {
    return ({
      ...state,
      fetching: true,
      products: []
    })
  },
  [GLOBAL_PRODUCTS_RECEIVE]: (state, action) => {
    return ({
      ...state,
      fetching: false,
      products: action.payload.data.options
    })
  },
  [GLOBAL_PLAYERS_REQUEST]: (state) => {
    return ({
      ...state,
      fetching: true,
      players: []
    })
  },
  [GLOBAL_PLAYERS_RECEIVE]: (state, action) => {
    return ({
      ...state,
      fetching: false,
      players: action.payload.data.domainObject
    })
  },
  [GLOBAL_CHANNELS_REQUEST]: (state) => {
    return ({
      ...state,
      fetching: true,
      channels: {}
    })
  },
  [GLOBAL_CHANNELS_RECEIVE]: (state, action) => {
    return ({
      ...state,
      fetching: false,
      channels: action.payload.data.channels
    })
  },
  [GLOBAL_GROUPS_REQUEST]: (state) => {
    return ({
      ...state,
      fetching: true,
      groups: []
    })
  },
  [GLOBAL_GROUPS_RECEIVE]: (state, action) => {
    return ({
      ...state,
      fetching: false,
      groups: action.payload.data.domainObject
    })
  },
  [GLOBAL_GOODS_REQUEST]: (state) => {
    return ({
      ...state,
      fetching: true,
      goods: {}
    })
  },
  [GLOBAL_GOODS_RECEIVE]: (state, action) => {
    return ({
      ...state,
      fetching: false,
      goods: action.payload.data.domainObject
    })
  },
  [GLOBAL_ITEMS_REQUEST]: (state) => {
    return ({
      ...state,
      fetching: true,
      items: {}
    })
  },
  [GLOBAL_ITEMS_RECEIVE]: (state, action) => {
    return ({
      ...state,
      fetching: false,
      items: action.payload.data.domainObject
    })
  },
}

// ------------------------------------
// Reducer
// ------------------------------------
const initialState = { // 数据结构
  fetching: false,
  keeping: {},
  products: [],
  players: [],
  channels: {},
  groups: [],
  goods: {},
  items: {}
}

export default function globalReducer(state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type]

  return handler ? handler(state, action) : state
}
