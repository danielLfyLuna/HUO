import { browserHistory } from 'react-router'
import { injectReducer } from '../../../store/reducers'

export default (store) => ({
  path: 'cdkey-one',
  breadcrumbName: 'CDKey查询',
  getComponent (nextState, cb) {
    const subMenu = JSON.parse(sessionStorage.getItem('subMenu'))

    if (subMenu) {
      require.ensure([], (require) => {
        const Index = require('./components/Index').default
        const reducer = require('../cdkeys/modules/Module').default
        injectReducer(store, { key: 'cdkey', reducer })
        cb(null, Index)
      }, 'cdkey-one')
    } else {
      browserHistory.push('/')
    }
  }
})
