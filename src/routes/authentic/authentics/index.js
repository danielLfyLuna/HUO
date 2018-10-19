import { injectReducer } from '../../../store/reducers'
import { browserHistory } from 'react-router'
export default (store) => ({
  path: 'authentics',
  breadcrumbName: '白名单列表',
  getComponent (nextState, cb) {
    const subMenu = JSON.parse(sessionStorage.getItem('subMenu'))

    if (subMenu) {
      require.ensure([], (require) => {
        const authentics = require('./components/Index').default
        const reducer = require('./modules/Module').default
        injectReducer(store, { key: 'authentic', reducer })
        cb(null, authentics)
      }, 'authentics')
    } else {
      browserHistory.push('/')
    }
  }
})
