import { browserHistory } from 'react-router'
import { injectReducer } from '../../../store/reducers'

export default (store) => ({
  path: 'forbid',
  breadcrumbName: '禁言&封号',
  getComponent (nextState, cb) {
    const subMenu = JSON.parse(sessionStorage.getItem('subMenu'))

    if (subMenu) {
      require.ensure([], (require) => {
        const Index = require('./components/Index').default
        const reducer = require('../forgive/modules/Module').default
        injectReducer(store, { key: 'blacklist', reducer })
        cb(null, Index)
      }, 'forbid')
    } else {
      browserHistory.push('/')
    }
  }
})
