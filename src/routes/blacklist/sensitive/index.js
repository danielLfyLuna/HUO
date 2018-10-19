import { browserHistory } from 'react-router'
import { injectReducer } from '../../../store/reducers'

export default (store) => ({
  path: 'sensitive',
  breadcrumbName: '敏感词',
  getComponent (nextState, cb) {
    const subMenu = JSON.parse(sessionStorage.getItem('subMenu'))

    if (subMenu) {
      require.ensure([], (require) => {
        const notices = require('./components/Index').default
        const reducer = require('./modules/Module').default
        injectReducer(store, { key: 'sensitive', reducer })
        cb(null, notices)
      })
    } else {
      browserHistory.push('/')
    }
  }
})
