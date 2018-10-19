import {injectReducer} from '../../../store/reducers'
import { browserHistory } from 'react-router'

export default(store) => ({
  path: 'ranking',
  breadcrumbName: '排行榜列表',
  getComponent(nextState, cb) {
    const subMenu = JSON.parse(sessionStorage.getItem('subMenu'))

    if (subMenu.includes(110200)) {
      require.ensure([], (require) => {
        const rankinglist = require('./containers/RankContainer').default
        const reducer = require('./modules/RankModules').default
        injectReducer(store, {
          key: 'ranks',
          reducer
        })
        cb(null, rankinglist)
      }, 'rankinglist')
    } else {
      browserHistory.push('/')
    }
  }
})
