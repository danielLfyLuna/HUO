export default (store) => ({
  path: 'alliance',
  breadcrumbName: '联盟数据',
  getChildRoutes (location, cb) {
    require.ensure([], (require) => {
      cb(null, [
        require('./index/index').default(store),
        require('./member').default(store)
      ])
    })
  }
})
