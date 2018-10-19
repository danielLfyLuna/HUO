import { injectReducer } from '../../../store/reducers'
import { browserHistory } from 'react-router'
export default (store) => ({
  path: 'alliances',
  breadcrumbName: '联盟列表',
  getComponent (nextState, cb) {
    const subMenu = JSON.parse(sessionStorage.getItem('subMenu'))
    if (subMenu) {
      require.ensure([], (require) => {
        const Index = require('./containers/IndexContainer').default
        const reducer = require('./modules/Module').default
        injectReducer(store, { key: 'alliance', reducer })
        cb(null, Index)
      }, 'alliances')
    } else {
      browserHistory.push('/')
    }
  }
})
