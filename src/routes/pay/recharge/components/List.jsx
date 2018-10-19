import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Table, Modal, Icon } from 'antd'

import DropOption from '../../../../base/components/DropOption'
import RechargeForm from './Modal'
import MonthCardForm from './Monthcard'

export default class List extends Component {

  constructor(props) {
    super(props)
    const { genderTypes, jobTypes } = this.props.initials.map
    this.columns = [
      {
        title: '玩家 ID',
        dataIndex: 'playerId',
      }, {
        title: '昵称',
        dataIndex: 'nickname',
      }, {
        title: '性别',
        dataIndex: 'gender',
        render: (text, record) => {
          return (
            record.gender
            ? <span>{genderTypes[text]} <Icon style={{fontSize: 18, color: 'red'}} type='man' /></span>
            : <span>{genderTypes[text]} <Icon style={{fontSize: 18, color: 'green'}} type='woman' /></span>
          )
        }
      }, {
        title: '职业',
        dataIndex: 'job',
        render: (text, record) => `${jobTypes[text]}(${text})`
      }, {
        title: '等级',
        dataIndex: 'level',
      }, {
        title: '钻石',
        dataIndex: 'coin',
      }, {
        title: '在线状态',
        dataIndex: 'online',
        render: (text, record) => {
          return (
            record.online
            ? <span>在线 <Icon style={{fontSize: 18, color: 'green'}} type='check-circle-o' /></span>
            : <span>下线 <Icon style={{fontSize: 18, color: 'red'}} type='close-circle-o' /></span>
          )
        }
      }, {
        title: '操作',
        dataIndex: 'action',
        render: (text, record) => {
          const { authRoutes } = this.props.options.login
          let menuOptions = []
          authRoutes.includes('pay-recharge') &&
            menuOptions.push({key: 'RECHARGE', name: '充值...'})
          authRoutes.includes('pay-momth-card') &&
            menuOptions.push({key: 'MONTH', name: '月卡充值'})
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
        count: 0
      },
      modal: {
        currentItem: {},
        modalType: '',
        modalTitle: '',
        visible: false,
      }
    }
  }

  componentWillReceiveProps(nextProps) {
    const globals = nextProps.options.globals
    let dataSource = []
    globals.players.map(function(elem, index) {
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
    if (e.key === 'RECHARGE') {
      this.onRechargeAction({
        currentItem: { ...record },
        modalType: e.key.toLowerCase()
      })
    } else if (e.key === 'MONTH') {
      this.onMonthAction({
        currentItem: { ...record },
        modalType: e.key.toLowerCase()
      })
    }
  }

  onRechargeAction = (fields) => {
    this.setState({
      modal: {
        ...fields,
        modalTitle: '后台充值',
        visible: true
      }
    })
  }

  onMonthAction = (fields) => {
    this.setState({
      modal: {
        ...fields,
        modalTitle: '月卡充值',
        visible: true
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
    const { params, paths } = this.props.initials
    let arrParam = []
    paths.productId ? arrParam.push(`产品/服务器：${paths.productId}/${paths.serverId}`) : ''
    params.nickname ? arrParam.push(`昵称：${params.nickname}`) : ''
    params.playerId ? arrParam.push(`玩家 ID：${params.playerId}`) : ''
    const defaultLocale = {
      emptyText: arrParam.length ? `查询：{ ${arrParam.join('，')} }，暂未查到数据` : '未作查询，暂无数据'
    }
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
          locale={defaultLocale}
          rowKey='playerId'
          expandedRowRender={record => <p style={{ margin: 0 }}>{record.payinfo}</p>}
          pagination={pagination}
        />

        <Modal
          width={800}
          key='pay-recharge'
          title={modalType === 'recharge' && modalTitle}
          visible={modalType === 'recharge' && visible}
          onCancel={this.handleCancel}
          footer={null}
          maskClosable={false}
          destroyOnClose
        >
          <RechargeForm
            options={this.props.options}
            initials={this.props.initials}
            onRecharge={this.props.onRecharge}
            onModalLoad={this.onModalLoad}
            onSubmitting={this.handleCancel}
          />
        </Modal>
        <Modal
          width={800}
          key='pay-momth-card'
          title={modalType === 'month' && modalTitle}
          visible={modalType === 'month' && visible}
          onCancel={this.handleCancel}
          footer={null}
          maskClosable={false}
          destroyOnClose
        >
          <MonthCardForm
            options={this.props.options}
            initials={this.props.initials}
            onModalLoad={this.onModalLoad}
            onSendMonthCard={this.props.onSendMonthCard}
            onSubmitting={this.handleCancel}
          />
        </Modal>
      </div>
    )
  }
}

List.propTypes = {
  options: PropTypes.object,
  initials: PropTypes.object,
  onRecharge: PropTypes.func,
  onSendMonthCard: PropTypes.func
}
