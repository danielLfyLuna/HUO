import { browserHistory } from 'react-router'
import { injectReducer } from '../../../store/reducers'

export default (store) => ({
  path: 'cdkeys',
  breadcrumbName: '兑换码礼包列表',
  getComponent (nextState, cb) {
    const subMenu = JSON.parse(sessionStorage.getItem('subMenu'))

    if (subMenu) {
      require.ensure([], (require) => {
        const cdkeys = require('./components/Index').default
        const reducer = require('./modules/Module').default
        injectReducer(store, { key: 'cdkey', reducer })
        cb(null, cdkeys)
      }, 'cdkeys')
    } else {
      browserHistory.push('/')
    }
  }
})
