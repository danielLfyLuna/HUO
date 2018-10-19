// import { injectReducer } from '../../../../store/reducers'

export default (store) => ({
  path: 'logs',
  breadcrumbName: '托管日志',
  intlId: '托管日志',
  getComponent(nextState, cb) {
    require.ensure([], (require) => {
      const Index = require('./containers/IndexContainer').default
      // const reducer = require('./modules/Module').default
      // injectReducer(store, { key: 'welfare', reducer })
      cb(null, Index)
    }, 'welfare-logs')
  }
})
