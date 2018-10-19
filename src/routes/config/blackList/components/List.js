import React, {Component} from 'react'
import PropTypes from 'prop-types'
import { Table } from 'antd'


const rewardType = { 0: '物品', 1: '装备', 2: '2', 3: '3', 4: '技能', 5: '武将' }  // 物品0 装备1 技能4 武将5
// 1.装备 2.将魂 [3.圣魂] [4.技能] [5.神兵] [6.天命] 7.珍宝 8.消耗 10.小马 11.大马
const itemType = { 0: '0', 1: '装备', 2: '将魂', 3: '圣魂', 4: '技能', 5: '神兵', 6: '天命', 7: '珍宝', 8: '消耗', 10: '小马', 11: '大马' }
const quality = { 0: '0无品', 1: '白', 2: '绿', 3: '蓝', 4: '紫', 5: '橙' }  // 品级（1,2,3,4,5代表白，绿，蓝，紫，橙）



export default class List extends Component {

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
        filters: [
          { text: '物品', value: 0 },
          { text: '装备', value: 1 },
          { text: '技能', value: 4 },
          { text: '武将', value: 5 },
        ],
        onFilter: (value, record) => record.rewardType == value,
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
      { title: '等级', dataIndex: 'level', key: 'level' }
    ]
  }

  render() {
    const {debounce} = this.props
    return (
      <div>
        <Table
          bordered
          dataSource={this.props.data.list}
          loading={debounce}
          columns={this.columns}
          rowKey='itemId'
        />
      </div>
    )
  }

  componentDidUpdate() {  // 可以修改DOM
  }

  componentWillUnmount() {

  }

  componentWillReceiveProps(nextProps, nextState) {
  }

  shouldComponentUpdate(nextProps, nextState) {
        return true
  }
}

List.propTypes = {
  data: PropTypes.object,
  debounce: PropTypes.bool
}
