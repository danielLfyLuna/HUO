import { browserHistory } from 'react-router'
import {injectReducer} from '../../../store/reducers'

export default(store) => ({
  path: 'offline',
  breadcrumbName: '踢人',
  getComponent(nextState, cb) {
    const subMenu = JSON.parse(sessionStorage.getItem('subMenu'))

    if (subMenu) {
      require.ensure([], (require) => {
        const offline = require('./components/Index').default
        const reducer = require('./modules/Module').default
        injectReducer(store, { key: 'offline', reducer })
        cb(null, offline)
      }, 'offline')
    } else {
      browserHistory.push('/')
    }
  }
})
