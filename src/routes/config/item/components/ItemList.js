import React, {Component} from 'react'
import PropTypes from 'prop-types'
import { Table } from 'antd'

import DropOption from '../../../../base/components/DropOption'

  const rewardType = { 0: '物品', 1: '装备', 2: '2', 3: '3', 4: '技能', 5: '武将' }  // 物品0 装备1 技能4 武将5
  // 1.装备 2.将魂 [3.圣魂] [4.技能] [5.神兵] [6.天命] 7.珍宝 8.消耗 10.小马 11.大马
  const itemType = { 0: '0', 1: '装备', 2: '将魂', 3: '圣魂', 4: '技能', 5: '神兵', 6: '天命', 7: '珍宝', 8: '消耗', 10: '小马', 11: '大马' }
  const quality = { 0: '0无品', 1: '白', 2: '绿', 3: '蓝', 4: '紫', 5: '橙' }  // 品级（1,2,3,4,5代表白，绿，蓝，紫，橙）
  const inblack = { 0: '否', 1: '是' }

export default class ItemList extends Component {

  constructor(props) {
    super(props)
    this.columns = [
      { title: 'ID', dataIndex: 'itemId', key: 'itemId' },
      {
        title: '奖励类型',
        dataIndex: 'rewradType',
        key: 'rewradType',
        render: (text, record) => {
          return (
            rewardType[record.rewardType]
          )
        },
        defaultSortOrder: 'descend',
        sorter: (a, b) => a.rewardType - b.rewardType
      },
      { title: '名称', dataIndex: 'name', key: 'name' },
      {
        title: '物品类型',
        dataIndex: 'type',
        key: 'type',
        render: (text, record) => {
          return (
            itemType[record.type]
          )
        },
        defaultSortOrder: 'descend',
        sorter: (a, b) => a.type - b.type
      },
      { title: '绑定', dataIndex: 'binding', key: 'binding' },
      {
        title: '品质',
        dataIndex: 'quality',
        key: 'quality',
        render: (text, record) => {
          return (quality[record.quality])
        }
      },
      { title: '等级', dataIndex: 'level', key: 'level' },
      {
        title: '禁用',
        dataIndex: 'inblack',
        key: 'inblack',
        render: (text, record) => {
          return (inblack[record.inblack])
        },
        defaultSortOrder: 'descend',
        sorter: (a, b) => a.inblack - b.inblack
      },
      {
       title: '操作',
       dataIndex: 'action',
       render: (text, record) => {
         let menuOptions = []
         menuOptions.push({key: 'addblack', name: '禁用'})
         menuOptions.push({key: 'removeblack', name: '解禁'})

         return (
           <DropOption
             onMenuClick={e => this.handleMenuClick(record, e)}
             menuOptions={menuOptions}
             dropdownProps={{
               trigger: ['hover']
             }}
           />
         )
       }
     }
    ]
  }


  handleMenuClick = (record, e) => {
    const { editBlackRewardItem } = this.props
    if (e.key === 'addblack') {
      editBlackRewardItem(record.itemId, record.rewardType, 1)
    }

    if (e.key === 'removeblack') {
      editBlackRewardItem(record.itemId, record.rewardType, 0)
    }
  }

  render() {
    const {debounce} = this.props
    return (
      <div>
        <Table
          bordered
          rowKey='itemId'
          dataSource={this.props.data}
          loading={debounce}
          columns={this.columns}
          size='small'
          pagination={{
            showSizeChanger: true,
            defaultPageSize: 500,
            pageSizeOptions: ['20', '50', '100', '200', '500']
          }}
        />
      </div>
    )
  }
}

ItemList.propTypes = {
  data: PropTypes.array,
  debounce: PropTypes.bool,
  editBlackRewardItem: PropTypes.func
}
