import { browserHistory } from 'react-router'
import { injectReducer } from '../../../store/reducers'

export default (store) => ({
  path: 'datachanges',
  breadcrumbName: '数据变化列表',
  getComponent (nextState, cb) {
    const subMenu = JSON.parse(sessionStorage.getItem('subMenu'))

    if (subMenu) {
      require.ensure([], (require) => {
        const produces = require('./containers/IndexContainer').default
        const reducer = require('./modules/Module').default
        injectReducer(store, { key: 'datachange', reducer })
        cb(null, produces)
      }, 'datachanges')
    } else {
      browserHistory.push('/')
    }
  }
})
