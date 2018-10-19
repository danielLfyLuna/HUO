import refreshwipe from './refreshwipe'

export default (store) => ({
  path: 'globalConfig',
  breadcrumbName: '服务器全局配置',
  childRoutes: [
    refreshwipe(store)
  ]
})
