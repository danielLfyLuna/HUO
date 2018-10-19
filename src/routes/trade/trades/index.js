import { injectReducer } from '../../../store/reducers'
import { browserHistory } from 'react-router'
export default (store) => ({
  path: 'trades',
  breadcrumbName: '所有交易列表',
  getComponent (nextState, cb) {
    const subMenu = JSON.parse(sessionStorage.getItem('subMenu'))

    if (subMenu) {
      require.ensure([], (require) => {
        const trades = require('./components/Index').default
        const reducer = require('./modules/Module').default
        const tradeReducer = require('./modules/GoodsModule').default
        injectReducer(store, { key: 'trade', reducer })
        injectReducer(store, { key: 'tradeGoods', reducer: tradeReducer })
        cb(null, trades)
      })
    } else {
      browserHistory.push('/')
    }
  }
})
