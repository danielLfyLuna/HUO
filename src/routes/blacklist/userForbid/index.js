import { injectReducer } from '../../../store/reducers'

export default (store) => ({
  path: 'userId',
  breadcrumbName: 'userId封号',
  getComponent (nextState, cb) {
    require.ensure([], (require) => {
      const Index = require('./components/Index').default
      const reducer = require('./modules/Module').default
      injectReducer(store, { key: 'userForbid', reducer })
      cb(null, Index)
    })
  }
})
