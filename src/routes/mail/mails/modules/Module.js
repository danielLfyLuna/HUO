import _ from 'lodash'
import AxiosAPI from '../../../../../utils/axios-api'
import openNotificationWithIcon from '../../../../base/components/Notification'
import { signOut } from '../../../../base/modules/Login'

// ------------------------------------
// Constants
// ------------------------------------
const MAIL_LIST_PERSON_REQUEST = 'MAIL_LIST_PERSON_REQUEST'
const MAIL_LIST_PERSON_RECEIVE = 'MAIL_LIST_PERSON_RECEIVE'

const MAIL_CREATE_PERSON_REQUEST = 'MAIL_CREATE_PERSON_REQUEST'
const MAIL_CREATE_PERSON_REQUEST_ERR = 'MAIL_CREATE_PERSON_REQUEST_ERR'
const MAIL_CREATE_PERSON_RECEIVE = 'MAIL_CREATE_PERSON_RECEIVE'

const MAIL_UPDATE_PERSON_REQUEST = 'MAIL_UPDATE_PERSON_REQUEST'
const MAIL_UPDATE_PERSON_REQUEST_ERR = 'MAIL_UPDATE_PERSON_REQUEST_ERR'
const MAIL_UPDATE_PERSON_RECEIVE = 'MAIL_UPDATE_PERSON_RECEIVE'

const MAIL_FETCH_PERSON_REQUEST = 'MAIL_FETCH_PERSON_REQUEST'
const MAIL_FETCH_PERSON_RECEIVE = 'MAIL_FETCH_PERSON_RECEIVE'

const MAIL_LIST_ALLIANCE_REQUEST = 'MAIL_LIST_ALLIANCE_REQUEST'
const MAIL_LIST_ALLIANCE_RECEIVE = 'MAIL_LIST_ALLIANCE_RECEIVE'

const MAIL_CREATE_ALLIANCE_REQUEST = 'MAIL_CREATE_ALLIANCE_REQUEST'
const MAIL_CREATE_ALLIANCE_REQUEST_ERR = 'MAIL_CREATE_ALLIANCE_REQUEST_ERR'
const MAIL_CREATE_ALLIANCE_RECEIVE = 'MAIL_CREATE_ALLIANCE_RECEIVE'

const MAIL_UPDATE_ALLIANCE_REQUEST = 'MAIL_UPDATE_ALLIANCE_REQUEST'
const MAIL_UPDATE_ALLIANCE_REQUEST_ERR = 'MAIL_UPDATE_ALLIANCE_REQUEST_ERR'
const MAIL_UPDATE_ALLIANCE_RECEIVE = 'MAIL_UPDATE_ALLIANCE_RECEIVE'

const MAIL_FETCH_ALLIANCE_REQUEST = 'MAIL_FETCH_ALLIANCE_REQUEST'
const MAIL_FETCH_ALLIANCE_RECEIVE = 'MAIL_FETCH_ALLIANCE_RECEIVE'

const MAIL_LIST_SERVER_REQUEST = 'MAIL_LIST_SERVER_REQUEST'
const MAIL_LIST_SERVER_RECEIVE = 'MAIL_LIST_SERVER_RECEIVE'

const MAIL_CREATE_SERVER_REQUEST = 'MAIL_CREATE_SERVER_REQUEST'
const MAIL_CREATE_SERVER_REQUEST_ERR = 'MAIL_CREATE_SERVER_REQUEST_ERR'
const MAIL_CREATE_SERVER_RECEIVE = 'MAIL_CREATE_SERVER_RECEIVE'

const MAIL_UPDATE_SERVER_REQUEST = 'MAIL_UPDATE_SERVER_REQUEST'
const MAIL_UPDATE_SERVER_REQUEST_ERR = 'MAIL_UPDATE_SERVER_REQUEST_ERR'
const MAIL_UPDATE_SERVER_RECEIVE = 'MAIL_UPDATE_SERVER_RECEIVE'

