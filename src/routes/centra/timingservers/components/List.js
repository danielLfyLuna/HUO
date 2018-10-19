import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Table } from 'antd'
import _ from 'lodash'

import DropOption from '../../../../base/components/DropOption.jsx'


export default class List extends Component {
  state = {
    dataSource: [],
    count: 0,
    editing: {},
    currentItem: {},
    modalType: 'update',
    visible: false
  }


  onDelete = (record, e) => {
    this.props.onDelete(record)
  }

  constructor(props) {
    super(props)
    this.columns = [
      {
        title: '产品 ID',
        dataIndex: 'productId',
        key: 'productId'
      }, {
        title: '服务器',
        dataIndex: 'serverId',
        key: 'serverId'
      }, {
        title: '开服时间',
        dataIndex: 'originTime',
        key: 'originTime'
      }, {
        title: '完成状态',
        dataIndex: 'done',
        key: 'done',
        render: (text, record) => {
          return text ? '是' : <span style={{ color: '#ff3300' }}>否</span>
        }
      }, {
        title: '操作',
        dataIndex: 'action',
        render: (text, record) => {
          let menuOptions = []
          if (_.has(this.props.login.curd, '20702')) {
            menuOptions.push({key: 'DELETE', name: '删除'})
          }

          return (
            <DropOption
              onMenuClick={e => this.onDelete(record, e)}
              menuOptions={menuOptions}
              dropdownProps={{
                trigger: ['hover']
              }}
            />
          )
        }
      }
    ]
  }

  componentWillReceiveProps(nextProps) {
    const group = nextProps.data
    let dataSource = []
    group.map(function(elem, index) {
      dataSource.push({key: index, ...elem})
    })
    this.setState({
      dataSource: [...dataSource],
      count: dataSource.length
    })
  }

  render() {
    let pagination = {
      showSizeChanger: true,
      defaultPageSize: 50,
      pageSizeOptions: ['20', '50', '100', '200', '500'],
      total: this.state.count
    }

    return (
      <div>
        <Table bordered dataSource={this.props.data} columns={this.columns} rowKey='version' pagination={pagination} />
      </div>
    )
  }

}

List.propTypes = {
  login: PropTypes.object,
  data: PropTypes.array,
  onDelete: PropTypes.func
}
