export default (store) => ({
  path: 'activity',
  breadcrumbName: '活动配置',
  getChildRoutes (location, cb) {
    require.ensure([], (require) => {
      cb(null, [
        require('./activities/index').default(store),
        require('./templates').default(store)
      ])
    })
  }
})
