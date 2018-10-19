import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Table } from 'antd'


export default class List extends Component {
  static propTypes = {
    dataFlow: PropTypes.object,
    onClear: PropTypes.func
  }

  constructor(props) {
    super(props)
    this.columns = [{
        title: 'ID',
        dataIndex: 'id',
        key: 'id'
      }, {
        title: '活动ID',
        dataIndex: 'templateId',
        key: 'templateId'
      }, {
        title: '产品ID',
        dataIndex: 'productId',
        key: 'productId'
      }, {
        title: '服务器ID',
        dataIndex: 'serverId',
        key: 'serverId'
      }, {
        title: '操作时间',
        dataIndex: 'createTime',
        key: 'createTime'
      }, {
        title: '操作人',
        dataIndex: 'adminUserName',
        key: 'adminUserName'
      }, {
        title: '原因',
        dataIndex: 'msg',
        key: 'msg',
      }, {
        title: '是否成功',
        dataIndex: 'success',
        key: 'success',
        render: (text, record) => {
          return text ? '成功' : <span style={{ color: '#FF1111' }}>失败</span>
        }
      }]
  }

  state = {}

  componentWillUnmount() {
    this.props.onClear()
  }

  render() {

    return (
      <div style={{ padding: '20px 30px' }}>
        <Table
          bordered
          rowKey='id'
          dataSource={this.props.dataFlow.options.activity.activities.newCreate.domainObject}
          columns={this.columns}
          pagination={{
            showSizeChanger: true,
            defaultPageSize: 50,
            pageSizeOptions: ['20', '50', '100', '200', '500']
          }}
        />
      </div>
    )
  }

}
