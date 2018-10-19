import { browserHistory } from 'react-router'
import { injectReducer } from '../../../store/reducers'

export default (store) => ({
  path: 'produces',
  breadcrumbName: '生产列表',
  getComponent (nextState, cb) {
    const subMenu = JSON.parse(sessionStorage.getItem('subMenu'))

    if (subMenu) {
      require.ensure([], (require) => {
        const produces = require('./containers/IndexContainer').default
        const reducer = require('./modules/Module').default
        injectReducer(store, { key: 'produce', reducer })
        cb(null, produces)
      }, 'produces')
    } else {
      browserHistory.push('/')
    }
  }
})
