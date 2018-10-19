import { notification } from 'antd'
import AxiosAPI from '../../../../../utils/axios-api'
import openNotificationWithIcon from '../../../../base/components/Notification'

// ------------------------------------
// Constants
// ------------------------------------
const ACTIVITIES_LIST_REQUEST = 'ACTIVITIES_LIST_REQUEST'
const ACTIVITIES_LIST_REQUEST_ERR = 'ACTIVITIES_LIST_REQUEST_ERR'
const ACTIVITIES_LIST_RECEIVE = 'ACTIVITIES_LIST_RECEIVE'
const ACTIVITIES_LIST_CLEAR = 'ACTIVITIES_LIST_CLEAR'

const ACTIVITIES_TEMPLATES_REQUEST = 'ACTIVITIES_TEMPLATES_REQUEST'
const ACTIVITIES_TEMPLATES_REQUEST_ERR = 'ACTIVITIES_TEMPLATES_REQUEST_ERR'
const ACTIVITIES_TEMPLATES_RECEIVE = 'ACTIVITIES_TEMPLATES_RECEIVE'

const ACTIVITIES_TEMPLATE_ADD_REQUEST = 'ACTIVITIES_TEMPLATE_ADD_REQUEST'
const ACTIVITIES_TEMPLATE_ADD_REQUEST_ERR = 'ACTIVITIES_TEMPLATE_ADD_REQUEST_ERR'
const ACTIVITIES_TEMPLATE_ADD_RECEIVE = 'ACTIVITIES_TEMPLATE_ADD_RECEIVE'
const ACTIVITIES_TEMPLATE_ADD_CLEAR = 'ACTIVITIES_TEMPLATE_ADD_CLEAR'

const ACTIVITIES_SWITCH_REQUEST = 'ACTIVITIES_SWITCH_REQUEST'
const ACTIVITIES_SWITCH_REQUEST_ERR = 'ACTIVITIES_SWITCH_REQUEST_ERR'
const ACTIVITIES_SWITCH_RECEIVE = 'ACTIVITIES_SWITCH_RECEIVE'

const ACTIVITIES_UPDATE_REQUEST = 'ACTIVITIES_UPDATE_REQUEST'
const ACTIVITIES_UPDATE_REQUEST_ERR = 'ACTIVITIES_UPDATE_REQUEST_ERR'
const ACTIVITIES_UPDATE_RECEIVE = 'ACTIVITIES_UPDATE_RECEIVE'

// ------------------------------------
// Actions
// ------------------------------------

function requestActivities() {
  return {
    type: ACTIVITIES_LIST_REQUEST
  }
}

function requestActivitiesErr(data) {
  return {
    type: ACTIVITIES_LIST_REQUEST_ERR,
    payload: data
  }
}

function receiveActivities(data) {
  return {
    type: ACTIVITIES_LIST_RECEIVE,
    payload: data
  }
}

function clearActivities() {
  return {
    type: ACTIVITIES_LIST_CLEAR
  }
}

function requestTemplates() {
  return {
    type: ACTIVITIES_TEMPLATES_REQUEST
  }
}

function requestTemplatesErr(data) {
  return {
    type: ACTIVITIES_TEMPLATES_REQUEST_ERR,
    payload: data
  }
}

function receiveTemplates(data) {
  return {
    type: ACTIVITIES_TEMPLATES_RECEIVE,
    payload: data
  }
}

function requestTemplateCreate() {
  return {
    type: ACTIVITIES_TEMPLATE_ADD_REQUEST
  }
}

function requestTemplateCreateErr(data) {
  return {
    type: ACTIVITIES_TEMPLATE_ADD_REQUEST_ERR,
    payload: data
  }
}

function receiveTemplateCreate(data) {
  return {
    type: ACTIVITIES_TEMPLATE_ADD_RECEIVE,
    payload: data
  }
}

function clearTemplateCreate() {
  return {
    type: ACTIVITIES_TEMPLATE_ADD_CLEAR
  }
}

function requestActivitySwitch() {
  return {
    type: ACTIVITIES_SWITCH_REQUEST
  }
}

function requestActivitySwitchErr(data) {
  return {
    type: ACTIVITIES_SWITCH_REQUEST_ERR,
    payload: data
  }
}

function receiveActivitySwitch(data) {
  return {
    type: ACTIVITIES_SWITCH_RECEIVE,
    payload: data
  }
}

function requestActivityUpdate() {
  return {
    type: ACTIVITIES_UPDATE_REQUEST
  }
}

function requestActivityUpdateErr(data) {
  return {
    type: ACTIVITIES_UPDATE_REQUEST_ERR,
    payload: data
  }
}

