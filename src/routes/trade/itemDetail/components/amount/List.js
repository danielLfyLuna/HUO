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
        title: '日期',
        dataIndex: 'date',
        key: 'date',
        width: 150
      }, {
        title: '卖家人数',
        dataIndex: 'sellers',
        key: 'sellers',
        sorter: (a, b) => a.sellers - b.sellers
      }, {
        title: '买家人数',
        dataIndex: 'buyers',
        key: 'buyers',
        sorter: (a, b) => a.buyers - b.buyers
      }, {
        title: '参与交易总人数',
        dataIndex: 'totalPartipant',
        key: 'totalPartipant',
        sorter: (a, b) => a.totalPartipant - b.totalPartipant
      }, {
        title: '上架数',
        dataIndex: 'onSellingCount',
        key: 'onSellingCount',
        sorter: (a, b) => a.onSellingCount - b.onSellingCount
      }, {
        title: '成交数',
        dataIndex: 'finishDealCount',
        key: 'finishDealCount',
        sorter: (a, b) => a.finishDealCount - b.finishDealCount
      }, {
        title: '成交金额',
        dataIndex: 'finishDealAmount',
        key: 'finishDealAmount',
        sorter: (a, b) => a.finishDealAmount - b.finishDealAmount
      }, {
        title: '平均成交额',
        dataIndex: 'averageDealAmount',
        key: 'averageDealAmount',
        sorter: (a, b) => a.averageDealAmount - b.averageDealAmount
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
    const {pagination = { current: 1, pageSize: 500, total: 0 }} = nextProps.itemDetails.amount
    console.log(pagination)
    this.setState({
      pagination: {
        current: pagination.pageNum,
        pageSize: pagination.pageSize,
        total: pagination.total
      }
    })
  }

  handleChange = (pagination) => {
    this.props.handleTableChange(pagination, 'amount')
  }

  render() {
    const { itemDetails } = this.props

    return (
      <div>
        <Table
          bordered
          dataSource={itemDetails.amount.domainObject}
          columns={this.columns}
          rowKey='date'
          pagination={{
            // hideOnSinglePage: true,
            defaultPageSize: 500,
            showSizeChanger: true,
            pageSizeOptions: ['50', '100', '200', '500', '1000'],
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
