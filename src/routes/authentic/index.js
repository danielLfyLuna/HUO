import authentics from './authentics'
import noPass from './noPass'

export default (store) => ({
  path: 'authentic',
  breadcrumbName: '白名单',
  childRoutes: [
   authentics(store),
   noPass(store)
  ]
})
