import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import { browserHistory } from 'react-router'
import { injectReducer } from '../../../store/reducers'

export default (store) => ({
  path: 'update',
  breadcrumbName: '更新公告列表',
  intlId: 'APP.NOTICES.UPDATE',
  getComponent (nextState, cb) {
    const subMenu = JSON.parse(sessionStorage.getItem('subMenu'))

    if (subMenu) {
      require.ensure([], (require) => {
        NProgress.start()
        const notices = require('./containers/IndexContainer').default
        const reducer = require('./modules/Module').default
        injectReducer(store, { key: 'updateNotice', reducer })
        cb(null, notices)
        NProgress.done()
      })
    } else {
      browserHistory.push('/')
  }
  }
})
