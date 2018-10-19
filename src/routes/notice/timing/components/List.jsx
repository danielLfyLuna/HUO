import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'
import { Table, Modal } from 'antd'
import _ from 'lodash'
import moment from 'moment'

import DropOption from './../../../../base/components/DropOption.jsx'
import Detail from './Detail'

export default class List extends Component {

  static propTypes = {
    onDeleteItem: PropTypes.func,
    onStopItem: PropTypes.func,
    onTableChange: PropTypes.func,
    data: PropTypes.array
  }

  state = {
    dataSource: [],
    count: 0,
    editing: {},
    details: {},
    visible: false,
    deleteVisible: false,
    deleteItem: {},
    map: {
      noticeTypes: { 1: '定时', 100: '跑马灯' },
      circleTypes: { 1: '无限循环', 2: '限定次数', 3: '限定时间' },
      timeUnits: { 1: '秒', 2: '分钟', 3: '小时', 4: '天', 5: '永久' }
    },
    pagination: {
      current: 1,
      pageSize: 20,
      total: 0
    }
  }

  constructor(props) {
    super(props)

    this.columns = [{
        title: '标题',
        dataIndex: 'title',
        key: 'title'
      }, {
        title: '公告类型',
        dataIndex: 'type',
        key: 'type',
        render: (text, record) => {
          return (
            this.state.map.noticeTypes[record.type]
          )
        }
      }, {
        title: '循环类型',
        dataIndex: 'circleType',
        key: 'circleType',
        render: (text, record) => {
          return (
            this.state.map.circleTypes[record.circleType]
          )
        }
      }, {
        title: '执行次数／总次数',
        dataIndex: 'count',
        key: 'count',
        width: 200
      }, {
        title: '状态',
        dataIndex: 'open',
        key: 'open',
        render: (text, record) => {
          return (
            record.open ? '执行' : '停止'
          )
        }
      }, {
        title: '时间间隔',
        width: 100,
        dataIndex: 'interval',
        key: 'interval',
        render: (text, record) => {
          return (
            record.interval + this.state.map.timeUnits[record.intervalUnit]
          )
        }
      }, {
        title: '结束时间',
        width: 160,
        dataIndex: 'endTime',
        key: 'endTime'
      }, {
        title: '服务器',
        dataIndex: 'serverIds',
        key: 'serverIds'
      }, {
        title: '操作',
        key: 'operation',
        width: 100,
        render: (text, record) => {
          // const {curd} = this.props
          // if (_.has(curd, '60203')) {
          let menuOptions = [{ key: '0', name: '详情' }]
          record.open ? menuOptions.push({ key: '1', name: '停止' }) : menuOptions.push({ key: '2', name: '删除' })
          return (
            <DropOption
              onMenuClick={e => this.handleMenuClick(record, e)}
              menuOptions={menuOptions}
            />
          )
        }
      }]
  }

  componentWillReceiveProps(nextProps) {
    console.log(this.props.data)
    const list = nextProps.data
    let dataSource = []
    list.map(function(elem, index) {
      dataSource.push({
        key: index,
        id: elem.id,
        productId: elem.productId,
        title: elem.title,
        content: elem.content,
        type: elem.type,
        circleType: elem.circleType,
        count: `${elem.count} / ${elem.maxCount}`,
        open: elem.open,
        interval: elem.interval,
        intervalUnit: elem.intervalUnit,
        endTime: moment(elem.endTime).format('YYYY-MM-DD HH:mm:ss'),
        createTime: moment(elem.endTime).format('YYYY-MM-DD HH:mm:ss'),
        lastExecTime: moment(elem.endTime).format('YYYY-MM-DD HH:mm:ss'),
        serverIds: elem.serverIds
      })
    })
    this.setState({
      dataSource: [...dataSource],
      count: dataSource.length
    })
  }

  onStopItem = (record) => {
    const dataSource = [...this.state.dataSource]
    _.map(dataSource, (val, index) => {
      if (val.key === this.state.editing.key) {
        val = Object.assign(val, record)
      }
    })
    this.setState({
      dataSource: [...dataSource],
      editing: {}
    })
    this.props.onStopItem(record)
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
    this.props.onDeleteItem(deleteItem)
  }

  deleteOnCancel = () => {
    this.setState({
      deleteVisible: false,
      deleteItem: {}
    })
  }

  handleMenuClick = (record, e) => {
    if (e.key === '1') {
      _.map(this.state.dataSource, (val, index) => {
        if (val.key === record.key) {
          val.open = false
          this.setState({
            editing: val
          })
        }
      })
      this.onStopItem(record)
    } if (e.key === '2') {
      this.deleteModalShow(record)
    } else if (e.key === '0') {
      this.handleVisible(record)
    }
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

  handleVisible = (v) => {
    this.setState({
      visible: true,
      details: v
    })
  }

  handleCancel = () => {
    this.setState({
      visible: false,
      details: {}
    })
  }

  render() {
    return (
      <Fragment>
        <Table
          bordered
          dataSource={this.state.dataSource}
          columns={this.columns}
          pagination={{
            showSizeChanger: true,
            defaultPageSize: 20,
            pageSizeOptions: ['20', '50', '100', '200', '500'],
            current: this.state.pagination.current,
            pageSize: this.state.pagination.pageSize,
            total: this.state.pagination.total
          }}
          onChange={this.handleTableChange}
        />
        <Modal
          title='提示'
          visible={this.state.deleteVisible}
          onOk={this.deleteOnOk}
          onCancel={this.deleteOnCancel}
          okText='确认'
          cancelText='取消'
        >
          <p>确定删除此条记录吗? ...</p>
        </Modal>
        <Modal
          title='详情'
          visible={this.state.visible}
          onCancel={this.handleCancel}
          footer={null}
        >
          <Detail
            details={this.state.details}
          />
        </Modal>
      </Fragment>
    )
  }

}
