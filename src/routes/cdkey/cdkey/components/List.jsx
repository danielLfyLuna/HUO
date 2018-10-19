import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'
import { Table } from 'antd'
import moment from 'moment'

export default class List extends Component {

  constructor(props) {
    super(props)
    const { initials } = this.props.dataFlow
    this.columns = [
      {
        title: '礼包编号',
        dataIndex: 'activityId',
        key: 'activityId'
      }, {
        title: '产品 ID',
        dataIndex: 'productId',
        key: 'productId'
      }, {
        title: '服务器 ID',
        dataIndex: 'serverId',
        key: 'serverId'
      }, {
        title: '渠道',
        dataIndex: 'channel',
        key: 'channel'
      }, {
        title: '创建者',
        dataIndex: 'creator',
        key: 'creator'
      }, {
        title: '领取状态',
        dataIndex: 'state',
        key: 'state',
        render: (text, record) => {
          return `${initials.map.cdkeyState[record.state]}`
        }
      }, {
        title: '类型',
        dataIndex: 'type',
        key: 'type',
        render: (text, record) => {
          return `${initials.map.cdkeyTypes[record.type]}(${record.type})`
        }
      }, {
        title: '领取时间',
        dataIndex: 'currentDate',
        key: 'currentDate',
        render: (text, record) => {
          return moment(text).format('YYYY-MM-DD HH:mm:ss')
        }
      }, {
        title: '结束时间',
        dataIndex: 'endDate',
        key: 'endDate',
        render: (text, record) => {
          return moment(text).format('YYYY-MM-DD HH:mm:ss')
        }
      }, {
        title: '用户 ID',
        dataIndex: 'userId',
        key: 'userId'
      }, {
        title: '使用量',
        dataIndex: 'usedCount',
        key: 'usedCount'
      }, {
        title: '总量',
        dataIndex: 'num',
        key: 'num'
      }
    ]

    this.dataSource = []
  }

  expandedRowRender = (rewards) => {
    const { options } = this.props.dataFlow
    const columns = [
      {
        title: '道具',
        dataIndex: 'itemId',
        key: 'itemId',
        width: '36%',
        render: (text, record) => {
          return `${options.globals.items[record.itemId]}(${record.itemId})`
        }
      }, {
        title: '数量',
        dataIndex: 'count',
        key: 'count'
      }
    ]

    const dataSource = [...rewards]

    return (
      <Table
        columns={columns}
        dataSource={dataSource}
        rowKey='itemId'
        locale={{emptyText: '此礼包暂无奖励'}}
        pagination={false}
        showHeader={false}
      />
    )
  }

  render() {
    const { options, initials: { paths } } = this.props.dataFlow
    this.dataSource = Object.keys(options.cdkey.query).length ? [{...options.cdkey.query}] : []

    let arrParam = []
    paths.productId && arrParam.push(`产品：${paths.productId}`)
    paths.cdkey && arrParam.push(`CDKey：${paths.cdkey}`)

    const defaultLocale = {
      emptyText: arrParam.length ? `查询：{ ${arrParam.join('，')} }，暂未查到数据` : '未作查询，暂无数据'
    }
    let pagination = {
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
          expandedRowRender={record => this.expandedRowRender(record.activityRewards)}
          rowKey='activityId'
          locale={defaultLocale}
          pagination={pagination}
        />
      </Fragment>
    )
  }
}

List.propTypes = {
  dataFlow: PropTypes.object,
}
