import { browserHistory } from 'react-router'
import { injectReducer } from '../../../store/reducers'

export default(store) => ({
  path: 'mails',
  breadcrumbName: '邮件列表',
  getComponent(nextState, cb) {
    const subMenu = JSON.parse(sessionStorage.getItem('subMenu'))

    if (subMenu) {
      require.ensure([], (require) => {
        const mails = require('./components/Index').default
        const reducer = require('./modules/Module').default
        injectReducer(store, { key: 'mail', reducer })
        const batchReducer = require('./components/batchmails/index/modules/Module').default
        injectReducer(store, {
          key: 'batchmail',
          reducer: batchReducer
        })
        cb(null, mails)
      }, 'mails')
    } else {
      browserHistory.push('/')
    }
  }
})
