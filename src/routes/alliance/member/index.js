import { injectReducer } from '../../../store/reducers'
import { browserHistory } from 'react-router'

export default (store) => ({
  path: 'member',
  breadcrumbName: '联盟成员列表',
  getComponent (nextState, cd) {
    const subMenu = JSON.parse(sessionStorage.getItem('subMenu'))
    if (subMenu.includes(130100)) {
      require.ensure([], (require) => {
        const Index = require('./components/Index').default
        const reducer = require('../index/modules/Module').default
        injectReducer(store, { key: 'alliance', reducer })
        cd(null, Index)
      })
    } else {
      browserHistory.push('/')
    }
  }
})
