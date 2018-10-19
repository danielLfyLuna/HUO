import { browserHistory } from 'react-router'
import { injectReducer } from '../../../store/reducers'

export default (store) => ({
  path: 'actions',
  breadcrumbName: '行为列表',
  getComponent (nextState, cb) {
    const subMenu = JSON.parse(sessionStorage.getItem('subMenu'))

    if (subMenu) {
      require.ensure([], (require) => {
        const action = require('./components/Index').default
        const reducer = require('./modules/Module').default
        injectReducer(store, { key: 'action', reducer })
        cb(null, action)
      }, 'actions')
    } else {
      browserHistory.push('/')
    }
  }
})
