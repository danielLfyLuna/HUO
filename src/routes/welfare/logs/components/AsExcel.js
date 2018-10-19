import js2excel from 'js2excel'
import moment from 'moment'

function welfareLogs (itemData, recordData) {
  const columns = [
    {
      name: '玩家 ID',
      prop: 'playerId'
    },
    {
      name: '昵称',
      prop: 'nickname'
    },
    {
      name: '分组 ID',
      prop: 'groupId'
    },
    {
      name: '产品',
      prop: 'productId'
    },
    {
      name: '服务器',
      prop: 'serverId'
    },
    {
      name: 'VIP 等级',
      prop: 'vipLevel'
    },
    {
      name: '奖励',
      prop: 'rechargeId'
    },
    {
      name: '状态',
      prop: 'status'
    },
    {
      name: '未登录天数',
      prop: 'noLoginDays'
    },
    {
      name: '最后登录时间',
      prop: 'lastedLoginTime'
    },
    {
      name: '最后登出时间',
      prop: 'lastedLogoutTime'
    },
    {
      name: '操作时间',
      prop: 'operationTime'
    }
  ]

  const rows = itemData.map((item, idx) => ({
    ...item,
    rechargeId: `${recordData.purchases[item.rechargeId]} (${item.rechargeId})`,
    status: `${item.status ? '成功' : '失败'} (${item.status})`,
    lastedLoginTime: item.lastedLoginTime ? moment(item.lastedLoginTime).format('YYYY-MM-DD HH:mm:ss') : '-',
    lastedLogoutTime: item.lastedLogoutTime ? moment(item.lastedLogoutTime).format('YYYY-MM-DD HH:mm:ss') : '-',
    operationTime: moment(item.operationTime).format('YYYY-MM-DD HH:mm:ss')
  }))
  try {
    let logTitle = recordData.logTitle || '托管福利日志'
    if (recordData.groupId) logTitle = `${logTitle}_${recordData.groupId}`
    // if (recordData.playerId) {
    //   let value = `${logTitle}_${recordData.playerId}`
    // }
    js2excel(columns, rows, logTitle)
  } catch (e) {
    console.error('export error')
  }
}

export {
  welfareLogs
}