const MAIL_FETCH_SERVER_REQUEST = 'MAIL_FETCH_SERVER_REQUEST'
const MAIL_FETCH_SERVER_RECEIVE = 'MAIL_FETCH_SERVER_RECEIVE'

const MAIL_SEND_REQUEST = 'MAIL_SEND_REQUEST'
const MAIL_SEND_REQUEST_ERR = 'MAIL_SEND_REQUEST_ERR'
const MAIL_SEND_RECEIVE = 'MAIL_SEND_RECEIVE'

const MAIL_APPROVE_REQUEST = 'MAIL_APPROVE_REQUEST'
const MAIL_APPROVE_REQUEST_ERR = 'MAIL_APPROVE_REQUEST_ERR'
const MAIL_APPROVE_RECEIVE = 'MAIL_APPROVE_RECEIVE'

const MAIL_PLAYER_EDIT_REQUEST = 'MAIL_PLAYER_EDIT_REQUEST'
const MAIL_PLAYER_EDIT_RECEIVE = 'MAIL_PLAYER_EDIT_RECEIVE'

const KEEPING_MAILS = 'KEEPING_MAILS'

const CHANGE_RECEIVER_DONE = 'CHANGE_RECEIVER_DONE'
const CHANGE_RECEIVER_ERR = 'CHANGE_RECEIVER_ERR'

// ------------------------------------
// Actions
// ------------------------------------

function requestPersonMails() {
  return {
    type: MAIL_LIST_PERSON_REQUEST
  }
}

function receivePersonMails(data) {
  return {
    type: MAIL_LIST_PERSON_RECEIVE,
    payload: data
  }
}

function requestPersonMailCreate() {
  return {
    type: MAIL_CREATE_PERSON_REQUEST
  }
}

function receivePersonMailCreate(data) {
  return {
    type: MAIL_CREATE_PERSON_RECEIVE,
    payload: data
  }
}

function requestPersonMailUpdate() {
  return {
    type: MAIL_UPDATE_PERSON_REQUEST
  }
}

function receivePersonMailUpdate(data) {
  return {
    type: MAIL_UPDATE_PERSON_RECEIVE,
    payload: data
  }
}

function requestPersonMail() {
  return {
    type: MAIL_FETCH_PERSON_REQUEST
  }
}

function receivePersonMail(data) {
  return {
    type: MAIL_FETCH_PERSON_RECEIVE,
    payload: data
  }
}

function requestAllianceMails() {
  return {
    type: MAIL_LIST_ALLIANCE_REQUEST
  }
}

function receiveAllianceMails(data) {
  return {
    type: MAIL_LIST_ALLIANCE_RECEIVE,
    payload: data
  }
}

function requestAllianceMailCreate() {
  return {
    type: MAIL_CREATE_ALLIANCE_REQUEST
  }
}

function receiveAllianceMailCreate(data) {
  return {
    type: MAIL_CREATE_ALLIANCE_RECEIVE,
    payload: data
  }
}

function requestAllianceMailUpdate() {
  return {
    type: MAIL_UPDATE_ALLIANCE_REQUEST
  }
}

function receiveAllianceMailUpdate(data) {
  return {
    type: MAIL_UPDATE_ALLIANCE_RECEIVE,
    payload: data
  }
}

function requestAllianceMail() {
  return {
    type: MAIL_FETCH_ALLIANCE_REQUEST
  }
}

function receiveAllianceMail(data) {
  return {
    type: MAIL_FETCH_ALLIANCE_RECEIVE,
    payload: data
  }
}

function requestServerMails() {
  return {
    type: MAIL_LIST_SERVER_REQUEST
  }
}

function receiveServerMails(data) {
  return {
    type: MAIL_LIST_SERVER_RECEIVE,
    payload: data
  }
}

function requestServerMailCreate() {
  return {
    type: MAIL_CREATE_SERVER_REQUEST
  }
}

