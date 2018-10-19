import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Table, Modal } from 'antd'
import _ from 'lodash'

import MocalContainer from './../containers/ModalContainer'
import DropOption from './../../../../base/components/DropOption.jsx'


export default class List extends Component {

  static propTypes = {
    curd: PropTypes.object.isRequired,
    goods: PropTypes.object.isRequired,
    options: PropTypes.array.isRequired,
    data: PropTypes.array.isRequired
  }

  state = {
    dataSource: [],
    count: 0,
    editing: {},
    currentItem: {},
    modalType: 'update',
    visible: false
  }

  constructor(props) {
    super(props)

    this.columns = [{
        title: '版本号',
        dataIndex: 'appversion',
        key: 'appversion',
        width: 80
      }, {
        title: '内容',
        dataIndex: 'content',
        key: 'content',
        render: (text) => {
          return (<div>{text}</div>)
        }
      }, {
        title: '操作',
        key: 'operation',
        width: 100,
        render: (text, record) => {
          const {curd} = this.props
          let menuOptions = []
          _.forEach(curd, (value, key, collection) => {
            switch (key) {
              case '90303':
                menuOptions.push({key: '1', name: '编辑'})
                break
              default:
            }
          })
          return (
            <DropOption
              onMenuClick={e => this.handleMenuClick(record, e)}
              menuOptions={menuOptions}
              dropdownProps={{
                trigger: ['hover']
              }}
            />
          )
        }
      }]

    this.itemColumns = [{
        title: '道具名',
        dataIndex: 'itemId',
        key: 'itemId',
        render: (text, record) => {
          return this.props.goods.options[record.type][text] ? `${this.props.goods.options[record.type][text]}(${text})` : `未找到该道具${text}`
        }
      }, {
        title: '数量',
        dataIndex: 'num',
        key: 'num'
      }]
  }

  // 每次接收props 更新dataSource
  componentWillReceiveProps(nextProps) {
    if (false) { console.log(this.props.data) }
    const list = nextProps.data
    let dataSource = []
    list.map(function(elem, index) {
      dataSource.push({key: index, ...elem})
    })
    this.setState({
      dataSource: [...dataSource],
      count: dataSource.length
    })
  }

  // 编辑弹出框
  onEditItem = (record) => {
    _.map(this.state.dataSource, (val, index) => {
      if (val.key === record.key) {
        this.setState({
          currentItem: record,
          visible: true,
          editing: val
        })
      }
    })
  }

  // 更新表格数据
  onUpdate = (fieldsValue) => {
    const dataSource = [...this.state.dataSource]
    _.map(dataSource, (val, index) => {
      if (val.key === this.state.editing.key) {
        val = Object.assign(val, fieldsValue)
      }
    })
    this.setState({
      visible: false,
      dataSource: [...dataSource],
      editing: {}
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
    if (e.key === '1') {
      this.onEditItem(record)
    }
  }

  expandedRowRender = (data = []) => {
    return (
      <Table
        rowKey='itemId'
        columns={this.itemColumns}
        dataSource={data}
        pagination={false}
        size='small'
      />
    )
  }

  render() {
    return (
      <div>
        <Table
          bordered
          dataSource={this.state.dataSource}
          columns={this.columns}
          expandedRowRender={(record) => this.expandedRowRender(record.rewards)}
          pagination={{
            showSizeChanger: true,
            defaultPageSize: 50,
            pageSizeOptions: ['20', '50', '100', '200', '500']
          }}
        />
        <Modal
          width={700}
          key={Math.random()}
          title='编辑公告'
          visible={this.state.visible}
          onCancel={this.handleCancel}
          footer={null}
          maskClosable={false}
        >
          <MocalContainer
            options={this.props.options}
            onModalLoad={this.onModalLoad}
            onSubmitting={this.handleCancel}
            onUpdate={this.onUpdate}
          />
        </Modal>
      </div>
    )
  }

}
