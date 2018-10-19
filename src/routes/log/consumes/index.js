import { browserHistory } from 'react-router'
import { injectReducer } from '../../../store/reducers'

export default (store) => ({
  path: 'consumes',
  breadcrumbName: '消耗列表',
  getComponent (nextState, cb) {
    const subMenu = JSON.parse(sessionStorage.getItem('subMenu'))

    if (subMenu) {
      require.ensure([], (require) => {
        const consumes = require('./containers/IndexContainer').default
        const reducer = require('./modules/Module').default
        injectReducer(store, { key: 'consume', reducer })
        cb(null, consumes)
      }, 'consumes')
    } else {
      browserHistory.push('/')
    }
  }
})
