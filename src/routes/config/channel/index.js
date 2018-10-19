import {injectReducer} from '../../../store/reducers'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

import { browserHistory } from 'react-router'
export default(store) => ({
  path: 'channels',
  breadcrumbName: '渠道列表',
  getComponent(nextState, cb) {
    const subMenu = JSON.parse(sessionStorage.getItem('subMenu'))

    if (subMenu.includes(110300)) {
      require.ensure([], (require) => {
        NProgress.start()
        const channel = require('./containers/ChannelContainer').default
        const reducer = require('./modules/ChannelModules').default
        injectReducer(store, {
          key: 'channel',
          reducer
        })
        cb(null, channel)
        NProgress.done()
      }, 'channels')
    } else {
      browserHistory.push('/')
    }
  }
})