function receiveActivityUpdate(data) {
  return {
    type: ACTIVITIES_UPDATE_RECEIVE,
    payload: data
  }
}

function fetchActivities(data) {
  return (dispatch, getState) => {
    if (getState().activity.fetching) {
      return openNotificationWithIcon('info', '发送中！请稍等', '在完成请不要重复点击')
    }

    dispatch(requestActivities())
    const url = `/huo/products/${data.path.productId}/servers/${data.path.serverId}/activitys`
    AxiosAPI({
      method: 'GET',
      url: url
    }).then(response => {
      dispatch(receiveActivities(response))
    }).catch(error => {
      if (error.response) {
        dispatch(requestActivitiesErr(error.response.data))
        openNotificationWithIcon('error', error.response.status, error.response.data.tips)
      } else {
        console.log('Error', error.message)
      }
    })
  }
}

function fetchTemplates(data) {
  return (dispatch, getState) => {

    dispatch(requestTemplates())
    const url = `/huo/products/${data.path.productId}/servers/${data.path.serverId}/activitys/templates`
    AxiosAPI({
      method: 'GET',
      url: url,
    }).then(response => {
      dispatch(receiveTemplates(response))
    }).catch(error => {
      if (error.response) {
        dispatch(requestTemplatesErr(error.response.data))
        openNotificationWithIcon('error', error.response.status, error.response.data.tips)
      } else {
        console.log('Error', error.message)
      }
    })
  }
}

function newCreateActivity(data) {
  return (dispatch, getState) => {

    dispatch(requestTemplateCreate())
    const url = `/huo/products/${data.path.productId}/servers/${data.path.serverId}/activitys/add`
    AxiosAPI({
      method: 'POST',
      url: url,
      data: data.form,
    }).then(response => {
      dispatch(receiveTemplateCreate(response))
      openNotificationWithIcon('info', '请等待发送结果')
    }).catch(error => {
      if (error.response) {
        dispatch(requestTemplateCreateErr(error.response))
        notification.error({
          message: `${error.response.status}: ${error.response.data.error}`,
          description: error.response.data.message,
          duration: 0,
          style: { width: 360 }
        })
      } else {
        console.log('Error', error.message)
      }
    })
  }
}

function switchActivity(data) {
  return (dispatch, getState) => {
    if (getState().activity.fetching) {
      return openNotificationWithIcon('info', '发送中！请稍等', '在完成请不要重复点击')
    }

    dispatch(requestActivitySwitch())
    const url = `/huo/products/${data.path.productId}/servers/${data.path.serverId}/activitys/${data.path.templateId}/switch/${data.path.switchKey}`
    AxiosAPI({
      method: 'PUT',
      url: url,
    }).then(response => {
      if (Object.keys(response.data).includes('isSuccess')) {
        if (response.data.isSuccess) {
          openNotificationWithIcon('success', `活动 ${data.path.switchKey ? '开启' : '下线'} 操作成功！`)
        } else {
          openNotificationWithIcon('warning', `活动 ${data.path.switchKey ? '开启' : '下线'} 操作失败！`)
        }
      }
      dispatch(receiveActivitySwitch(response))
      dispatch(fetchActivities(data))
    }).catch(error => {
      if (error.response) {
        dispatch(requestActivitySwitchErr(error.response.data))
        openNotificationWithIcon('error', error.response.status, error.response.data.tips)
      } else {
        console.log('Error', error.message)
      }
    })
  }
}

function updateActivity(data) {
  return (dispatch, getState) => {
    if (getState().activity.fetching) {
      return openNotificationWithIcon('info', '发送中！请稍等', '在完成请不要重复点击')
    }

    dispatch(requestActivityUpdate())
    const url = `/huo/products/${data.path.productId}/servers/${data.path.serverId}/activitys/${data.path.templateId}`
    AxiosAPI({
      method: 'PUT',
      url: url,
      data: data.form,
    }).then(response => {
      dispatch(receiveActivityUpdate(response))
      if (response.data.failServerIds.length > 0) {
        const result = response.data.failServerIds.map(server => `服务器：${server}，操作：更新活动，反馈：失败`)
        notification.warning({
          message: '活动更新结果',
          description: result.join('；'),
          duration: 0,
          style: { width: 360 }
        })
      } else if (response.data.failServerIds.length == 0 && response.data.successServerIds.length > 0) {
        openNotificationWithIcon('success', '更新成功')
      }
    }).catch(error => {
      if (error.response) {
        dispatch(requestActivityUpdateErr(error.response.data))
        openNotificationWithIcon('error', error.response.status, error.response.data.tips)
      } else {
        console.log('Error', error.message)
      }
    })
  }
}

