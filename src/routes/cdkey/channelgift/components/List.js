import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Table, Modal } from 'antd'
import _ from 'lodash'

import DropOption from '../../../../base/components/DropOption'

export default class List extends Component {

  state = {
    dataSource: [],
    count: 0,
    currentItem: {},
    visible: false,
    deleteVisible: false,
    deleteItem: {}
  }

  constructor(props) {
    super(props)

    this.columns = [{
        title: '渠道礼包码',
        dataIndex: 'channelCdkey',
        key: 'channelCdkey'
      }, {
        title: '渠道',
        dataIndex: 'channel',
        key: 'channel'
      }, {
        title: 'CDkey',
        dataIndex: 'cdkey',
        key: 'cdkey'
      },
      {
        title: '操作',
        key: 'operation',
        width: 100,
        render: (text, record) => {
          return (
            <DropOption
              onMenuClick={e => this.handleMenuClick(record, e)}
              menuOptions={
                [
                  { key: 'delete', name: '删除' }
                ]
              }
            />
          )
        }
      }]
  }

  componentWillReceiveProps(nextProps) {
    const list = nextProps.data ? nextProps.data.channel : []
    let dataSource = []
    list.map(function(elem, index) {
      dataSource.push({key: index, ...elem})
    })
    this.setState({
      dataSource: [...dataSource],
      count: dataSource.length
    })
  }

  handleCancel = (e) => {
    this.setState({
      visible: false
    })
  }

  onModalLoad = () => {
    return this.state
  }

  handleMenuClick = (record, e) => {
    record.productId = this.props.initials.products.productId
    this.deleteModalShow(record)
  }

  deleteModalShow = (deleteItem) => {
    this.setState({
      deleteVisible: true,
      deleteItem: deleteItem
    })
  }

  deleteOnOk = () => {
    const deleteItem = this.state.deleteItem
    const dataSource = [...this.state.dataSource]
    dataSource.splice(_.findIndex(dataSource, function(o) { return o.key === deleteItem.key }), 1)
    this.setState({
      dataSource: [...dataSource],
      deleteVisible: false
    })
    this.props.onDelete({
      productId: deleteItem.productId,
      form: {
        channelCdkey: deleteItem.channelCdkey,
        channel: deleteItem.channel,
        cdkey: deleteItem.cdkey
      }
    })
  }

  deleteOnCancel = () => {
    this.setState({
      deleteVisible: false,
      deleteItem: {}
    })
  }

  render() {
    return (
      <div>
        <Table
          bordered
          dataSource={this.state.dataSource}
          columns={this.columns}
          pagination={{
            showSizeChanger: true,
            defaultPageSize: 50,
            pageSizeOptions: ['10', '20', '30', '50']
          }}
        />
        <Modal
          title='提示'
          visible={this.state.deleteVisible}
          onOk={this.deleteOnOk}
          onCancel={this.deleteOnCancel}
          okText='确认'
          cancelText='取消'
        >
          <p data={this.props.data}>确定删除此条记录吗? ...</p>
        </Modal>
      </div>
    )
  }

}

List.propTypes = {
  data: PropTypes.object,
  initials: PropTypes.object,
  onDelete: PropTypes.func
}
