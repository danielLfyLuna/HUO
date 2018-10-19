import { injectReducer } from '../../../../store/reducers'
import { browserHistory } from 'react-router'
export default (store) => ({
  path: 'sqllog',
  breadcrumbName: 'sql玩家日志',
  getComponent (nextState, cb) {
    const subMenu = JSON.parse(sessionStorage.getItem('subMenu'))
    if (subMenu) {
      require.ensure([], (require) => {
        const Index = require('./sqllog').default
        const reducer = require('./Module').default
        injectReducer(store, { key: 'sqllog', reducer })
        cb(null, Index)
      })
    } else {
      browserHistory.push('/')
    }
  }
})
