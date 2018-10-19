import { injectReducer } from '../../../store/reducers'
import { browserHistory } from 'react-router'
export default (store) => ({
  path: 'itemDetail',
  breadcrumbName: '交易行统计',
  getComponent(nxtSt, cb) {
    const subMenu = JSON.parse(sessionStorage.getItem('subMenu'))

    if (subMenu) {
      require.ensure([], (require) => {
        const trades = require('./components/Index').default
        const reducer = require('./modules/Module').default
        injectReducer(store, { key: 'itemDetails', reducer })
        cb(null, trades)
      })
    } else {
      browserHistory.push('/')
    }
  }
})
