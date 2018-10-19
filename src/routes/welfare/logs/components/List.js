import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Table, Icon } from 'antd'
import moment from 'moment'

class LogsList extends Component {

  constructor(props) {
    super(props)
    this.columns = [
      { title: '玩家 ID', dataIndex: 'playerId' },
      { title: '昵称', dataIndex: 'nickname' },
      { title: '分组 ID', dataIndex: 'groupId' },
      { title: ' 产品', dataIndex: 'productId' },
      { title: '服务器', dataIndex: 'serverId' },
      { title: 'VIP 等级', dataIndex: 'vipLevel' },
      {
        title: '奖励',
        dataIndex: 'rechargeId',
        render: (text, record) => {
          const { purchases } = this.props.options
          return `${purchases[record.rechargeId]} (${record.rechargeId})`
        }
      },
      {
        title: '状态',
        dataIndex: 'status',
        render: (text, record) => {
          return record.status
            ? <span>成功 <Icon style={{ fontSize: 16, color: 'green' }} type='check' /></span>
            : <span>失败 <Icon style={{ fontSize: 16, color: 'red' }} type='close' /></span>
        }
      },
      { title: '未登陆天数', dataIndex: 'noLoginDays' },
      {
        title: '最后登录时间',
        dataIndex: 'lastedLoginTime',
        render: (text, record) => text ? moment(text).format('YYYY-MM-DD HH:mm:ss') : '-'
      },
      {
        title: '最后登出时间',
        dataIndex: 'lastedLogoutTime',
        render: (text, record) => text ? moment(text).format('YYYY-MM-DD HH:mm:ss') : '-'
      },
      {
        title: '操作时间',
        dataIndex: 'operationTime',
        render: (text, record) => text ? moment(text).format('YYYY-MM-DD HH:mm:ss') : '-'
      }
    ]
  }

  state = {
    data: {
      dataSource: [],
      count: 0
    }
  }

  componentWillReceiveProps(nextProps) {
    const { welfare, route, location } = nextProps.options
    if (
      welfare.keeping.route &&
      welfare.keeping.route != route.path &&
      !location.query.groupId
    ) {
      this.props.onClear()
      this.props.onKeep({
        route: route.path
      })
    }
    this.setState({
      data: {
        dataSource: [...welfare.logs],
        count: welfare.logs.length
      }
    })
  }

  render() {
    let pagination = {
      showSizeChanger: true,
      defaultPageSize: 50,
      pageSizeOptions: ['20', '50', '100', '200', '500'],
      total: this.state.data.count,
      showTotal: (total, range) => `第 ${range[0]}-${range[1]} 条 / 共 ${total} 条`
    }

    return (
      <div>
        <Table
          dataSource={this.state.data.dataSource}
          columns={this.columns}
          // rowKey={record => `${record.groupId}_${Math.random()}`}
          rowKey='id'
          pagination={pagination}
        />
      </div>
    )
  }
}

LogsList.propTypes = {
  options: PropTypes.object,
  onKeep: PropTypes.func,
  onClear: PropTypes.func
}

export default LogsList
