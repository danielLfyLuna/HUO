import {injectReducer} from '../../../store/reducers'

import { browserHistory } from 'react-router'
export default(store) => ({
  path: 'logs',
  breadcrumbName: '实时日志拉取',
  getComponent(nextState, cb) {
    const subMenu = JSON.parse(sessionStorage.getItem('subMenu'))

    if (subMenu) {
      require.ensure([], (require) => {
        const playerLogs = require('./containers/IndexContainer').default
        const reducer = require('./modules/Module').default
        injectReducer(store, {
          key: 'playerLogs',
          reducer
        })
        cb(null, playerLogs)
      })
    } else {
      browserHistory.push('/')
    }
  }
})
