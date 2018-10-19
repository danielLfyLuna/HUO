export default (store) => ({
  path: 'blacklist',
  breadcrumbName: '黑名单',
  getChildRoutes (location, cb) {
    require.ensure([], (require) => {
      cb(null, [
        require('./forgive/index').default(store),
        require('./forbid').default(store),
        require('./userForbid').default(store),
        require('./sensitive').default(store)
      ])
    }, 'blacklist')
  }
})
