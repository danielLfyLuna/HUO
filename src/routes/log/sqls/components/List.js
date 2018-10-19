import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'
import { Table, Modal } from 'antd'
import _ from 'lodash'

import DropOption from '../../../../base/components/DropOption'
import SqlsModal from './Modal'

export default class List extends Component {

  static propTypes = {
    curd: PropTypes.array,
    execSqls: PropTypes.object.isRequired,
    onExport: PropTypes.func.isRequired,
    options: PropTypes.array.isRequired,
    onExec: PropTypes.func.isRequired,
    onUpdate: PropTypes.func.isRequired,
    onNew: PropTypes.func.isRequired,
    data: PropTypes.array.isRequired,
    onDelete: PropTypes.func.isRequired,
    fetching: PropTypes.bool
  }

  state = {
    currentItem: {}, // 用来为UI层保存字段初始值
    modalType: '',
    visible: false,
    updateVisible: false,
    execVisible: false,
    exportVisible: false,
    newVisible: false,
    deleteVisible: false,
    deleteItem: {}, // 给delete的UI层保存字段
    // 新增及时刷新功能
    dataSource: [],
    count: 0,
    editing: {}
  }

  constructor(props) {
    super(props)
    this.source = {
      1: '业务',
      2: '日志',
      3: '模板',
      4: '跨服',
      5: '本地测试'
    }
    this.columns = [{
        title: 'ID',
        dataIndex: 'id',
        key: 'id'
      }, {
        title: 'name',
        dataIndex: 'name',
        key: 'name'
      }, {
        title: 'type',
        dataIndex: 'type',
        key: 'type',
        render: (text, record) => {
          return this.source[String(text)]
        }
      }, {
        title: 'conditions',
        dataIndex: 'conditions',
        key: 'conditions'
      }, {
        title: 'actions',
        key: 'actions',
        render: (text, record) => {
          let menuOptions = []
          if (this.props.curd.includes('exec-sqls')) menuOptions.push({key: '1', name: '执行'})
          if (this.props.curd.includes('export-sqls')) menuOptions.push({key: '2', name: '导出'})
          if (this.props.curd.includes('update-sqls')) menuOptions.push({key: '3', name: '修改'})
          if (this.props.curd.includes('delete-sqls')) menuOptions.push({key: '4', name: '删除'})

          return (
            <DropOption
              onMenuClick={e => this.handleMenuClick(record, e)}
              menuOptions={menuOptions}
            />
          ) }
      }]
  }

  componentWillReceiveProps(nextProps) {
    const sqls = nextProps.data
    let dataSource = []
    sqls.map(function(elem, index) {
      dataSource.push({key: index, ...elem})
    })
    this.setState({
      dataSource: [...dataSource],
      count: dataSource.length
    })
  }

  handleMenuClick = (record, e) => {
    if (e.key === '5') {
      this.NewexecModalShow(record)
    }
    if (e.key === '4') {
      this.deleteModalShow(record)
    }
    if (e.key === '3') {
      this.updateModalShow(record)
    }
    if (e.key === '2') {
      this.exportModalShow(record)
    }
    if (e.key === '1') {
      this.execModalShow(record)
    }
  }

  onModalLoad = () => {
    return this.state
  }

  handleCancel = (e) => {
    this.setState({
      visible: false
    })
  }

  // 删除
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
    this.props.onDelete(deleteItem)
  }

  deleteOnCancel = () => {
    this.setState({
      deleteVisible: false,
      deleteItem: {}
    })
  }
  // 修改
  updateModalShow = (record) => {
    _.map(this.state.dataSource, (val, index) => {
      if (val.key === record.key) {
        this.setState({
          editing: val,
          currentItem: record,
          updateVisible: true,
          modalType: 'update'
        })
      }
    })
  }

  handleUpdateCancel = (e) => {
    this.setState({
      updateVisible: false
    })
  }

  onUpdate = (fieldsValue) => {
    const dataSource = [...this.state.dataSource]
    _.map(dataSource, (val, index) => {
      if (val.key === this.state.editing.key) {
        val = Object.assign(val, fieldsValue)
      }
    })
    this.setState({
      updateVisible: false,
      dataSource: [...dataSource]
    })
    this.props.onUpdate(fieldsValue)
  }

  // 执行exec
  execModalShow = (record) => {
    this.setState({
      currentItem: record,
      execVisible: true,
      modalType: 'exec'
    })
  }

  handleExecCancel = (e) => {
    this.setState({
      execVisible: false
    })
  }
  // 导出
  exportModalShow = (record) => {
    this.setState({
      currentItem: record,
      exportVisible: true,
      modalType: 'export'
    })
  }

  handleExportCancel = (e) => {
    this.setState({
      exportVisible: false
    })
  }
  // 合服前服务器执行
  NewexecModalShow = (record) => {
    this.setState({
      currentItem: record,
      newVisible: true,
      modalType: 'newExec'
    })
  }

  handleNewExportCancel = (e) => {
    this.setState({
      newVisible: false
    })
  }

  render() {
    const { fetching } = this.props.data

    return (
      <Fragment>
        <Table
          bordered
          dataSource={this.state.dataSource}
          columns={this.columns}
          rowKey='id'
          loading={fetching}
          pagination={{
            showSizeChanger: true,
            defaultPageSize: 50,
            pageSizeOptions: ['20', '50', '100', '200', '500']
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
          <p>确定删除此条记录吗? ...</p>
        </Modal>
        <Modal
          width={700}
          key={Math.random()}
          title='修改 SQL 查询'
          visible={this.state.updateVisible}
          onCancel={this.handleUpdateCancel}
          footer={null}
          maskClosable={false}
        >
          <SqlsModal
            options={this.props.options}
            execSqls={this.props.execSqls}
            onModalLoad={this.onModalLoad}
            onUpdate={this.onUpdate}
            onSubmitting={this.handleUpdateCancel}
          />
        </Modal>
        <Modal
          width={700}
          key={Math.random()}
          title='执行 SQL 查询'
          visible={this.state.execVisible}
          onCancel={this.handleExecCancel}
          footer={null}
          maskClosable={false}
        >
          <SqlsModal
            options={this.props.options}
            onModalLoad={this.onModalLoad}
            onExec={this.props.onExec}
            onSubmitting={this.handleExecCancel}
            execSqls={this.props.execSqls}
          />
        </Modal>
        <Modal
          width={700}
          key={Math.random()}
          title='执行合服前 SQL 查询'
          visible={this.state.newVisible}
          onCancel={this.handleNewExportCancel}
          footer={null}
          maskClosable={false}
        >
          <SqlsModal
            options={this.props.options}
            onModalLoad={this.onModalLoad}
            onSubmitting={this.handleNewExportCancel}
            execSqls={this.props.execSqls}
            onNew={this.props.onNew}
          />
        </Modal>
        <Modal
          width={900}
          key={Math.random()}
          title='导出 SQL 查询'
          visible={this.state.exportVisible}
          onCancel={this.handleExportCancel}
          footer={null}
          maskClosable={false}
        >
          <SqlsModal
            options={this.props.options}
            onModalLoad={this.onModalLoad}
            onExport={this.props.onExport}
            execSqls={this.props.execSqls}
            onSubmitting={this.handleExportCancel}
          />
        </Modal>
      </Fragment>
    )
  }

}
