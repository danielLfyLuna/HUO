import { browserHistory } from 'react-router'
import { injectReducer } from '../../../store/reducers'

export default(store) => ({
  path: 'equipages',
  breadcrumbName: '数据列表',
  getComponent(location, cb) {
    const subMenu = JSON.parse(sessionStorage.getItem('subMenu'))

    if (subMenu) {
      require.ensure([], (require) => {
        const equipage = require('./components/Index').default
        const reducer = require('./modules/Module').default
        injectReducer(store, { key: 'equipage', reducer })
        cb(null, equipage)
      }, 'equipages')
    } else {
      browserHistory.push('/')
    }
  }
})
