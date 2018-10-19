import mails from './mails'
import batchPlayer from './mails/components/batchmails'

export default (store) => ({
  path: 'mail',
  breadcrumbName: '邮件',
  childRoutes: [
    mails(store),
    batchPlayer(store)
  ]
})
