import js2excel from 'js2excel'
import moment from 'moment'

const exportItems = (items, info) => {
  const columns = [
    {
      name: '道具 ID',
      prop: 'itemId'
    },
    {
      name: '背包类型',
      prop: 'bagType'
    },
    {
      name: '背包名称',
      prop: 'bagName'
    },
    {
      name: '道具模板 ID',
      prop: 'itemTemplateId'
    },
    {
      name: '道具模板名称',
      prop: 'itemTemplateName'
    },
    {
      name: '数量',
      prop: 'count'
    },
    {
      name: 'pos',
      prop: 'pos'
    },
    {
      name: '强化等级',
      prop: 'intensifyLevel'
    },
    {
      name: '创建时间',
      prop: 'createTime'
    }
  ]

  let rows = []

  items.map((value, index) => {
    rows.push({ ...value, createTime: moment(value.createTime).format('YYYY-MM-DD HH:mm:ss') })
  })

  try {
    js2excel(columns, rows, `${info.nickname}-${info.playerId}-背包道具`)
  } catch (e) {
    console.error('export error')
  }
}

export {
  exportItems
}
