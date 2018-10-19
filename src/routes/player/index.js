import players from './players'
import offline from './offline'
import backpack from './backpack'
import equipage from './equipage'
import archives from './archives'
import resetArmy from './resetArmy'
import logs from './logs'

export default (store) => ({
  path: 'player',
  breadcrumbName: '玩家数据',
  childRoutes: [
    players(store),
    offline(store),
    backpack(store),
    equipage(store),
    archives(store),
    resetArmy(store),
    logs(store)
  ]
})
