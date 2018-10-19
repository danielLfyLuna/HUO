import { browserHistory } from 'react-router'
import { injectReducer } from '../../../store/reducers'

export default (store) => ({
  path: 'orders',
  breadcrumbName: '充值列表',
  getComponent (nextState, cb) {
    const subMenu = JSON.parse(sessionStorage.getItem('subMenu'))

    if (subMenu) {
      require.ensure([], (require) => {
        const Index = require('./components/Index').default
        const reducer = require('../recharge/modules/Module').default
        injectReducer(store, { key: 'pay', reducer })
        cb(null, Index)
      }, 'orders')
    } else {
      browserHistory.push('/')
    }
  }
})
