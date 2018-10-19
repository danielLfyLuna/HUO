import sync from './channel'
import blackList from './blackList'
import item from './item'

export default (store) => ({
  path: 'config',
  breadcrumbName: '管理台配置',
  childRoutes: [
    sync(store),
    blackList(store),
    item(store)
  ]
})
