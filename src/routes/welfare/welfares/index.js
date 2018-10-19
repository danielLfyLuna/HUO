// import { injectReducer } from '../../../../store/reducers'

export default (store) => ({
  path: 'welfares',
  breadcrumbName: '福利玩家',
  intlId: '福利玩家',
  getComponent(nextState, cb) {
    require.ensure([], (require) => {
      const Index = require('./containers/IndexContainer').default
      // const reducer = require('./modules/Module').default
      // injectReducer(store, { key: 'welfare', reducer })
      cb(null, Index)
    }, 'welfares')
  }
})
