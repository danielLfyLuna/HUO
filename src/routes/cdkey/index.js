export default (store) => ({
  path: 'cdkey',
  breadcrumbName: '兑换码礼包',
  getChildRoutes (location, cb) {
    require.ensure([], (require) => {
      cb(null, [
        require('./cdkeys/index').default(store),
        require('./cdkey').default(store),
        require('./channelgift').default(store),
        require('./setCDKey').default(store)
      ])
    }, 'cdkey')
  }
})
