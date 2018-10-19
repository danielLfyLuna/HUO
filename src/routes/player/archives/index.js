import { browserHistory } from 'react-router'
import { injectReducer } from '../../../store/reducers'

export default(store) => ({
  path: 'archives',
  breadcrumbName: '玩家数据记录',
  getComponent(location, cb) {
    const subMenu = JSON.parse(sessionStorage.getItem('subMenu'))

    if (subMenu) {
      require.ensure([], (require) => {
        const archive = require('./components/Index').default
        const reducer = require('./modules/Module').default
        injectReducer(store, { key: 'archive', reducer })
        cb(null, archive)
      }, 'archives')
    } else {
      browserHistory.push('/')
    }
  }
})
