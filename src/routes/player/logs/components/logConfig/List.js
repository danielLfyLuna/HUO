import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Table, Button, Icon } from 'antd'

export default class List extends Component {

  static propTypes = {
    data: PropTypes.array.isRequired,
    loading: PropTypes.bool,
    clearLogs: PropTypes.func.isRequired
  }

  state = {
    dataSource: []
  }

  constructor(props) {
    super(props)

    this.columns = [{
        title: '玩家ID',
        dataIndex: 'playerId',
        key: 'playerId'
      }, {
        title: '创建时间',
        dataIndex: 'createDate',
        key: 'createDate'
      }, {
        title: '操作',
        key: 'action',
        width: 150,
        render: (text, record) => {
          return (
            <a href={record.url}>
              <Button type='primary'><Icon type='download' />下载</Button>
            </a>
          )
        }
      }]
  }

  componentWillReceiveProps(nextProps) {
    console.log(this.props.data)
    let dataSource = []
    nextProps.data.map(function(elem, index) {
      dataSource.push({key: index, ...elem})
    })
    this.setState({
      dataSource: [...dataSource]
    })
  }

  componentWillUnmount() {
    this.setState({
      dataSource: []
    })
    this.props.clearLogs()
  }

  render() {

    return (
      <div>
        <Table
          bordered
          dataSource={this.state.dataSource}
          // dataSource={this.props.data}
          rowKey='key'
          columns={this.columns}
          loading={this.props.loading}
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
