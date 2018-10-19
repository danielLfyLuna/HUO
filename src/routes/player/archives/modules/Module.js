
import AxiosAPI from '../../../../../utils/axios-api'
import openNotificationWithIcon from '../../../../base/components/Notification'
import { signOut } from '../../../../base/modules/Login'

// ------------------------------------
// Constants
// ------------------------------------
const PLAYER_IMAGES_REQUEST = 'PLAYER_IMAGES_REQUEST'
const PLAYER_IMAGES_RECEIVE = 'PLAYER_IMAGES_RECEIVE'

const PLAYER_IMAGE_REQUEST = 'PLAYER_IMAGE_REQUEST'
const PLAYER_IMAGE_RECEIVE = 'PLAYER_IMAGE_RECEIVE'

const PLAYER_NICKNAMES_REQUEST = 'PLAYER_NICKNAMES_REQUEST'
const PLAYER_NICKNAMES_RECEIVE = 'PLAYER_NICKNAMES_RECEIVE'

const PLAYER_KEEPING = 'PLAYER_KEEPING'

// ------------------------------------
// Actions
// ------------------------------------

function requestImages() {
  return {
    type: PLAYER_IMAGES_REQUEST
  }
}

function receiveImages(data) {
  return {
    type: PLAYER_IMAGES_RECEIVE,
    payload: data
  }
}

function requestImage() {
  return {
    type: PLAYER_IMAGE_REQUEST
  }
}

function receiveImage(data) {
  return {
    type: PLAYER_IMAGE_RECEIVE,
    payload: data
  }
}

function requestNicknames() {
  return {
    type: PLAYER_NICKNAMES_REQUEST
  }
}

function receiveNicknames(data) {
  return {
    type: PLAYER_NICKNAMES_RECEIVE,
    payload: data
  }
}

function keepPlayer(data) {
  return {
    type: PLAYER_KEEPING,
    payload: data
  }
}

function fetchImages(data = {}) {
  return (dispatch, getState) => {

    dispatch(requestImages())
    let url = `/huo/products/${data.path.productId}/servers/${data.path.serverId}/players/headimgs`
    AxiosAPI({
      method: 'GET',
      url: url,
      params: data.params
    }).then(response => {
      dispatch(receiveImages(response))
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

function fetchImage(data) {
  return (dispatch, getState) => {

    dispatch(requestImage())
    let url = `/huo/products/${data.path.productId}/servers/${data.path.serverId}/players/${data.path.playerId}/clear/headimg`
    AxiosAPI({
      method: 'GET',
      url: url,
      params: data.params
    }).then(response => {
      dispatch(receiveImage(response))
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

function fetchNicknames(data) {
  return (dispatch, getState) => {

    dispatch(requestNicknames())
    let url = `/huo/products/${data.path.productId}/servers/${data.path.serverId}/players/oldname`
    AxiosAPI({
      method: 'GET',
      url: url,
      params: data.params
    }).then(response => {
      dispatch(receiveNicknames(response))
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

export {
  fetchImages,
  fetchImage,
  fetchNicknames,
  keepPlayer
}

// ------------------------------------
// Action Handlers
// ------------------------------------
const ACTION_HANDLERS = {
  [PLAYER_IMAGES_REQUEST]: (state) => {
    return ({
      ...state,
      fetching: true,
      err: false,
      errMes: {},
      images: []
    })
  },
  [PLAYER_IMAGES_RECEIVE]: (state, action) => {
    return ({
      ...state,
      fetching: false,
      images: action.payload.data.domainObject || []
    })
  },
  [PLAYER_IMAGE_REQUEST]: (state) => {
    return ({
      ...state,
      fetching: true,
      err: false,
      errMes: {},
      image: {}
    })
  },
  [PLAYER_IMAGE_RECEIVE]: (state, action) => {
    return ({
      ...state,
      fetching: false,
      image: action.payload.data.msg || {}
    })
  },

  [PLAYER_NICKNAMES_REQUEST]: (state) => {
    return ({
      ...state,
      fetching: true,
      err: false,
      errMes: {},
      nicknames: {}
    })
  },
  [PLAYER_NICKNAMES_RECEIVE]: (state, action) => {
    return ({
      ...state,
      fetching: false,
      nicknames: action.payload.data.domainObject || {}
    })
  },
  [PLAYER_KEEPING]: (state, action) => {
    return ({
      ...state,
      keeping: Object.assign({}, action.payload)
    })
  }
}

// ------------------------------------
// Reducer
// ------------------------------------
const initialState = {
  fetching: false,
  err: false,
  errMes: {},
  images: [],
  image: {},
  nicknames: {},
  keeping: {}
}
export default function (state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type]

  return handler ? handler(state, action) : state
}
