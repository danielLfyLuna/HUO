import { injectReducer } from '../../../store/reducers'
import { browserHistory } from 'react-router'

export default (store) => ({
  path: 'timingservers',
  breadcrumbName: '定时开服服务器列表',
  intlId: '定时开服服务器列表',
  getComponent (nextState, cb) {
    const subMenu = JSON.parse(sessionStorage.getItem('subMenu'))

    if (subMenu) {
      require.ensure([], (require) => {
        const timingservers = require('./containers/IndexContainer').default
        const reducer = require('./modules/Module').default
        injectReducer(store, { key: 'timingServers', reducer })
        cb(null, timingservers)
      })
    } else {
      browserHistory.push('/')
    }
  }
})
