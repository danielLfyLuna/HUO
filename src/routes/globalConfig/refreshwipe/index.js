import { browserHistory } from 'react-router'
import { injectReducer } from '../../../store/reducers'

export default (store) => ({
  path: 'refreshwipe',
  breadcrumbName: '手动刷怪',
  getComponent (nextState, cb) {
    const subMenu = JSON.parse(sessionStorage.getItem('subMenu'))
    if (subMenu.includes(30100)) {
      require.ensure([], (require) => {
        const notices = require('./components/index').default
        const reducer = require('./modules/Module').default
        injectReducer(store, { key: 'wipe', reducer })
        cb(null, notices)
      })
    } else {
      browserHistory.push('/')
    }
  }
})
