import { browserHistory } from 'react-router'
import { injectReducer } from '../../../store/reducers'

export default (store) => ({
  path: 'versions',
  breadcrumbName: '节点列表',
  getComponent (nextState, cb) {
    const subMenu = JSON.parse(sessionStorage.getItem('subMenu'))

    if (subMenu) {
      require.ensure([], (require) => {
        const versions = require('./components/Index').default
        const reducer = require('./modules/Module').default
        injectReducer(store, { key: 'version', reducer })
        cb(null, versions)
      }, 'versions')
    } else {
      browserHistory.push('/')
    }
  }
})
