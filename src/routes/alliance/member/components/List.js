import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Table, Button } from 'antd'
import moment from 'moment'
import { info } from './alert/DialogAlert'

export default class List extends Component {
  state = {
    dataSource: [],
    count: 0,
    currentItem: {},
    visible: false
  }

  constructor(props) {
    super(props)
    const { initials } = this.props
    this.columns = [
      {
        title: '玩家 ID',
        dataIndex: 'playerId',
        key: 'playerId'
      }, {
        title: '昵称',
        dataIndex: 'nickname',
        key: 'nickname'
      }, {
        title: '性别',
        dataIndex: 'gender',
        key: 'gender',
        render: (text, reason) => {
          return `${initials.map.genderTypes[text]}(${text})`
        }
      }, {
        title: '职业',
        dataIndex: 'job',
        key: 'job',
        render: (text, record) => {
          return `${initials.map.jobTypes[text]}(${text})`
        }
      }, {
        title: 'VIP 等级',
        dataIndex: 'vipLevel',
        key: 'vipLevel'
      }, {
        title: '等级',
        dataIndex: 'level',
        key: 'level'
      }, {
        title: '联盟职位',
        dataIndex: 'office',
        key: 'office',
        render: (text, record) => {
          return `${initials.map.officeTypes[text]}(${text})`
        }
      }, {
        title: '联盟贡献',
        dataIndex: 'currentDevote',
        key: 'currentDevote'
      }, {
        title: '退盟冷却时间',
        dataIndex: 'quitTime',
        key: 'quitTime',
        render: (text, record) => {
          return text ? moment(text).format('YYYY-MM-DD HH:mm:ss') : 0
        }
      }, {
        title: '加入联盟时间',
        dataIndex: 'joinTime',
        key: 'joinTime',
        render: (text, record) => {
          return text ? moment(text).format('YYYY-MM-DD HH:mm:ss') : 0
        }
      }, {
        title: '粮草',
        dataIndex: 'funds',
        key: 'funds'
      }, {
        title: '科技捐献次数',
        dataIndex: 'scienceDonateCount',
        key: 'scienceDonateCount'
      }, {
        title: '操作',
        dataIndex: 'action',
        key: 'action',
        render: (text, record) => {
          return (
            <div>
              <Button onClick={() => info(record.memberDetail, initials.map)}>详情</Button>
            </div>
          )
        }
      }
    ]
    this.dataSource = []
  }

  render() {
    const { products, conf } = this.props.initials
    const options = this.props.options
    this.dataSource = options.alliance.members
    let arrParam = []
    products.productId ? arrParam.push(`产品/服务器：${products.productId}/${products.serverId}`) : ''
    let strParam = arrParam.join(',')
    let defaultLocale = {
      emptyText: conf.locale ? `查询：{ ${strParam} }，暂未查到数据` : '未作查询，暂无数据'
    }
    let pagination = {
      showSizeChanger: true,
      defaultPageSize: 50,
      pageSizeOptions: ['20', '50', '100', '200', '500'],
      total: this.dataSource.length
    }
    return (
      <div>
        <Table
          dataSource={this.dataSource}
          columns={this.columns}
          locale={defaultLocale}
          rowKey='playerId'
          pagination={pagination}
          bordered
        />
      </div>
    )
  }
}

List.propTypes = {
  options: PropTypes.object,
  initials: PropTypes.object
}