export {
  fetchActivities,
  clearActivities,
  fetchTemplates,
  newCreateActivity,
  clearTemplateCreate,
  switchActivity,
  updateActivity
}

// ------------------------------------
// Action Handlers
// ------------------------------------
const ACTION_HANDLERS = {
  [ACTIVITIES_LIST_REQUEST]: (state) => {
    return ({
      ...state,
      fetching: true,
      err: false,
      errMes: {},
      activities: {
        ...state.activities,
        list: []
      }
    })
  },
  [ACTIVITIES_LIST_REQUEST_ERR]: (state, action) => {
    return ({
      ...state,
      fetching: false,
      err: true,
      errMes: action.payload ? { tips: action.payload.tips } : {}
    })
  },
  [ACTIVITIES_LIST_RECEIVE]: (state, action) => {
    return ({
      ...state,
      fetching: false,
      activities: {
        ...state.activities,
        list: action.payload.data ? action.payload.data.domainObject : []
      }
    })
  },
  [ACTIVITIES_LIST_CLEAR]: (state) => {
    return ({
      ...state,
      fetching: false,
      err: false,
      errMes: {},
      activities: {
        ...state.activities,
        list: []
      }
    })
  },
  [ACTIVITIES_TEMPLATES_REQUEST]: (state) => {
    return ({
      ...state,
      fetching: true,
      err: false,
      errMes: {},
      activities: {
        ...state.activities,
        templates: []
      }
    })
  },
  [ACTIVITIES_TEMPLATES_REQUEST_ERR]: (state, action) => {
    return ({
      ...state,
      fetching: false,
      err: true,
      errMes: action.payload ? { tips: action.payload.tips } : {}
    })
  },
  [ACTIVITIES_TEMPLATES_RECEIVE]: (state, action) => {
    return ({
      ...state,
      fetching: false,
      activities: {
        ...state.activities,
        templates: action.payload.data ? action.payload.data.domainObject : []
      }
    })
  },
  [ACTIVITIES_TEMPLATE_ADD_REQUEST]: (state) => {
    return ({
      ...state,
      fetching: true,
      err: false,
      errMes: {},
      activities: {
        ...state.activities,
        newCreate: []
      }
    })
  },
  [ACTIVITIES_TEMPLATE_ADD_REQUEST_ERR]: (state, action) => {
    return ({
      ...state,
      fetching: false,
      err: true,
      errMes: action.payload ? { tips: action.payload.response.data.tips } : {}
    })
  },
  [ACTIVITIES_TEMPLATE_ADD_RECEIVE]: (state, action) => {
    return ({
      ...state,
      fetching: false,
      activities: {
        ...state.activities,
        newCreate: action.payload.data
      }
    })
  },
  [ACTIVITIES_TEMPLATE_ADD_CLEAR]: (state) => {
    return ({
      ...state,
      fetching: true,
      err: false,
      errMes: {},
      activities: {
        ...state.activities,
        newCreate: []
      }
    })
  },
  [ACTIVITIES_SWITCH_REQUEST]: (state) => {
    return ({
      ...state,
      fetching: true,
      err: false,
      errMes: {},
      activities: {
        ...state.activities,
        switch: {}
      }
    })
  },
  [ACTIVITIES_SWITCH_REQUEST_ERR]: (state, action) => {
    return ({
      ...state,
      fetching: false,
      err: true,
      errMes: action.payload ? { tips: action.payload.response.data.tips } : {}
    })
  },
  [ACTIVITIES_SWITCH_RECEIVE]: (state, action) => {
    return ({
      ...state,
      fetching: false,
      activities: {
        ...state.activities,
        switch: action.payload.data
      }
    })
  },
  [ACTIVITIES_UPDATE_REQUEST]: (state) => {
    return ({
      ...state,
      fetching: true,
      err: false,
      errMes: {},
      activities: {
        ...state.activities,
        update: {}
      }
    })
  },
  [ACTIVITIES_UPDATE_REQUEST_ERR]: (state, action) => {
    return ({
      ...state,
      fetching: false,
      err: true,
      errMes: action.payload ? { tips: action.payload.response.data.tips } : {}
    })
  },
  [ACTIVITIES_UPDATE_RECEIVE]: (state, action) => {
    return ({
      ...state,
      fetching: false,
      activities: {
        ...state.activities,
        update: action.payload.data
      }
    })
  },
}

// ------------------------------------
// Reducer
// ------------------------------------
const initialState = { // 数据结构
  fetching: false,
  err: false,
  errMes: {},
  activities: {
    list: [],
    templates: [],
    newCreate: [],
    update: {},
    switch: {}
  }
}

export default function(state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type]

  return handler ? handler(state, action) : state
}
