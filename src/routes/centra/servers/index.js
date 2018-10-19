import { browserHistory } from 'react-router'
import { injectReducer } from '../../../store/reducers'

export default (store) => ({
  path: 'servers',
  breadcrumbName: '服务器列表',
  getComponent (nextState, cb) {
    const subMenu = JSON.parse(sessionStorage.getItem('subMenu'))

    if (subMenu) {
      require.ensure([], (require) => {
        const servers = require('./components/Index').default
        const reducer = require('./modules/Module').default
        injectReducer(store, { key: 'server', reducer })
        cb(null, servers)
      }, 'servers')
    } else {
      browserHistory.push('/')
    }
  }
})
