import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Table, Modal, Icon, Dropdown, Menu, Button } from 'antd'

import GroupForms from './Group'

export default class GroupList extends Component {

  constructor(props) {
    super(props)
    const { runDays, groupTypes, openStates } = this.props.initials.map
    this.columns = [
      { title: '分组 ID', dataIndex: 'groupId' },
      { title: '名称', dataIndex: 'name' },
      {
        title: '执行日期',
        dataIndex: 'runDay',
        render: (text, record) => {
          return `${groupTypes[record.groupType]} ${runDays[record.groupType][record.runDay]}`
        }
      },
      { title: '执行时间', dataIndex: 'runTime' },
      { title: '开启时间', dataIndex: 'startTime' },
      { title: '结束时间', dataIndex: 'endTime' },
      {
        title: '开启状态',
        dataIndex: 'open',
        render: (text, record) => {
          return record.open
            ? <span>{openStates[record.open]} <Icon style={{ fontSize: 16, color: 'green' }} type='check-circle-o' /></span>
            : <span>{openStates[record.open]} <Icon style={{ fontSize: 16, color: 'red' }} type='close-circle-o' /></span>
        }
      },
      {
        title: '操作',
        dataIndex: 'action',
        render: (text, record) => {
          const { options } = this.props
          const menuItems = (
            <Menu onClick={e => this.handleClick(record, e)}>
              {
                options.authorize.includes(150102) &&
                <Menu.Item key='UPDATE'>修改福利分组</Menu.Item>
              }
              <Menu.Divider />
              {
                options.authorize.includes(150110) &&
                <Menu.Item key='WELFARES'>托管玩家列表</Menu.Item>
              }
              {
                options.authorize.includes(150201) &&
                <Menu.Item key='LOGS'>玩家托管日志</Menu.Item>
              }
            </Menu>
          )

          return (
            <Dropdown
              overlay={menuItems}
            >
              <Button style={{ marginLeft: 8 }}>
                <Icon type='bars' />
                <Icon type='down' />
              </Button>
            </Dropdown>
          )
        }
      }
    ]
    this.state = {
      data: {
        dataSource: [],
        count: 0
      },
      modal: {
        currentItem: {},
        modalType: '',
        modalTitle: '',
        visible: false
      }
    }
  }

  expandedRowRender = (statistics) => {
    const columns = [
      { title: '充值 ID', dataIndex: 'rechargeId' },
      { title: '充值名称', dataIndex: 'rechargeName' },
      { title: '共计', dataIndex: 'count' }
    ]

    const dataSource = [...statistics]

    return (
      <Table
        columns={columns}
        dataSource={dataSource}
        rowKey='rechargeId'
        pagination={false}
        showHeader={false}
      />
    )
  }

  componentWillReceiveProps(nextProps) {
    const welfare = nextProps.options.welfare
    let dataSource = []

    welfare.groups.map((elem, index) => {
      dataSource.push({ key: index, ...elem })
    })
    this.setState({
      data: {
        dataSource: [...dataSource],
        count: dataSource.length
      }
    })
  }

  handleClick = (record, e) => {
    switch (e.key) {
      case 'WELFARES':
      case 'LOGS':
        this.onLinkAction({
          pathname: '/welfare/' + e.key.toLowerCase(),
          query: {
            groupId: record.groupId
          }
        })
        break
      case 'UPDATE':
        this.onModalAction({
          currentItem: record,
          modalType: e.key.toLowerCase(),
          modalTitle: e.item.props.children
        })
        break
      default:
        return 0
    }
  }

  onLinkAction = (links) => {
    this.context.router.push(links)
  }

  onModalAction = (data) => {
    this.setState({
      modal: {
        ...data,
        visible: true
      }
    })
  }

  handleCancel = (e) => {
    this.setState({
      modal: {
        currentItem: {},
        modalType: '',
        modalTitle: '',
        visible: false
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
    const { modalType, modalTitle, visible } = this.state.modal
    return (
      <div>
        <Table
          dataSource={this.state.data.dataSource}
          columns={this.columns}
          expandedRowRender={record => record.statistics ? this.expandedRowRender(record.statistics) : ''}
          rowKey='groupId'
          pagination={pagination}
        />

        <Modal
          width={800}
          key={`update-${Math.random()}`}
          title={['update'].includes(modalType) && modalTitle}
          visible={['update'].includes(modalType) && visible}
          onCancel={this.handleCancel}
          footer={null}
          maskClosable={false}
        >
          <GroupForms
            options={this.props.options}
            initials={this.props.initials}
            onUpdate={this.props.onUpdate}
            onCreate={this.props.onCreate}
            onModalLoad={this.onModalLoad}
            onSubmitting={this.handleCancel}
          />
        </Modal>
      </div>
    )
  }
}

GroupList.propTypes = {
  options: PropTypes.object,
  initials: PropTypes.object,
  onUpdate: PropTypes.func,
  onCreate: PropTypes.func
}

GroupList.contextTypes = {
  router: PropTypes.object
}
