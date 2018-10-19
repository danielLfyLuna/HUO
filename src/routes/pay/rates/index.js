import { injectReducer } from '../../../../store/reducers'

export default (store) => ({
  path: 'rates',
  breadcrumbName: '返钻倍率',
  getComponent (nextState, cb) {
    require.ensure([], (require) => {
      const Index = require('./components/Index').default
      const reducer = require('../index/modules/Module').default
      injectReducer(store, { key: 'recharge', reducer })
      cb(null, Index)
    })
  }
})
