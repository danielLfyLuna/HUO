import { injectReducer } from '../../../store/reducers'
import { browserHistory } from 'react-router'
export default (store) => ({
  path: 'merge',
  breadcrumbName: '合服列表',
  intlId: '合服列表',
  getComponent (nextState, cb) {
    const subMenu = JSON.parse(sessionStorage.getItem('subMenu'))

    if (subMenu) {
      require.ensure([], (require) => {
        const merges = require('./containers/IndexContainer').default
        const reducer = require('./modules/Module').default
        injectReducer(store, { key: 'merge', reducer })
        cb(null, merges)
      })
    } else {
      browserHistory.push('/')
    }
  }
})
