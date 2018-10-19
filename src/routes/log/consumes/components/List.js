import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'
import { Table } from 'antd'
import moment from 'moment'

export default class List extends Component {

  static propTypes = {
    data: PropTypes.object,
    // consume: PropTypes.object,
    onTableChange: PropTypes.func
  }

  state = {
    dataSource: [],
    currentItem: {},
    modalType: 'update',
    visible: false,
    fields: {
      nickname: {
        value: ''
      },
      playerId: {
        value: ''
      },
      itemId0: {
        value: []
      },
      itemId4: {
        value: []
      },
      itemId5: {
        value: []
      },
      'range-time-picker': {},
      'products': {},
      'consumeSourcesList': {
        value: []
      }
    },
    pagination: {
      current: 1,
      pageSize: 50,
      total: 0
    }
  }

  constructor(props) {
    super(props)
    this.columns = [{
        title: '玩家ID',
        dataIndex: 'playerId',
        key: 'playerId'
      }, {
        title: '昵称',
        dataIndex: 'nickname',
        key: 'nickname'
      }, {
        title: '时间',
        dataIndex: 'createTime',
        key: 'createTime',
        render: (text) => {
          return moment(text).format('YYYY-MM-DD HH:mm:ss')
        }
      }, {
        title: '道具ID',
        dataIndex: 'templateId',
        key: 'templateId'
      }, {
        title: '道具名称',
        dataIndex: 'templateName',
        key: 'templateName'
      }, {
        title: '消耗类型',
        dataIndex: 'consumeComment',
        key: 'consumeComment'
      }, {
        title: '变更数量',
        dataIndex: 'changeCount',
        key: 'changeCount'
      }, {
        title: '变更后数量',
        dataIndex: 'count',
        key: 'count'
      }]
  }

  componentWillReceiveProps(nextProps) {
    const { domainObject = [], pagination = {} } = nextProps.data
    let dataSource = []
    domainObject.map(function(elem, index) {
      dataSource.push({key: index, ...elem})
    })
    this.setState({
      dataSource: [...dataSource],
      pagination: {
        current: pagination.pageNum,
        pageSize: pagination.pageSize,
        total: pagination.total
      }
    })
  }

  handleTableChange = (pagination) => {
    this.setState({
      pagination: {
        current: pagination.current,
        pageSize: pagination.pageSize,
        total: pagination.total
      }
    })
    this.props.onTableChange(pagination)
  }

  render() {
    const { fetching } = this.props.data
    return (
      <Fragment>
        <Table
          bordered
          dataSource={this.state.dataSource}
          columns={this.columns}
          pagination={{
            showSizeChanger: true,
            defaultPageSize: 50,
            pageSizeOptions: ['20', '50', '100', '200', '500'],
            current: this.state.pagination.current,
            pageSize: this.state.pagination.pageSize,
            total: this.state.pagination.total
          }}
          loading={fetching}
          onChange={this.handleTableChange}
         />
      </Fragment>
    )
  }

}
