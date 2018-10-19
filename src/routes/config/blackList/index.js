import {injectReducer} from '../../../store/reducers'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

import { browserHistory } from 'react-router'
export default(store) => ({
  path: 'blacklist',
  breadcrumbName: '道具黑名单',
  getComponent(nextState, cb) {
    const subMenu = JSON.parse(sessionStorage.getItem('subMenu'))

    if (subMenu.includes(110200)) {
      require.ensure([], (require) => {
        NProgress.start()
        const blackList = require('./containers/BlackListContainer').default
        const reducer = require('./modules/BlackListModules').default
        injectReducer(store, {
          key: 'blacklist',
          reducer
        })
        cb(null, blackList)
        NProgress.done()
      }, 'blacklist')
    } else {
      browserHistory.push('/')
    }
  }
})
