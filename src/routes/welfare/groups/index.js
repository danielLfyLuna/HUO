// import { injectReducer } from '../../../../store/reducers'

export default (store) => ({
  path: 'groups',
  breadcrumbName: '福利分组',
  intlId: '福利分组',
  getComponent(nextState, cb) {
    require.ensure([], (require) => {
      const Index = require('./containers/IndexContainer').default
      // const reducer = require('./modules/Module').default
      // injectReducer(store, { key: 'welfare', reducer })
      cb(null, Index)
    }, 'groups')
  }
})