function receiveServerMailCreate(data) {
  return {
    type: MAIL_CREATE_SERVER_RECEIVE,
    payload: data
  }
}

function requestServerMailUpdate() {
  return {
    type: MAIL_UPDATE_SERVER_REQUEST
  }
}

function receiveServerMailUpdate(data) {
  return {
    type: MAIL_UPDATE_SERVER_RECEIVE,
    payload: data
  }
}

function requestServerMail() {
  return {
    type: MAIL_FETCH_SERVER_REQUEST
  }
}

function receiveServerMail(data) {
  return {
    type: MAIL_FETCH_SERVER_RECEIVE,
    payload: data
  }
}

function requestMailSend() {
  return {
    type: MAIL_SEND_REQUEST
  }
}

function receiveMailSend(data) {
  return {
    type: MAIL_SEND_RECEIVE,
    payload: data
  }
}

function requestMailApprove() {
  return {
    type: MAIL_APPROVE_REQUEST
  }
}

function receiveMailApprove(data) {
  return {
    type: MAIL_APPROVE_RECEIVE,
    payload: data
  }
}

function requestMailPlayerEdit() {
  return {
    type: MAIL_PLAYER_EDIT_REQUEST
  }
}

function receiveMailPlayerEdit(data) {
  return {
    type: MAIL_PLAYER_EDIT_RECEIVE,
    payload: data
  }
}

function keepMails(data) {
  return {
    type: KEEPING_MAILS,
    payload: data
  }
}

function changeReceiverDone(data) {
  return {
    type: CHANGE_RECEIVER_DONE,
    payload: data
  }
}

function changeReceiverErr(data) {
  return {
    type: CHANGE_RECEIVER_ERR,
    payload: data
  }
}

