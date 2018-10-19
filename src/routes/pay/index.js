export default (store) => ({
  path: 'pay',
  breadcrumbName: '充值管理',
  getChildRoutes (location, cb) {
    require.ensure([], (require) => {
      cb(null, [
        require('./recharge/index').default(store),
        require('./orders').default(store),
        // require('./rates').default(store),
        require('./reset').default(store)
      ])
    })
  }
})
