import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Table, Button, Popconfirm, Icon } from 'antd'
import _ from 'lodash'


export default class List extends Component {

  constructor(props) {
    super(props)
    this.columns = [
      {
        title: 'IP 地址',
        dataIndex: 'ip',
        key: 'ip'
      }, {
        title: '操作',
        dataIndex: 'action',
        key: 'action',
        render: (text, record) => {
          return (
            <div>
              {
                _.has(this.props.curd, '100203')
                ?
                  <Popconfirm title={`是否确认删除 IP 地址: [${record.ip}]`} onConfirm={() => this.handleDelete(record)} okText='Yes' cancelText='No'>
                    <Button type='primary'><Icon type='close-circle-o' /> 删除</Button>
                  </Popconfirm>
                :
                  ''
              }
            </div>
          )
        }
      }
    ]
  }

  handleDelete = (record) => {
    const { noPass } = this.props
    if (noPass.items.productId !== '') {
      this.props.onDelete({
        ip: record.ip,
        productId: noPass.items.productId,
        serverId: noPass.items.serverId
      })
    }
  }

  render() {
    const { noPass } = this.props
    let dataSource = []
    _.map(noPass.list, (v, i) => {
      dataSource.push({ ip: v })
    })

    let pagination = {
      showSizeChanger: true,
      defaultPageSize: 50,
      pageSizeOptions: ['20', '50', '100', '200', '500']
    }
    return (
      <div>
        <Table
          dataSource={dataSource}
          columns={this.columns}
          rowKey='ip'
          pagination={{...pagination, total: dataSource.length}}
          bordered
        />
      </div>
    )
  }
}

List.propTypes = {
  curd: PropTypes.object,
  noPass: PropTypes.object,
  onDelete: PropTypes.func
}
