import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Table } from 'antd'

export default class List extends Component {
  static propTypes = {
    itemDetails: PropTypes.object,
    handleTableChange: PropTypes.func
  }

  constructor(props) {
    super(props)
    this.columns = [
      {
        title: '物品ID',
        dataIndex: 'itemId',
        key: 'itemId'
      }, {
        title: '物品名称',
        dataIndex: 'itemName',
        key: 'itemName'
      }, {
        title: '成交笔数',
        dataIndex: 'clinchNum',
        key: 'clinchNum',
        sorter: (a, b) => a.clinchNum - b.clinchNum
      }, {
        title: '成交商品个数',
        dataIndex: 'soldIteamNum',
        key: 'soldIteamNum',
        sorter: (a, b) => a.soldIteamNum - b.soldIteamNum
      }, {
        title: '成交总金额',
        dataIndex: 'soldMoney',
        key: 'soldMoney',
        sorter: (a, b) => a.soldMoney - b.soldMoney
      }, {
        title: '每笔平均金额',
        dataIndex: 'avgSoldMoney',
        key: 'avgSoldMoney',
        sorter: (a, b) => a.avgSoldMoney - b.avgSoldMoney
      }, {
        title: '每笔金额占比',
        dataIndex: 'soldIteamProp',
        key: 'soldIteamProp',
        sorter: (a, b) => a.soldIteamProp - b.soldIteamProp
      }
    ]
  }

  state = {
    pagination: {
      current: 1,
      pageSize: 500,
      total: 0
    }
  }

  componentWillReceiveProps(nextProps) {
    const {pagination = { current: 1, pageSize: 500, total: 0 }} = nextProps.itemDetails.list
    this.setState({
      pagination: {
        current: pagination.pageNum,
        pageSize: pagination.pageSize,
        total: pagination.total
      }
    })
  }

  handleChange = (pagination) => {
    this.props.handleTableChange(pagination, 'detail')
  }

  render() {
    const { itemDetails } = this.props

    return (
      <div>
        <Table
          bordered
          dataSource={itemDetails.list.iteamDetails}
          columns={this.columns}
          rowKey='itemId'
          pagination={{
            defaultPageSize: 500,
            showSizeChanger: true,
            pageSizeOptions: ['20', '50', '100', '200', '500', '1000'],
            current: this.state.pagination.current,
            pageSize: this.state.pagination.pageSize,
            total: this.state.pagination.total
          }}
          onChange={this.handleChange}
        />
      </div>
    )
  }
}
