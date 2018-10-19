import { injectReducer } from '../../store/reducers'

export default (store) => ({
  path: 'welfare',
  breadcrumbName: '福利托管',
  intlId: '福利托管',
  getChildRoutes (location, cb) {
    require.ensure([], (require) => {
      const reducer = require('./Module').default
      injectReducer(store, { key: 'welfare', reducer })
      cb(null, [
        require('./groups').default(store),
        require('./welfares').default(store),
        require('./logs').default(store)
      ])
    })
  }
})
