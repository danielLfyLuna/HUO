import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'
import { Table, Modal } from 'antd'
import moment from 'moment'
import _ from 'lodash'

import ModalForms from './Modal'
import Generate from './Generate'
import LogModal from './Log'
import DropOption from '../../../../base/components/DropOption'

export default class CDKeyList extends Component {
  state = {
    data: {
      dataSource: [],
      count: 0,
    },
    modal: {
      currentItem: {},
      modalType: '',
      modalTitle: '',
      visible: false,
      editing: {},
    }
  }

  constructor(props) {
    super(props)
    const { initials } = this.props.dataFlow
    this.columns = [
      {
        title: '礼包编号',
        dataIndex: 'activityId',
        key: 'activityId'
      }, {
        title: '产品 ID',
        dataIndex: 'productId',
        key: 'productId'
      }, {
        title: '标题',
        dataIndex: 'title',
        key: 'title'
      }, {
        title: '类型',
        dataIndex: 'type',
        key: 'type',
        render: (text, record) => {
          return `${initials.map.cdkeyTypes[record.type]}(${record.type})`
        }
      }, {
        title: '开始时间',
        dataIndex: 'beginDate',
        key: 'beginDate',
        render: (text, record) => {
          return moment(text).format('YYYY-MM-DD HH:mm:ss')
        }
      }, {
        title: '结束时间',
        dataIndex: 'endDate',
        key: 'endDate',
        render: (text, record) => {
          return moment(text).format('YYYY-MM-DD HH:mm:ss')
        }
      }, {
        title: '操作',
        dataIndex: 'action',
        key: 'action',
        render: (text, record) => {
          const { options } = this.props.dataFlow
          let menuOptions = []
          options.login.authRoutes.includes('update-cdkey') &&
            menuOptions.push({key: 'UPDATE', name: '编辑兑换码'})
          options.login.authRoutes.includes('create-cdkey') &&
            menuOptions.push({key: 'COPY', name: '拷贝兑换码'})
          options.login.authRoutes.includes('cdkey-generate') &&
            menuOptions.push({key: 'GENERATE', name: '生成 CDKey'})
          options.login.authRoutes.includes('cdkey-logs') &&
            menuOptions.push({key: 'LOGS', name: '生成日志'})
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
      }
    ]
  }

  expandedRowRender = (rewards) => {
    const { options } = this.props.dataFlow
    const columns = [
      {
        title: '道具',
        dataIndex: 'itemId',
        key: 'itemId',
        width: '36%',
        render: (text, record) => {
          return `${options.globals.goods[0][record.itemId]}(${record.itemId})`
        }
      }, {
        title: '数量',
        dataIndex: 'count',
        key: 'count',
      }
    ]

    const dataSource = [...rewards]

    return (
      <Table
        columns={columns}
        dataSource={dataSource}
        rowKey={record => `${record.itemId}-${record.count}`}
        locale={{emptyText: '此礼包暂无奖励'}}
        pagination={false}
        showHeader={false}
      />
    )
  }

  componentWillReceiveProps(nextProps) {
    const cdkey = nextProps.dataFlow.options.cdkey
    let dataSource = []
    cdkey.list.map(function(elem, index) {
      dataSource.push({key: index, ...elem})
    })
    this.setState({
      data: {
        dataSource: [...dataSource],
        count: dataSource.length
      }
    })
  }

  onEditItem = (record) => {
    const dataSource = this.state.data.dataSource
    const flag = dataSource.some(val => val.key === record.key)
    if (flag) {
      this.setState({
        modal: {
          currentItem: record,
          modalType: 'update',
          modalTitle: '编辑兑换码礼包',
          visible: true,
          editing: record
        }
      })
    }
  }

  onCopyItem = (record) => {
    this.setState({
      modal: {
        currentItem: record,
        modalType: 'copy',
        modalTitle: '拷贝兑换码礼包',
        visible: true
      }
    })
  }

  onGenerateItem = (record) => {
    this.setState({
      modal: {
        currentItem: record,
        modalType: 'generate',
        modalTitle: '兑换码生成 CDKey',
        visible: true
      }
    })
  }

  onLogsItem = (record) => {
    this.setState({
      modal: {
        currentItem: record,
        modalType: 'logs',
        modalTitle: '生成日志列表',
        visible: true
      }
    })
  }

  onUpdate = (values) => {
    const dataSource = [...this.state.data.dataSource]
    _.map(dataSource, (val, index) => {
      if (val.key === this.state.modal.editing.key) {
        Object.assign(val, values.form)
      }
    })
    this.setState({
      data: {
        dataSource: [...dataSource],
        count: dataSource.length
      },
      modal: {
        currentItem: {},
        modalType: '',
        modalTitle: '',
        visible: true,
        editing: {}
      }
    })
    this.props.onUpdate(values)
  }

  handleCancel = (e) => {
    this.setState({
      modal: {
        currentItem: {},
        modalType: '',
        modalTitle: '',
        visible: true,
        editing: {}
      }
    })
  }

  onModalLoad = () => {
    return this.state.modal
  }

  handleMenuClick = (record, e) => {
    if (e.key === 'UPDATE') {
      this.onEditItem(record)
    } else if (e.key === 'COPY') {
      this.onCopyItem(record)
    } else if (e.key === 'GENERATE') {
      this.onGenerateItem(record)
    } else if (e.key === 'LOGS') {
      this.onLogsItem(record)
    }
  }

  render() {
    const pagination = {
      showSizeChanger: true,
      defaultPageSize: 50,
      pageSizeOptions: ['20', '50', '100', '200', '500'],
      total: this.state.data.count,
      showTotal: (total, range) => `第 ${range[0]}-${range[1]} 条 / 共 ${total} 条`
    }
    const { modalType, modalTitle, visible } = this.state.modal
    return (
      <Fragment>
        <Table
          dataSource={this.state.data.dataSource}
          columns={this.columns}
          expandedRowRender={record => this.expandedRowRender(record.activityRewards)}
          rowKey='activityId'
          pagination={pagination}
        />
        <Modal
          width={1000}
          key='update-cdkey'
          title={['update', 'copy'].includes(modalType) && modalTitle}
          visible={['update', 'copy'].includes(modalType) && visible}
          onCancel={this.handleCancel}
          footer={null}
          maskClosable={false}
          destroyOnClose
        >
          <ModalForms
            dataFlow={this.props.dataFlow}
            onUpdate={this.onUpdate}
            onCreate={this.props.onCreate}
            onSearch={this.props.onSearch}
            onModalLoad={this.onModalLoad}
            onSubmitting={this.handleCancel}
          />
        </Modal>
        <Modal
          width={1000}
          key='cdkey-generate'
          title={modalType === 'generate' && modalTitle}
          visible={modalType === 'generate' && visible}
          onCancel={this.handleCancel}
          footer={null}
          maskClosable={false}
          destroyOnClose
        >
          <Generate
            dataFlow={this.props.dataFlow}
            onGenerate={this.props.onGenerate}
            onModalLoad={this.onModalLoad}
            onSubmitting={this.handleCancel}
          />
        </Modal>
        <Modal
          width={1100}
          key='cdkey-logs'
          title={modalType === 'logs' && modalTitle}
          visible={modalType === 'logs' && visible}
          onCancel={this.handleCancel}
          footer={null}
          maskClosable={false}
          destroyOnClose
        >
          <LogModal
            dataFlow={this.props.dataFlow}
            onModalLoad={this.onModalLoad}
            onSubmitting={this.handleCancel}
          />
        </Modal>
      </Fragment>
    )
  }
}

CDKeyList.propTypes = {
  dataFlow: PropTypes.object,
  onUpdate: PropTypes.func,
  onCreate: PropTypes.func,
  onSearch: PropTypes.func,
  onGenerate: PropTypes.func,
}
