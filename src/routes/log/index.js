import operations from './operations'
import consumes from './consumes'
import produces from './produces'
import actions from './actions'
import sqls from './sqls'
import sqllog from './sqls/sqllog/index'
import changes from './changes'
import logSource from './logSource'

export default (store) => ({
  path: 'log',
  breadcrumbName: '日志',
  childRoutes: [
    operations(store),
    consumes(store),
    produces(store),
    actions(store),
    sqls(store),
    sqllog(store),
    changes(store),
    logSource(store)
  ]
})
