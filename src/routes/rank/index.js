import rankinglist from './rankinglist'

export default (store) => ({
  path: 'rank',
  breadcrumbName: '排行榜',
  childRoutes: [
   rankinglist(store)
  ]
})
