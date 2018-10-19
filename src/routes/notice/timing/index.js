import { browserHistory } from 'react-router'
import { injectReducer } from '../../../store/reducers'

export default (store) => ({
  path: 'timing',
  breadcrumbName: '定时公告列表',
  getComponent (nextState, cb) {
    const subMenu = JSON.parse(sessionStorage.getItem('subMenu'))

    if (subMenu) {
      require.ensure([], (require) => {
        const notices = require('./components/Index').default
        const reducer = require('./modules/Module').default
        injectReducer(store, { key: 'timingNotice', reducer })
        cb(null, notices)
      }, 'timing')
    } else {
      browserHistory.push('/')
    }
  }
})
