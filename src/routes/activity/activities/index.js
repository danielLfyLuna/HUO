import { browserHistory } from 'react-router'
import { injectReducer } from '../../../store/reducers'

export default (store) => ({
  path: 'activities',
  breadcrumbName: '所有活动',
  getComponent (nextState, cb) {
    const subMenu = JSON.parse(sessionStorage.getItem('subMenu'))

    if (subMenu) {
      require.ensure([], (require) => {
        const Index = require('./components/Index').default
        const reducer = require('./modules/Module').default
        injectReducer(store, { key: 'activity', reducer })
        cb(null, Index)
      }, 'activities')
    } else {
      browserHistory.push('/')
    }
  }
})
