import { browserHistory } from 'react-router'

export default(store) => ({
  path: 'items',
  breadcrumbName: '道具列表',
  getComponent(nextState, cb) {
    const subMenu = JSON.parse(sessionStorage.getItem('subMenu'))
    if (subMenu.includes(110100)) {
      require.ensure([], (require) => {
        const items = require('./containers/ItemContainer').default
        // 回调
        cb(null, items)
      }, 'items')
    } else {
      browserHistory.push('/')
    }
  }
})
