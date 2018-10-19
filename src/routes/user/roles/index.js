import { injectReducer } from '../../../store/reducers'

export default (store) => ({
  path: 'roles',
  breadcrumbName: '角色列表',
  getComponent (nextState, cb) {
    require.ensure([], (require) => {
      const Index = require('./components/Index').default
      const reducer = require('../permissions/modules/Module').default
      injectReducer(store, { key: 'permission', reducer })
      cb(null, Index)
    }, 'roles')
  }
})
