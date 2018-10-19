// 我们只需要导入初始渲染所需的模块
import moment from 'moment'
import 'moment/locale/zh-cn'

import BaseLayout from '../base/components/BaseLayout'
import Index from './index/components/Index'
import { injectReducer } from '../store/reducers'
import { default as loginReducer } from './../base/modules/Login'
import { default as globalReducer } from './../base/modules/Global'
import { default as productsReducer } from './../base/modules/Products'
import { default as goodsReducer } from './../base/modules/Goods'
import { default as channelsReducer } from './../base/modules/Channels'
import { default as centraReducer } from '../base/modules/Centra'
import { default as groupsReducer } from '../base/modules/Groups'
import { default as itemsReducer } from '../base/modules/Items'
import { default as configsReducer } from '../base/modules/Configs'
import { default as playersReducer } from '../base/modules/Players'
import { default as purchaseReducer } from '../base/modules/Purchase'
import { default as productsCellReducer } from '../base/modules/ProductsCell'

import user from './user'
import config from './config'
import centra from './centra'
import notices from './notice'
import authentic from './authentic'
import mail from './mail'
import player from './player'
import cdkey from './cdkey'
import activity from './activity'
import blacklist from './blacklist'
import pwdChange from './pwdChange'
import log from './log'
import rank from './rank'
import pay from './pay'
import PageNotFound from './PageNotFound'
import Redirect from './PageNotFound/redirect'
import alliance from './alliance'
import welfare from './welfare'
import globalConfig from './globalConfig'
import trade from './trade'

moment.locale('zh-cn')

export const createRoutes = store => ({
  path: '/',
  breadcrumbName: 'Home',
  getComponent(nextState, cb) {
    injectReducer(store, {
      key: 'islogin',
      reducer: loginReducer
    })
    injectReducer(store, {
      key: 'globals',
      reducer: globalReducer
    })
    injectReducer(store, {
      key: 'products',
      reducer: productsReducer
    })
    injectReducer(store, {
      key: 'goods',
      reducer: goodsReducer
    })
    injectReducer(store, {
      key: 'channels',
      reducer: channelsReducer
    })
    injectReducer(store, {
      key: 'centra',
      reducer: centraReducer
    })
    injectReducer(store, {
      key: 'groups',
      reducer: groupsReducer
    })
    injectReducer(store, {
      key: 'items',
      reducer: itemsReducer
    })
    injectReducer(store, {
      key: 'configs',
      reducer: configsReducer
    })
    injectReducer(store, {
      key: 'players',
      reducer: playersReducer
    })
    injectReducer(store, {
      key: 'purchases',
      reducer: purchaseReducer
    })
    injectReducer(store, {
      key: 'productsCell',
      reducer: productsCellReducer
    })
    cb(null, BaseLayout)
  },
  getIndexRoute(location, cb) {
    cb(null, {component: Index})
  },
  childRoutes: [
    user(store),
    centra(store),
    notices(store),
    authentic(store),
    mail(store),
    player(store),
    cdkey(store),
    activity(store),
    blacklist(store),
    config(store),
    rank(store),
    log(store),
    pay(store),
    alliance(store),
    pwdChange(store),
    welfare(store),
    globalConfig(store),
    trade(store),
    PageNotFound(),
    Redirect
  ]
})

export default createRoutes
