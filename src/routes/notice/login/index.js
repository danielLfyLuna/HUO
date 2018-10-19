import { browserHistory } from 'react-router'
import { injectReducer } from '../../../store/reducers'

export default (store) => ({
  path: 'login',
  breadcrumbName: '登陆公告列表',
  getComponent (nextState, cb) {
    const subMenu = JSON.parse(sessionStorage.getItem('subMenu'))

    if (subMenu) {
      require.ensure([], (require) => {
        const login = require('./components/Index').default
        const reducer = require('./modules/Module').default
        injectReducer(store, { key: 'notice', reducer })
        cb(null, login)
      }, 'login')
    } else {
      browserHistory.push('/')
    }
  }
})
