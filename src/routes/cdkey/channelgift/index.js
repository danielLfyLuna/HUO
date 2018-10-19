import { injectReducer } from '../../../store/reducers'
import { browserHistory } from 'react-router'
export default (store) => ({
  path: 'channelgift',
  breadcrumbName: '渠道兑换码对应CDKey',
  getComponent (nextState, cb) {
    const subMenu = JSON.parse(sessionStorage.getItem('subMenu'))

    if (subMenu) {
      require.ensure([], (require) => {
        const Index = require('./components/Index').default
        const reducer = require('../cdkeys/modules/Module').default
        injectReducer(store, { key: 'cdkey', reducer })
        cb(null, Index)
      })
    } else {
      browserHistory.push('/')
    }
  }
})
