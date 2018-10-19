import { browserHistory } from 'react-router'
import { injectReducer } from '../../../store/reducers'

export default(store) => ({
  path: 'resetarmy',
  breadcrumbName: '重置队伍状态',
  getComponent(location, cb) {
    const subMenu = JSON.parse(sessionStorage.getItem('subMenu'))

    if (subMenu) {
      require.ensure([], (require) => {
        const resetArmys = require('./components/ResetArmyPage').default
        const reducer = require('./modules/ResetArmyModules').default
        injectReducer(store, { key: 'resetArmy', reducer })
        cb(null, resetArmys)
      }, 'resetArmy')
    } else {
      browserHistory.push('/')
    }
  }
})
