
import AxiosAPI from '../../../../../utils/axios-api'
import openNotificationWithIcon from '../../../../base/components/Notification'
import { signOut } from '../../../../base/modules/Login'

// ------------------------------------
// Constants
// ------------------------------------
const PLAYER_HORSES_REQUEST = 'PLAYER_HORSES_REQUEST'
const PLAYER_HORSES_RECEIVE = 'PLAYER_HORSES_RECEIVE'

const PLAYER_SKILLS_REQUEST = 'PLAYER_SKILLS_REQUEST'
const PLAYER_SKILLS_RECEIVE = 'PLAYER_SKILLS_RECEIVE'

const PLAYER_SOLDIERS_REQUEST = 'PLAYER_SOLDIERS_REQUEST'
const PLAYER_SOLDIERS_RECEIVE = 'PLAYER_SOLDIERS_RECEIVE'

const PLAYER_EQUIPMENTS_REQUEST = 'PLAYER_EQUIPMENTS_REQUEST'
const PLAYER_EQUIPMENTS_RECEIVE = 'PLAYER_EQUIPMENTS_RECEIVE'

const KEEPING_EQUIPAGE = 'KEEPING_EQUIPAGE'

// ------------------------------------
// Actions
// ------------------------------------

function requestHorses() {
  return {
    type: PLAYER_HORSES_REQUEST
  }
}

function receiveHorses(data) {
  return {
    type: PLAYER_HORSES_RECEIVE,
    payload: data
  }
}

function requestSkills() {
  return {
    type: PLAYER_SKILLS_REQUEST
  }
}

function receiveSkills(data) {
  return {
    type: PLAYER_SKILLS_RECEIVE,
    payload: data
  }
}

function requestSoldiers() {
  return {
    type: PLAYER_SOLDIERS_REQUEST
  }
}

function receiveSoldiers(data) {
  return {
    type: PLAYER_SOLDIERS_RECEIVE,
    payload: data
  }
}

function requestEquipments() {
  return {
    type: PLAYER_EQUIPMENTS_REQUEST
  }
}

function receiveEquipments(data) {
  return {
    type: PLAYER_EQUIPMENTS_RECEIVE,
    payload: data
  }
}

function keepEquipage(data) {
  return {
    type: KEEPING_EQUIPAGE,
    payload: data
  }
}

function fetchHorses(data = {}) {
  return (dispatch, getState) => {

    dispatch(requestHorses())
    let url = `/huo/products/${data.path.productId}/servers/${data.path.serverId}/players/horses`
    AxiosAPI({
      method: 'GET',
      url: url,
      params: data.params
    }).then(response => {
      dispatch(receiveHorses(response))
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

function fetchSkills(data) {
  return (dispatch, getState) => {

    dispatch(requestSkills())
    let url = `/huo/products/${data.path.productId}/servers/${data.path.serverId}/players/skills`
    AxiosAPI({
      method: 'GET',
      url: url,
      params: data.params
    }).then(response => {
      dispatch(receiveSkills(response))
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

function fetchSoldiers(data) {
  return (dispatch, getState) => {

    dispatch(requestSoldiers())
    let url = `/huo/products/${data.path.productId}/servers/${data.path.serverId}/players/soldiers`
    AxiosAPI({
      method: 'GET',
      url: url,
      params: data.params
    }).then(response => {
      dispatch(receiveSoldiers(response))
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

function fetchEquipments(data) {
  return (dispatch, getState) => {

    dispatch(requestEquipments())
    let url = `/huo/products/${data.path.productId}/servers/${data.path.serverId}/players/equipments`
    AxiosAPI({
      method: 'GET',
      url: url,
      params: data.params
    }).then(response => {
      dispatch(receiveEquipments(response))
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
  fetchHorses,
  fetchSkills,
  fetchSoldiers,
  fetchEquipments,
  keepEquipage
}

// ------------------------------------
// Action Handlers
// ------------------------------------
const ACTION_HANDLERS = {
  [PLAYER_HORSES_REQUEST]: (state) => {
    return ({
      ...state,
      fetching: true,
      err: false,
      errMes: {},
      horses: []
    })
  },
  [PLAYER_HORSES_RECEIVE]: (state, action) => {
    return ({
      ...state,
      fetching: false,
      horses: action.payload.data.domainObject.horseDetails || []
    })
  },
  [PLAYER_SKILLS_REQUEST]: (state) => {
    return ({
      ...state,
      fetching: true,
      err: false,
      errMes: {},
      skills: []
    })
  },
  [PLAYER_SKILLS_RECEIVE]: (state, action) => {
    return ({
      ...state,
      fetching: false,
      skills: action.payload.data.domainObject || []
    })
  },

  [PLAYER_SOLDIERS_REQUEST]: (state) => {
    return ({
      ...state,
      fetching: true,
      err: false,
      errMes: {},
      soldiers: []
    })
  },
  [PLAYER_SOLDIERS_RECEIVE]: (state, action) => {
    return ({
      ...state,
      fetching: false,
      soldiers: action.payload.data.domainObject.infos || []
    })
  },

  [PLAYER_EQUIPMENTS_REQUEST]: (state) => {
    return ({
      ...state,
      fetching: true,
      err: false,
      errMes: {},
      equipages: []
    })
  },
  [PLAYER_EQUIPMENTS_RECEIVE]: (state, action) => {
    return ({
      ...state,
      fetching: false,
      equipages: action.payload.data.domainObject.infos || []
    })
  },

  [KEEPING_EQUIPAGE]: (state, action) => {
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
  horses: [],
  skills: [],
  soldiers: [],
  equipages: [],
  keeping: {}
}
export default function (state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type]

  return handler ? handler(state, action) : state
}
