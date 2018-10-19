export default (store) => ({
  path: 'batchmail',
  breadcrumbName: '批量上传发邮件',
  intlId: 'APP.MAIL.BATCHMAIL',
  getChildRoutes (location, cb) {
    require.ensure([], (require) => {
      cb(null, [
        require('./batchmailPlayers').default(store)
      ])
    })
  }
})
