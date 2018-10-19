import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'
import { Table, Dropdown, Button, Icon, Menu, Modal } from 'antd'

export default class MailList extends Component {

  state = {
    data: {
      dataSource: [],
      count: 0
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
    this.columns = [{
        title: 'MailId',
        dataIndex: 'id',
      }, {
        title: '产品ID',
        dataIndex: 'productId',
      }, {
        title: '服务器ID',
        dataIndex: 'serverIds',
      }, {
        title: '邮件标题',
        dataIndex: 'title',
      }, {
        title: '邮件内容',
        dataIndex: 'context',
      }, {
        title: '操作时间',
        dataIndex: 'createTime',
      }, {
        title: '邮件状态',
        dataIndex: 'status',
        render: (text, record, index) => {
          if (record.status === 0) { return <div>未发送</div> }
          if (record.status === 1) { return <div style={{color: '#0fd233'}}>发送成功</div> }
          if (record.status === 2) { return <div style={{color: '#ce1c40'}}>发送失败</div> }
          if (record.status === 3) { return <div style={{color: '#cec21c'}}>审核中</div> }
          if (record.status === 4) { return <div style={{color: '#9907d5'}}>审核通过</div> }
          if (record.status === 5) { return <div style={{color: '#ce1c40'}}>审核未通过</div> }
        }
      }, {
        title: '操作',
        render: (text, record, index, e) => {
          const { authRoutes } = this.props.options.login
          let menus = []
          authRoutes.includes('mail-detail') &&
            menus.push(<Menu.Item key='READ'>邮件详情</Menu.Item>)
          authRoutes.includes('mail-copy') &&
            menus.push(<Menu.Item key='COPY'>拷贝邮件</Menu.Item>)
          authRoutes.includes('mail-update') &&
            record.status === 0 &&
            menus.push(<Menu.Item key='UPDATE'>修改邮件</Menu.Item>)
          authRoutes.includes('mail-send') &&
            menus.push(<Menu.Item key='SEND'>发送邮件</Menu.Item>)
          authRoutes.includes('mail-check') &&
            record.status === 3 &&
            menus.push(<Menu.Item key='PASS'>审核通过</Menu.Item>)
          authRoutes.includes('mail-check') &&
            record.status === 3 &&
            menus.push(<Menu.Item key='DENY'>审核拒绝</Menu.Item>)
          return (
            <Dropdown overlay={
              <Menu onClick={e => this.handleMenuClick(record, e)}>
                {menus}
              </Menu>}
            >
              <Button type='default'>
                <Icon type='bars' />
                <Icon type='down' />
              </Button>
            </Dropdown>
          )
        }
      }]

  }

  expandedRowRender = (rewards) => {
    const { options, initials } = this.props
    const columns = [
      {
        title: '道具',
        dataIndex: 'itemId',
        key: 'itemId',
        width: '50%',
        render: (text, record) => {
          return `${options.goods[initials.conf.itemTypes.item][record.itemId]}(${record.itemId})`
        }
      }, {
        title: '数量',
        dataIndex: 'count',
        key: 'count',
        width: '50%'
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
    const mailType = nextProps.mailType
    const mails = nextProps.options.mail[mailType].list
    let dataSource = []
    mails.map((elem, index) => dataSource.push({ key: index, ...elem }))
    this.setState({
      data: {
        dataSource: [...dataSource],
        count: dataSource.length
      }
    })
  }

  onCopyAction = (record) => {
    this.setState({
      modal: {
        currentItem: { ...record },
        modalType: record.modalType,
        modalTitle: '拷贝邮件',
        visible: true,
        editing: { ...record },
      }
    })
  }

  onUpdateAction = (record) => {
    this.setState({
      modal: {
        currentItem: { ...record },
        modalType: record.modalType,
        modalTitle: '修改邮件',
        visible: true,
        editing: { ...record },
      }
    })
  }

  onSendAction = (record) => {
    Modal.confirm({
      title: '确认要发送邮件吗？',
      content: '确认发送邮件请按 <确认> 按钮，终止发送邮件请按 <取消> 按钮！',
      okText: '确认',
      cancelText: '取消',
      onOk: () => {
        this.props.onSend({
          path: { mailId: record.id },
          form: { ...record },
          handle: this.props.mailType.toUpperCase()
        })
      }
    })
  }

  onPassAction = (record) => {
    this.setState({
      modal: {
        currentItem: { ...record },
        modalType: record.modalType,
        modalTitle: '审核邮件',
        visible: true,
        editing: { ...record },
      }
    })
  }

  onReadAction = (record) => {
    this.setState({
      modal: {
        currentItem: { ...record },
        modalType: record.modalType,
        modalTitle: '邮件详情',
        visible: true,
        editing: { ...record },
      }
    })
  }

  handleMenuClick = (record, e) => {
    if (e.key === 'COPY') {
      this.onCopyAction({ ...record, modalType: e.key.toLowerCase() })
    } else if (e.key === 'UPDATE') {
      this.onUpdateAction({ ...record, modalType: e.key.toLowerCase() })
    } else if (e.key === 'PASS' || e.key === 'DENY') {
      this.onPassAction({ ...record, modalType: e.key.toLowerCase() })
    } else if (e.key === 'SEND') {
      this.onSendAction({ ...record, modalType: e.key.toLowerCase() })
    } else if (e.key === 'READ') {
      this.onReadAction({ ...record, modalType: e.key.toLowerCase() })
    }

  }

  handleCancel = () => {
    this.setState({
      modal: {
        currentItem: {},
        modalType: '',
        modalTitle: '',
        visible: false,
        editing: {},
      }
    })
  }

  onActionOK = () => {
    const { conf } = this.props.initials
    const { currentItem, modalType } = this.state.modal
    this.props.onPass({
      path: {
        mailType: this.props.mailType,
        mailId: currentItem.id,
        mailStatus: conf.mailStatus[modalType]
      }
    })
    this.setState({
      modal: {
        currentItem: {},
        modalType: '',
        modalTitle: '',
        visible: false,
        editing: {},
      }
    })
  }

  onModalLoad = () => {
    return this.state.modal
  }

  render() {
    const { mailType, initials } = this.props

    const Mails = require(`./${mailType}/Mails`).default
    const Details = require(`./${mailType}/Detail`).default

    const { modalType, modalTitle, visible } = this.state.modal

    let pagination = {
      showSizeChanger: true,
      defaultPageSize: 50,
      pageSizeOptions: ['20', '50', '100', '200', '500'],
      total: this.state.data.count
    }

    return (
      <Fragment>
        <Table
          dataSource={this.state.data.dataSource}
          columns={this.columns}
          expandedRowRender={record => this.expandedRowRender(record.rewards)}
          rowKey='id'
          pagination={pagination}
          bordered
        />
        <Modal
          width={1000}
          key={`update-${mailType}-mail`}
          title={['update', 'copy'].includes(modalType) && modalTitle}
          visible={['update', 'copy'].includes(modalType) && visible}
          onCancel={this.handleCancel}
          footer={null}
          maskClosable={false}
          destroyOnClose
        >
          <Mails
            options={this.props.options}
            initials={this.props.initials}
            mailType={this.props.mailType}
            onUpdate={this.props.onUpdate}
            onCreate={this.props.onCreate}
            onFetch={this.props.onFetch}
            onModalLoad={this.onModalLoad}
            onSubmitting={this.handleCancel}
          />
        </Modal>
        <Modal
          width={1200}
          key={`detail-${mailType}-mail`}
          title={['read'].includes(modalType) && modalTitle}
          visible={['read'].includes(modalType) && visible}
          onCancel={this.handleCancel}
          footer={null}
          maskClosable={false}
          destroyOnClose
        >
          <Details
            options={this.props.options}
            initials={this.props.initials}
            mailType={this.props.mailType}
            onFetch={this.props.onFetch}
            onModalLoad={this.onModalLoad}
            onSubmitting={this.handleCancel}
            changeReceiver={this.props.changeReceiver}
          />
        </Modal>
        <Modal
          width={600}
          key='approve-mail'
          title={['pass', 'deny'].includes(modalType) && modalTitle}
          visible={['pass', 'deny'].includes(modalType) && visible}
          onOk={this.onActionOK}
          onCancel={this.handleCancel}
          okText='确认'
          cancelText='取消'
        >
          <div>
            <Icon type='question-circle-o' style={{ fontSize: 24, color: '#f00' }} />
            确定 {initials.conf.passState[this.state.modal.modalType]} 这封邮件吗? ...
          </div>
        </Modal>
      </Fragment>
    )
  }

}

MailList.propTypes = {
  options: PropTypes.object,
  initials: PropTypes.object,
  mailType: PropTypes.string,
  onUpdate: PropTypes.func,
  onCreate: PropTypes.func,
  onFetch: PropTypes.func,
  onSend: PropTypes.func,
  onPass: PropTypes.func,
  changeReceiver: PropTypes.func
}