function fetchPersonMails(data = {}) {
  return (dispatch, getState) => {

    dispatch(requestPersonMails())
    let url = `/huo/mails`
    AxiosAPI({
      method: 'GET',
      url: url,
      params: data.params
    }).then(response => {
      dispatch(receivePersonMails(response))
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

function createPersonMail(data = {}) {
  return (dispatch, getState) => {

    dispatch(requestPersonMailCreate())
    let url = `/huo/mails`
    openNotificationWithIcon('info', '请稍等', '在没有成功前请不要重复点击提交')
    AxiosAPI({
      method: 'POST',
      url: url,
      data: data.form
    }).then(response => {
      dispatch(receivePersonMailCreate(response))
      openNotificationWithIcon('success', '添加成功')
    }).catch(error => {
      if (error.response) {
        if (error.response.data.message === 'token异常，请重新登录。') {
          openNotificationWithIcon('warning', '登录过期', error.response.data.message, 3)
          dispatch(signOut())
        } else {
          openNotificationWithIcon('error', '失败', error.response.data.tips)
        }
      } else if (error.request) {
        console.log(error.request)
      } else {
        console.log('Error', error.message)
      }
    })
  }
}

function updatePersonMail(data) {
  return (dispatch, getState) => {

    dispatch(requestPersonMailUpdate())
    let url = `/huo/mails/${data.path.mailId}`
    openNotificationWithIcon('info', '请稍等', '在没有成功前请不要重复点击发送')
    AxiosAPI({
      method: 'PUT',
      url: url,
      data: data.form
    }).then(response => {
      dispatch(receivePersonMailUpdate(response))
      openNotificationWithIcon('success', '修改成功')
    }).catch(error => {
      if (error.response) {
        if (error.response.data.message === 'token异常，请重新登录。') {
          openNotificationWithIcon('warning', '登录过期', error.response.data.message, 3)
          dispatch(signOut())
        } else {
          openNotificationWithIcon('error', '失败', error.response.data.tips)
        }
      } else if (error.request) {
        console.log(error.request)
      } else {
        console.log('Error', error.message)
      }
    })
  }
}

function fetchPersonMail(data) {
  return (dispatch, getState) => {

    dispatch(requestPersonMail())
    let url = `/huo/mails/${data.path.mailId}`
    AxiosAPI({
      method: 'GET',
      url: url,
    }).then(data => {
      dispatch(receivePersonMail(data))
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

function fetchAllianceMails(data) {
  return (dispatch, getState) => {

    dispatch(requestAllianceMails())
    let url = `/huo/mails/allianceMails`
    AxiosAPI({
      method: 'GET',
      url: url,
      params: data.params
    }).then(response => {
      dispatch(receiveAllianceMails(response))
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

function createAllianceMail(data) {
  return (dispatch, getState) => {

    dispatch(requestAllianceMailCreate())
    let url = `/huo/mails/allianceMails`
    AxiosAPI({
      method: 'POST',
      url: url,
      data: data.form
    }).then(response => {
      dispatch(receiveAllianceMailCreate(response))
      openNotificationWithIcon('success', '添加成功')
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

function updateAllianceMail(data) {
  return (dispatch, getState) => {

    dispatch(requestAllianceMailUpdate())
    let url = `/huo/mails/allianceMails/${data.path.mailId}`
    AxiosAPI({
      method: 'PUT',
      url: url,
      data: data.form
    }).then(response => {
      dispatch(receiveAllianceMailUpdate(response))
      openNotificationWithIcon('success', '修改成功')
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

function fetchAllianceMail(data) {
  return (dispatch, getState) => {

    dispatch(requestAllianceMail())
    let url = `/huo/mails/allianceMails/${data.path.mailId}`
    AxiosAPI({
      method: 'GET',
      url: url,
    }).then(response => {
      dispatch(receiveAllianceMail(response))
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

function fetchServerMails(data) {
  return (dispatch, getState) => {

    dispatch(requestServerMails())
    let url = `/huo/mails/serverMails`
    AxiosAPI({
      method: 'GET',
      url: url,
      params: data.params
    }).then(response => {
      dispatch(receiveServerMails(response))
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

function createServerMail(data) {
  return (dispatch, getState) => {

    dispatch(requestServerMailCreate())
    let url = `/huo/mails/serverMails`
    AxiosAPI({
      method: 'POST',
      url: url,
      data: data.form
    }).then(response => {
      dispatch(receiveServerMailCreate(response))
      openNotificationWithIcon('success', '添加成功')
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

function updateServerMail(data) {
  return (dispatch, getState) => {

    dispatch(requestServerMailUpdate())
    let url = `/huo/mails/serverMails/${data.path.mailId}`
    AxiosAPI({
      method: 'PUT',
      url: url,
      data: data.form
    }).then(response => {
      dispatch(receiveServerMailUpdate(response))
      openNotificationWithIcon('success', '修改成功')
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

function fetchServerMail(data) {
  return (dispatch, getState) => {

    dispatch(requestServerMail())
    let url = `/huo/mails/serverMails/${data.path.mailId}`
    AxiosAPI({
      method: 'GET',
      url: url,
    }).then(response => {
      dispatch(receiveServerMail(response))
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

function sendMail(data) {
  return (dispatch, getState) => {

    dispatch(requestMailSend())
    let url = `/huo/mails/${data.path.mailId}`
    AxiosAPI({
      method: 'POST',
      url: url,
    }).then(response => {
      if (response.data.mail) {
        dispatch(receiveMailSend({
          ...response,
          data: {
            ...response.data,
            mailType: data.handle.toLowerCase()
          }
        }))
        openNotificationWithIcon('success', '发送成功')
      }
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

function approveMail(data) {
  return (dispatch, getState) => {
    dispatch(requestMailApprove())
    let url = `/huo/mails/${data.path.mailId}/approve/${data.path.mailStatus}`
    AxiosAPI({
      method: 'POST',
      url: url,
      data: data.form
    }).then(response => {
      dispatch(receiveMailApprove({
        ...response,
        data: {
          ...response.data,
          mailType: data.path.mailType.toLowerCase()
        }
      }))
      if (!response.message) {
        openNotificationWithIcon('success', '操作成功')
      }
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

function editMailPlayer(data) {
  return (dispatch, getState) => {

    dispatch(requestMailPlayerEdit())
    let url = `/huo/mails/${data.path.mailId}/players/${data.path.index}`
    AxiosAPI({
      method: 'PUT',
      url: url,
      data: data.form
    }).then(response => {
      dispatch(receiveMailPlayerEdit(response))
      openNotificationWithIcon('success', '修改收件人---成功!')
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

function changeReceiver(data) {
  return (dispatch, getState) => {

    let url = `/huo/mails/${data.id}/players/${data.index}`
    AxiosAPI({
      method: 'PUT',
      url: url,
      data: data.list
    }).then(response => {
      dispatch(changeReceiverDone(response))
      openNotificationWithIcon('success', '修改收件人---成功!')
    }).catch(error => {
      if (error.response) {
        if (error.response.data.message === 'token异常，请重新登录。') {
          openNotificationWithIcon('warning', '登录过期', error.response.data.message, 3)
          dispatch(signOut())
        }
        dispatch(changeReceiverErr(error.response))
      } else if (error.request) {
        console.log(error.request)
      } else {
        console.log('Error', error.message)
      }
    })
  }
}

export {
  fetchPersonMails,
  createPersonMail,
  updatePersonMail,
  fetchPersonMail,
  fetchAllianceMails,
  createAllianceMail,
  updateAllianceMail,
  fetchAllianceMail,
  fetchServerMails,
  createServerMail,
  updateServerMail,
  fetchServerMail,
  sendMail,
  approveMail,
  editMailPlayer,
  keepMails,
  changeReceiver
}

// ------------------------------------
// Action Handlers
// ------------------------------------
const ACTION_HANDLERS = {
  [MAIL_LIST_PERSON_REQUEST]: (state) => {
    return ({
      ...state,
      fetching: true,
      err: false,
      errMes: {},
      personal: {
        ...state.personal,
        list: []
      }
    })
  },
  [MAIL_LIST_PERSON_RECEIVE]: (state, action) => {
    return ({
      ...state,
      fetching: false,
      personal: {
        ...state.personal,
        list: action.payload.data.Mails || []
      }
    })
  },
  [MAIL_CREATE_PERSON_REQUEST]: (state) => {
    return ({
      ...state,
      fetching: true,
      err: false,
      errMes: {},
      personal: {
        ...state.personal,
        edit: {}
      }
    })
  },
  [MAIL_CREATE_PERSON_REQUEST_ERR]: (state, action) => {
    return ({
      ...state,
      fetching: false,
      err: true,
      errMes: Object.assign({}, ...state, action.payload.data),
    })
  },
  [MAIL_CREATE_PERSON_RECEIVE]: (state, action) => {
    return ({
      ...state,
      fetching: false,
      personal: {
        ...state.personal,
        edit: Object.assign({}, ...state, action.payload.data),
      }
    })
  },
  [MAIL_UPDATE_PERSON_REQUEST]: (state) => {
    return ({
      ...state,
      fetching: true,
      err: false,
      errMes: {},
      personal: {
        ...state.personal,
        edit: {}
      }
    })
  },
  [MAIL_UPDATE_PERSON_REQUEST_ERR]: (state, action) => {
    return ({
      ...state,
      fetching: false,
      err: true,
      errMes: Object.assign({}, ...state, action.payload.data),
    })
  },
  [MAIL_UPDATE_PERSON_RECEIVE]: (state, action) => {
    return ({
      ...state,
      fetching: false,
      personal: {
        ...state.personal,
        edit: { ...action.payload.data }
      }
    })
  },
  [MAIL_FETCH_PERSON_REQUEST]: (state, action) => {
    return ({
      ...state,
      fetching: true,
      err: false,
      errMes: {},
      personal: {
        ...state.personal,
        mail: {}
      }
    })
  },
  [MAIL_FETCH_PERSON_RECEIVE]: (state, action) => {
    return ({
      ...state,
      fetching: false,
      personal: {
        ...state.personal,
        mail: { ...action.payload.data }
      }
    })
  },
  [MAIL_LIST_ALLIANCE_REQUEST]: (state) => {
    return ({
      ...state,
      fetching: true,
      err: false,
      errMes: {},
      alliance: {
        ...state.alliance,
        list: []
      }
    })
  },
  [MAIL_LIST_ALLIANCE_RECEIVE]: (state, action) => {
    return ({
      ...state,
      fetching: false,
      alliance: {
        ...state.alliance,
        list: action.payload.data.mailList || []
      }
    })
  },
  [MAIL_CREATE_ALLIANCE_REQUEST]: (state) => {
    return ({
      ...state,
      fetching: true,
      err: false,
      errMes: {},
      alliance: {
        ...state.alliance,
        edit: {}
      }
    })
  },
  [MAIL_CREATE_ALLIANCE_REQUEST_ERR]: (state, action) => {
    return ({
      ...state,
      fetching: false,
      err: true,
      errMes: { ...action.payload.data }
    })
  },
  [MAIL_CREATE_ALLIANCE_RECEIVE]: (state, action) => {
    return ({
      ...state,
      fetching: false,
      alliance: {
        ...state.alliance,
        edit: { ...action.payload.data }
      }
    })
  },
  [MAIL_UPDATE_ALLIANCE_REQUEST]: (state) => {
    return ({
      ...state,
      fetching: true,
      err: false,
      errMes: {},
      alliance: {
        ...state.alliance,
        edit: {}
      }
    })
  },
  [MAIL_UPDATE_ALLIANCE_REQUEST_ERR]: (state, action) => {
    return ({
      ...state,
      fetching: false,
      err: true,
      errMes: { ...action.payload.data }
    })
  },
  [MAIL_UPDATE_ALLIANCE_RECEIVE]: (state, action) => {
    return ({
      ...state,
      fetching: false,
      alliance: {
        ...state.alliance,
        edit: { ...action.payload.data }
      }
    })
  },
  [MAIL_FETCH_ALLIANCE_REQUEST]: (state) => {
    return ({
      ...state,
      fetching: true,
      err: false,
      errMes: {},
      alliance: {
        ...state.alliance,
        mail: {}
      }
    })
  },
  [MAIL_FETCH_ALLIANCE_RECEIVE]: (state, action) => {
    return ({
      ...state,
      fetching: false,
      alliance: {
        ...state.alliance,
        mail: { ...action.payload.data }
      }
    })
  },
  [MAIL_LIST_SERVER_REQUEST]: (state) => {
    return ({
      ...state,
      fetching: true,
      err: false,
      errMes: {},
      servers: {
        ...state.servers,
        list: []
      }
    })
  },
  [MAIL_LIST_SERVER_RECEIVE]: (state, action) => {
    return ({
      ...state,
      fetching: false,
      servers: {
        ...state.servers,
        list: action.payload.data.mailList || []
      }
    })
  },
  [MAIL_CREATE_SERVER_REQUEST]: (state) => {
    return ({
      ...state,
      fetching: true,
      err: false,
      errMes: {},
      servers: {
        ...state.servers,
        edit: {}
      }
    })
  },
  [MAIL_CREATE_SERVER_REQUEST_ERR]: (state, action) => {
    return ({
      ...state,
      fetching: false,
      err: true,
      errMes: { ...action.payload.data }
    })
  },
  [MAIL_CREATE_SERVER_RECEIVE]: (state, action) => {
    return ({
      ...state,
      fetching: false,
      servers: {
        ...state.servers,
        edit: { ...action.payload.data }
      }
    })
  },
  [MAIL_UPDATE_SERVER_REQUEST]: (state) => {
    return ({
      ...state,
      fetching: true,
      err: false,
      errMes: {},
      servers: {
        ...state.servers,
        edit: {}
      }
    })
  },
  [MAIL_UPDATE_SERVER_REQUEST_ERR]: (state, action) => {
    return ({
      ...state,
      fetching: false,
      err: true,
      errMes: { ...action.payload.data }
    })
  },
  [MAIL_UPDATE_SERVER_RECEIVE]: (state, action) => {
    return ({
      ...state,
      fetching: false,
      servers: {
        ...state.servers,
        edit: { ...action.payload.data }
      }
    })
  },
  [MAIL_FETCH_SERVER_REQUEST]: (state) => {
    return ({
      ...state,
      fetching: true,
      err: false,
      errMes: {},
      servers: {
        ...state.servers,
        mail: {}
      }
    })
  },
  [MAIL_FETCH_SERVER_RECEIVE]: (state, action) => {
    return ({
      ...state,
      fetching: false,
      servers: {
        ...state.servers,
        mail: { ...action.payload.data }
      }
    })
  },
  [MAIL_SEND_REQUEST]: (state) => {
    return ({
      ...state,
      fetching: true,
      err: false,
      errMes: {},
      send: {}
    })
  },
  [MAIL_SEND_REQUEST_ERR]: (state, action) => {
    return ({
      ...state,
      fetching: false,
      err: true,
      errMes: Object.assign({}, ...state, action.payload.data)
    })
  },
  [MAIL_SEND_RECEIVE]: (state, action) => {
    const type = action.payload.data.mailType
    const mail = action.payload.data.mail
    const list = [ ...state[type].list ]
    _.map(list, (value, index) => {
      if (value.id === mail.id) {
        value = _.assign(value, mail)
      }
    })
    return ({
      ...state,
      fetching: false,
      [type]: {
        ...state[type],
        list: [ ...list ]
      },
      send: { ...action.payload.data }
    })
  },

  [MAIL_APPROVE_REQUEST]: (state) => {
    return ({
      ...state,
      fetching: true,
      err: false,
      errMes: {},
      pass: {}
    })
  },
  [MAIL_APPROVE_REQUEST_ERR]: (state, action) => {
    return ({
      ...state,
      fetching: false,
      err: true,
      errMes: Object.assign({}, ...state, action.payload.data)
    })
  },
  [MAIL_APPROVE_RECEIVE]: (state, action) => {
    const type = action.payload.data.mailType
    const mail = action.payload.data.Mail
    const list = [ ...state[type].list ]
    _.map(list, (value, index) => {
      if (value.id === mail.id) {
        value = _.assign(value, mail)
      }
    })
    return ({
      ...state,
      fetching: false,
      pass: { ...action.payload.data }
    })
  },
  [MAIL_PLAYER_EDIT_REQUEST]: (state) => {
    return ({
      ...state,
      fetching: true,
      err: false,
      errMes: {},
      player: {}
    })
  },
  [MAIL_PLAYER_EDIT_RECEIVE]: (state, action) => {
    return ({
      ...state,
      fetching: false,
      player: { ...action.payload.data }
    })
  },
  [CHANGE_RECEIVER_DONE]: (state, action) => {
    _.map(state.personal.mail.mailPlayers, (v, i) => {
      if (v.index === action.payload.data.player.index) {
        state.personal.mail.mailPlayers[i] = action.payload.data.player
      }
    })
    return ({
      ...state,
      receiver: action.payload ? action.payload.data.player : {}
    })
  },
  [CHANGE_RECEIVER_ERR]: (state, action) => {
    return ({
      ...state,
      errMes: Object.assign({}, ...state, action.payload.data)
    })
  },
  [KEEPING_MAILS]: (state, action) => {
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
  personal: {
    list: [],
    mail: {},
    edit: {},
  },
  alliance: {
    list: [],
    mail: {},
    edit: {}
  },
  servers: {
    list: [],
    mail: {},
    edit: {}
  },
  send: {},
  pass: {},
  player: {},
  receiver: {},
  keeping: {}
}

export default function (state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type]

  return handler ? handler(state, action) : state
}
