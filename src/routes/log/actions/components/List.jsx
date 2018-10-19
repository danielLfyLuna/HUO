import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'
import { Table } from 'antd'
import moment from 'moment'

export default class ActionList extends Component {

  state = {
    currentItem: {},
    modalType: 'update',
    visible: false
  }

  constructor(props) {
    super(props)

    this.columns = [{
        title: '玩家ID',
        dataIndex: 'playerId',
      }, {
        title: '昵称',
        dataIndex: 'nickname',
      }, {
        title: '时间',
        dataIndex: 'time',
        render: (text) => moment(text).format('YYYY-MM-DD HH:mm:ss')
      }, {
        title: '等级',
        dataIndex: 'level',
      }, {
        title: '生产消耗操作类型',
        dataIndex: 'category',
      }, {
        title: '描述',
        dataIndex: 'description',
      }]

    this.data = {
      dataSource: [],
      count: 0
    }
  }

  render() {
    const action = this.props.options.action
    let dataSource = []
    action.actions.map(function(elem) {
      dataSource.push(elem)
    })

    this.data = {
      dataSource: [...dataSource],
      count: dataSource.lenght
    }

    return (
      <Fragment>
        <Table
          bordered
          dataSource={this.data.dataSource}
          columns={this.columns}
          rowKey={record => `${record.playerId}-${Math.random()}`}
          loading={action.fetching}
          pagination={{
            showSizeChanger: true,
            defaultPageSize: 50,
            pageSizeOptions: ['20', '50', '100', '200', '500'],
            total: this.data.count
          }}
        />
      </Fragment>
    )
  }

}

ActionList.propTypes = {
  options: PropTypes.object,
}
