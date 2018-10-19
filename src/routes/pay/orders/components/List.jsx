import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'
import { Table } from 'antd'
import moment from 'moment'

export default class List extends Component {

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
        title: '平台 ID',
        dataIndex: 'uid',
        key: 'uid'
      }, {
        title: '订单 ID',
        dataIndex: 'orderId',
        key: 'orderId'
      }, {
        title: '物品',
        dataIndex: 'itemName',
        key: 'itemName'
      }, {
        title: '支付渠道',
        dataIndex: 'channel',
        key: 'channel'
      }, {
        title: '人民币',
        dataIndex: 'rmb',
        key: 'rmb'
      }, {
        title: '金额',
        dataIndex: 'amount',
        key: 'amount',
        render: (text, record) => `${text} ${record.currencyUnit}`
      }, {
        title: '货币类型',
        dataIndex: 'currency',
        key: 'currency'
      }, {
        title: '钻石',
        dataIndex: 'coinCount',
        key: 'coinCount'
      }, {
        title: '交易创建时间',
        dataIndex: 'createTime',
        key: 'createTime',
        render: (text, record) => moment(text).format('YYYY-MM-DD HH:mm:ss')
      }, {
        title: '完成时间',
        dataIndex: 'commitTime',
        key: 'commitTime',
        render: (text, record) => moment(text).format('YYYY-MM-DD HH:mm:ss')
      }, {
        title: '充值状态',
        dataIndex: 'orderStatus',
        key: 'orderStatus',
        render: (text, record) => `${initials.map.orderStatus[text]}(${text})`
      }
    ]

    this.dataSource = []
  }

  render() {
    const { params, paths } = this.props.initials
    const options = this.props.options
    this.dataSource = options.pay.orders

    let arrParam = []
    paths.productId && arrParam.push(`产品/服务器：${paths.productId}/${paths.serverId}`)
    params.startTime && arrParam.push(`开始时间：${params.startTime}`)
    params.endTime && arrParam.push(`结束时间：${params.endTime}`)
    params.nickname && arrParam.push(`昵称：${params.nickname}`)
    params.playerId && arrParam.push(`玩家 ID：${params.playerId}`)
    params.orderId && arrParam.push(`订单 ID：${params.orderId}`)
    params.platformId && arrParam.push(`平台 ID：${params.platformId}`)

    const defaultLocale = {
      emptyText: arrParam.length ? `查询：{ ${arrParam.join('，')} }，暂未查到数据` : '未作查询，暂无数据'
    }
    const pagination = {
      showSizeChanger: true,
      defaultPageSize: 50,
      pageSizeOptions: ['20', '50', '100', '200', '500'],
      total: this.dataSource.length,
      showTotal: (total, range) => `第 ${range[0]}-${range[1]} 条 / 共 ${total} 条`
    }
    return (
      <Fragment>
        <Table
          dataSource={this.dataSource}
          columns={this.columns}
          locale={defaultLocale}
          rowKey='orderId'
          pagination={pagination}
          bordered
        />
      </Fragment>
    )
  }
}

List.propTypes = {
  options: PropTypes.object,
  initials: PropTypes.object
}
