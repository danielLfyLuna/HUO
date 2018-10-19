import { browserHistory } from 'react-router'
import { injectReducer } from '../../../store/reducers'

export default (store) => ({
  path: 'forgive',
  breadcrumbName: '黑名单列表',
  getComponent (nextState, cb) {
    const subMenu = JSON.parse(sessionStorage.getItem('subMenu'))

    if (subMenu) {
      require.ensure([], (require) => {
        const forgive = require('./components/Index').default
        const reducer = require('./modules/Module').default
        injectReducer(store, { key: 'blacklist', reducer })
        cb(null, forgive)
      }, 'forgive')
    } else {
      browserHistory.push('/')
    }
  }
})
