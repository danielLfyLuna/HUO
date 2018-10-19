import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Table, Button, Modal } from 'antd'
import _ from 'lodash'
// import moment from 'moment'

export default class List extends Component {
  state = {
    visible: false,
    deleteItem: {}
  }

  constructor(props) {
    super(props)
    this.columns = [
      {
        title: '产品 ID',
        dataIndex: 'productId',
        key: 'productId'
      }, {
        title: '金额',
        dataIndex: 'amount',
        key: 'amount'
      }, {
        title: '倍率',
        dataIndex: 'rate',
        key: 'rate'
      }, {
        title: '',
        dataIndex: 'action',
        key: 'action',
        render: (text, record) => {
          return (
            <div>
              <Button onClick={() => this.handleDelete(record)}>删除</Button>
            </div>
          )
        }
      }
    ]

    this.dataSource = []
  }

  handleDelete = (record) => {
    this.setState({
      visible: true,
      deleteItem: record
    })
  }

  onOK = () => {
    const deleteItem = this.state.deleteItem
    const dataSource = [...this.dataSource]
    dataSource.splice(_.findIndex(dataSource, function(o) { return o.amount === deleteItem.amount }), 1)
    this.setState({
      visible: false
    })
    this.dataSource = dataSource
    this.props.onDelete(deleteItem)
  }

  OnCancel = () => {
    this.setState({
      visible: false,
      deleteItem: {}
    })
  }

  render() {
    const { products, conf } = this.props.initials
    const options = this.props.options
    this.dataSource = options.recharge.rates
    let arrParam = []
    products.productId ? arrParam.push(`产品/服务器：${products.productId}/${products.serverId}`) : ''
    let strParam = arrParam.join('，')
    let defaultLocale = {
      emptyText: conf.locale ? `查询：{ ${strParam} }，暂未查到数据` : '未作查询，暂无数据'
    }
    let pagination = {
      showSizeChanger: true,
      defaultPageSize: 50,
      pageSizeOptions: ['20', '50', '100', '200', '500'],
      total: this.dataSource.length
    }
    return (
      <div>
        <Table
          dataSource={this.dataSource}
          columns={this.columns}
          locale={defaultLocale}
          rowKey='amount'
          pagination={pagination}
          bordered
        />

        <Modal
          title='提示'
          visible={this.state.deleteVisible}
          onOk={this.onOK}
          onCancel={this.OnCancel}
          okText='确认'
          cancelText='取消'
        >
          <p>确定删除此条记录吗? ...</p>
        </Modal>

      </div>
    )
  }
}

List.propTypes = {
  options: PropTypes.object,
  initials: PropTypes.object,
  onDelete: PropTypes.func
}
