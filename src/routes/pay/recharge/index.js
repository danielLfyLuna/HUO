import { browserHistory } from 'react-router'
import { injectReducer } from '../../../store/reducers'

export default (store) => ({
  path: 'recharge',
  breadcrumbName: '后台充值',
  getComponent (nextState, cb) {
    const subMenu = JSON.parse(sessionStorage.getItem('subMenu'))

    if (subMenu) {
      require.ensure([], (require) => {
        const Index = require('./components/Index').default
        const reducer = require('./modules/Module').default
        injectReducer(store, { key: 'pay', reducer })
        cb(null, Index)
      }, 'recharge')
    } else {
      browserHistory.push('/')
    }
  }
})
