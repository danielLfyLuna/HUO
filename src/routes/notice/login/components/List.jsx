import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'
import { Table, Modal, Icon } from 'antd'
import moment from 'moment'

import DropOption from '../../../../base/components/DropOption'
import LoginModal from './Forms'

export default class LoginList extends Component {

  static propTypes = {
    dataFlow: PropTypes.object,
    onUpdate: PropTypes.func,
    onDelete: PropTypes.func,
    onOpen: PropTypes.func,
  }

  constructor(props) {
    super(props)
    const { openItems } = this.props.dataFlow.initials.map
    this.columns = [
      {
        title: 'ID',
        dataIndex: 'id'
      },
      {
        title: '产品ID',
        dataIndex: 'productId',
      },
      {
        title: '渠道',
        dataIndex: 'channels'
      },
      {
        title: '创建时间',
        dataIndex: 'createTime',
        render: (text, record) => {
          return moment(record.createTime).format('YYYY-MM-DD HH:mm:ss')
        }
      },
      {
        title: '操作时间',
        dataIndex: 'operationTime',
        render: (text, record) => {
          return moment(record.operationTime).format('YYYY-MM-DD HH:mm:ss')
        }
      },
      {
        title: '状态',
        dataIndex: 'open',
        render: (text, record) => {
          return (
            record.open
            ? <span>{openItems[record.open]} <Icon style={{color: 'green'}} type='check-circle-o' /></span>
            : <span>{openItems[record.open]} <Icon style={{color: 'red'}} type='close-circle-o' /></span>
          )
        }
      },
      {
        title: '操作',
        key: 'operation',
        render: (text, record) => {
          const { options } = this.props.dataFlow
          let menuOptions = []
          options.login.authRoutes.includes('update-login') &&
            record.open === 0 &&
            menuOptions.push({key: 'UPDATE', name: '编辑公告'})
          options.login.authRoutes.includes('delete-login') &&
            record.open === 0 &&
            menuOptions.push({key: 'DELETE', name: '删除公告'})
          options.login.authRoutes.includes('login-status') && (
            record.open
            ? menuOptions.push({key: 'STATUS', name: '关闭公告'})
            : menuOptions.push({key: 'STATUS', name: '开启公告'})
          )

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

    this.state = {
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
  }

  expandedRowRender = (notices) => {

    const columns = [
      {
        title: '标题',
        dataIndex: 'title'
      },
      {
        title: '标签',
        dataIndex: 'label'
      },
      {
        title: '内容',
        dataIndex: 'context'
      }
    ]

    const dataSource = [...notices]

    return (
      <Table
        columns={columns}
        dataSource={dataSource}
        rowKey='index'
        locale={{emptyText: '暂无数据'}}
        pagination={false}
        showHeader={false}
      />
    )
  }

  componentWillReceiveProps(nextProps) {
    const notice = nextProps.dataFlow.options.notice
    let dataSource = []
    notice.login.list.map((elem, index) => {
      dataSource.push({key: index, ...elem})
    })
    this.setState({
      data: {
        dataSource: [...dataSource],
        count: dataSource.length
      }
    })
  }

  handleMenuClick = (record, e) => {
    if (e.key === 'UPDATE') {
      this.onUpdateAction({
        currentItem: record,
        modalType: e.key.toLowerCase()
      })
    } else if (e.key === 'DELETE') {
      this.onDeleteAction({
        currentItem: record,
        modalType: e.key.toLowerCase()
      })
    } else if (e.key === 'STATUS') {
      this.onOpenAction({
        currentItem: record,
        modalType: e.key.toLowerCase()
      })
    }
  }

  onUpdateAction = (fields) => {
    this.setState({
      modal: {
        ...fields,
        modalTitle: '编辑登录公告',
        visible: true
      }
    })
  }

  onDeleteAction = (fields) => {
    this.setState({
      modal: {
        ...fields,
        modalTitle: '删除登录公告',
        visible: true
      }
    })
  }

  onOpenAction = (fields) => {
    this.setState({
      modal: {
        ...fields,
        modalTitle: fields.currentItem.open ? '开启登录公告' : '关闭登录公告',
        visible: true
      }
    })
  }

  deleteOnOk = () => {
    const { currentItem } = this.state.modal
    this.handleCancel()
    this.props.onDelete({
      path: {
        noticeId: currentItem.id
      }
    })
  }

  openOnOk = () => {
    const { currentItem } = this.state.modal
    const { openItems } = this.props.dataFlow.initials.conf
    this.handleCancel()
    this.props.onOpen({
      path: {
        noticeId: currentItem.id,
        open: currentItem.open ? openItems.stop : openItems.open
      }
    })
  }

  handleCancel = () => {
    this.setState({
      modal: {
        currentItem: {},
        modalType: '',
        modalTitle: '',
        visible: false,
      }
    })
  }

  onModalLoad = () => {
    return this.state.modal
  }

  render() {
    const pagination = {
      showSizeChanger: true,
      defaultPageSize: 50,
      pageSizeOptions: ['20', '50', '100', '200', '500'],
      total: this.state.data.count,
      showTotal: (total, range) => `第 ${range[0]}-${range[1]} 条 / 共 ${total} 条`
    }
    const { currentItem, modalType, modalTitle, visible } = this.state.modal

    return (
      <Fragment>
        <Table
          dataSource={this.state.data.dataSource}
          columns={this.columns}
          expandedRowRender={record => this.expandedRowRender(record.noticeLabels)}
          rowKey='id'
          pagination={pagination}
        />
        <Modal
          width={1000}
          key='update-login'
          title={['update'].includes(modalType) && modalTitle}
          visible={['update'].includes(modalType) && visible}
          onCancel={this.handleCancel}
          footer={null}
          maskClosable={false}
          destroyOnClose
        >
          <LoginModal
            dataFlow={this.props.dataFlow}
            onUpdate={this.props.onUpdate}
            onModalLoad={this.onModalLoad}
            onSubmitting={this.handleCancel}
          />
        </Modal>
        <Modal
          key='delete-login'
          title={modalType === 'delete' && modalTitle}
          visible={modalType === 'delete' && visible}
          onOk={this.deleteOnOk}
          onCancel={this.handleCancel}
          okText='确认'
          cancelText='取消'
        >
          <p><Icon type='question-circle' /> 是否确认删除下列公告：</p>
          <p><em>公告：{currentItem.id}</em></p>
        </Modal>
        <Modal
          key='open-login'
          title={modalType === 'status' && modalTitle}
          visible={modalType === 'status' && visible}
          onOk={this.openOnOk}
          onCancel={this.handleCancel}
          okText='确认'
          cancelText='取消'
        >
          <p><Icon type='question-circle' /> 是否确认 {currentItem.open ? '关闭' : '开启'} 下列公告：</p>
          <p><em>公告：{currentItem.id}</em></p>
        </Modal>

      </Fragment>
    )
  }
}
