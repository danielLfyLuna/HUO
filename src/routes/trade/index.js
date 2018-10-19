import trades from './trades'
import itemDetail from './itemDetail'

export default (store) => ({
  path: 'trade',
  breadcrumbName: '交易行',
  childRoutes: [
    trades(store),
    itemDetail(store)
  ]
})
