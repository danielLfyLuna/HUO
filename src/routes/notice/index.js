import login from './login'
import timing from './timing'
import update from './update'
import mergeNotice from './mergeNotice'
// import maintenanceTip from './maintenance'

export default (store) => ({
  path: 'notice',
  breadcrumbName: '公告',
  childRoutes: [
    timing(store),
    login(store),
    update(store),
    mergeNotice(store)
    // maintenanceTip(store)
  ]
})
