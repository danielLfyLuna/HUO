import { browserHistory } from 'react-router'
import { injectReducer } from '../../../store/reducers'

export default (store) => ({
  path: 'setCDKey',
  breadcrumbName: '设置CDKEY',
  getComponent (nextState, cb) {
    const subMenu = JSON.parse(sessionStorage.getItem('subMenu'))
    if (subMenu.includes(30100)) {
      require.ensure([], (require) => {
        const notices = require('./containers/IndexContainer').default
        const reducer = require('./modules/Module').default
        injectReducer(store, { key: 'setCDKey', reducer })
        cb(null, notices)
      })
    } else {
      browserHistory.push('/')
    }
  }
})
