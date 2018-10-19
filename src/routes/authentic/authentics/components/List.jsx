import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Table, Button, Tabs, Popconfirm, Icon } from 'antd'
import _ from 'lodash'
// import moment from 'moment'
const TabPane = Tabs.TabPane

export default class List extends Component {

  constructor(props) {
    super(props)
    this.columns = {
      auth: [
        {
          title: 'IP 地址',
          dataIndex: 'authenticIp',
          key: 'authenticIp'
        }, {
          title: '操作',
          dataIndex: 'action',
          key: 'action',
          render: (text, record) => (
            <div>
              {
                // this.props.options.authorize.includes(140102) &&
                <Popconfirm title={`确认删除 IP 地址 [${record.authenticIp}] 吗?`} onConfirm={() => this.handleDelete(record)} okText='Yes' cancelText='No'>
                  <Button><Icon type='close-circle-o' /> 删除</Button>
                </Popconfirm>
              }
            </div>
          )
        }
      ],
      temp: [
        {
          title: 'IP 地址',
          dataIndex: 'temporaryIp',
          key: 'temporaryIp'
        }, {
          title: '结束时间',
          dataIndex: 'time',
          key: 'time'
        }
      ]
    }

    this.dataSource = {
      auth: [],
      temp: []
    }
  }

  handleDelete = (record) => {
    const dataSource = [...this.dataSource.auth]
    dataSource.splice(_.findIndex(dataSource, function(o) { return o.authenticIp === record.authenticIp }), 1)

    this.dataSource.auth = dataSource
    this.props.onDelete({
      form: {
        ip: record.authenticIp
      }
    })
  }

  render() {
    const { authentic } = this.props.options
    this.dataSource.auth = _.reduce(authentic.list.authenticIps, (result, option) => {
      result.push({ authenticIp: option })
      return result
    }, [])
    this.dataSource.temp = _.reduce(authentic.list.temporaryIps, (result, option, index) => {
      result.push({ temporaryIp: index, time: option })
      return result
    }, [])

    let pagination = {
      showSizeChanger: true,
      defaultPageSize: 50,
      pageSizeOptions: ['20', '50', '100', '200', '500']
    }
    return (
      <div>
        <Tabs defaultActiveKey='1' >
          <TabPane tab='永久白名单' key='1'>
            <Table
              dataSource={this.dataSource.auth}
              columns={this.columns.auth}
              rowKey='authenticIp'
              pagination={{...pagination, total: this.dataSource.auth.length}}
              bordered
            />
          </TabPane>
          <TabPane tab='临时白名单' key='2'>
            <Table
              dataSource={this.dataSource.temp}
              columns={this.columns.temp}
              rowKey='temporaryIp'
              pagination={{...pagination, total: this.dataSource.temp.length}}
              bordered
            />
          </TabPane>
        </Tabs>

      </div>
    )
  }
}

List.propTypes = {
  options: PropTypes.object,
  onDelete: PropTypes.func
}
