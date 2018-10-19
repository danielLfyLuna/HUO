import { browserHistory } from 'react-router'
import { injectReducer } from '../../../store/reducers'

export default(store) => ({
  path: 'players',
  breadcrumbName: '玩家基础信息',
  getComponent(location, cb) {
    const subMenu = JSON.parse(sessionStorage.getItem('subMenu'))

    if (subMenu) {
      require.ensure([], (require) => {
        const players = require('./components/Index').default
        const reducer = require('./modules/Module').default
        injectReducer(store, { key: 'player', reducer })
        cb(null, players)
      }, 'players')
    } else {
      browserHistory.push('/')
    }
  }
})
