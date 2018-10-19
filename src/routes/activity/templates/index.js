import { browserHistory } from 'react-router'
import { injectReducer } from '../../../store/reducers'

export default (store) => ({
  path: 'templates',
  breadcrumbName: '活动模板列表',
  getComponent (nextState, cb) {
    const subMenu = JSON.parse(sessionStorage.getItem('subMenu'))

    if (subMenu) {
      require.ensure([], (require) => {
        const Index = require('./components/Index').default
        const reducer = require('../activities/modules/Module').default
        injectReducer(store, { key: 'activity', reducer })
        cb(null, Index)
      })
    } else {
      browserHistory.push('/')
    }
  }
})
