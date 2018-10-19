import { browserHistory } from 'react-router'
import { injectReducer } from '../../../store/reducers'

export default(store) => ({
  path: 'backpack',
  breadcrumbName: '背包数据信息',
  getComponent(location, cb) {
    const subMenu = JSON.parse(sessionStorage.getItem('subMenu'))

    if (subMenu) {
      require.ensure([], (require) => {
        const backpack = require('./components/Index').default
        const reducer = require('./modules/Module').default
        injectReducer(store, { key: 'backpack', reducer })
        cb(null, backpack)
      }, 'backpack')
    } else {
      browserHistory.push('/')
    }
  }
})
