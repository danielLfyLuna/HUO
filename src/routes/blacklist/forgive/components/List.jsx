import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'
import { Table, Modal, Button } from 'antd'
import moment from 'moment'
import _ from 'lodash'

export default class List extends Component {
  state = {
    dataSource: [],
    count: 0,
    currentItem: {},
    visible: false
  }

  constructor(props) {
    super(props)
    const { initials } = this.props
    this.columns = [
      {
        title: '玩家 ID',
        dataIndex: 'playerId',
        key: 'playerId'
      }, {
        title: '玩家角色名称',
        dataIndex: 'nickname',
        key: 'nickname'
      }, {
        title: '禁言类型',
        dataIndex: 'forbidType',
        key: 'forbidType',
        render: (text, reason) => {
          return `${initials.map.forbidTypes[text]}(${text})`
        }
      }, {
        title: '禁言原因',
        dataIndex: 'reason',
        key: 'reason'
      }, {
        title: '禁言时长(s)',
        dataIndex: 'intervalUnit',
        key: 'intervalUnit',
        render: (text, record) => {
          let timeUnits = initials.conf.timeUnits
          return `${text === timeUnits.lasting ? '' : record.interval} ${initials.map.timeUnits[text]}(${text})`
        }
      }, {
        title: '禁言日期',
        dataIndex: 'createDate',
        key: 'createDate',
        render: (text, record) => {
          return moment(text).format('YYYY-MM-DD HH:mm:ss')
        }
      }, {
        title: '解禁时间',
        dataIndex: 'liftedDate',
        key: 'liftedDate',
        render: (text, record) => {
          return moment(text).format('YYYY-MM-DD HH:mm:ss')
        }
      }, {
        title: '禁言操作人',
        dataIndex: 'manager',
        key: 'manager'
      }, {
        title: '操作',
        dataIndex: 'action',
        key: 'action',
        render: (text, record) => {
          const { authRoutes } = this.props.options.login
          return (
            <div>
              {
                authRoutes.includes('blacklist-forgive') && <Button onClick={() => this.handleRemove(record)}>解除封禁</Button>
              }
            </div>
          )
        }
      }
    ]
  }

  handleRemove = (record) => {
    this.setState({
      currentItem: record,
      visible: true
    })
  }

  componentWillReceiveProps(nextProps) {
    const black = nextProps.options.blacklist
    let dataSource = []
    black.list.map(function(elem, index) {
      dataSource.push({key: index, ...elem})
    })
    this.setState({
      dataSource: [...dataSource],
      count: dataSource.length
    })
  }

  actionOnOk = () => {
    const currentItem = this.state.currentItem
    console.log(this.state)
    const dataSource = [...this.state.dataSource]
    const { options } = this.props

    _.map(dataSource, (val, index) => {
      if (val.key === currentItem.key) {
        val = Object.assign(val, currentItem)
      }
    })
    this.setState({
      visible: false,
      dataSource: [...dataSource]
    })
    this.props.onSwitch({
      form: {
        playerId: currentItem.playerId,
        nickname: currentItem.nickname,
        reason: currentItem.reason,
        manager: options.login.admin.userName,
        forbidType: currentItem.forbidType
      },
      params: {
        payload: currentItem.playerId,
        nickname: currentItem.nickname
      }
    })
  }

  actionOnCancel = () => {
    this.setState({
      currentItem: {},
      visible: false
    })
  }

  render() {
    const { params, products, conf } = this.props.initials
    let arrParam = []
    products.productId ? arrParam.push(`产品/服务器：${products.productId}/${products.serverId}`) : ''
    params.nickname ? arrParam.push(`昵称：${params.nickname}`) : ''
    params.playerId ? arrParam.push(`玩家 ID：${params.playerId}`) : ''
    let strParam = arrParam.join('，')
    let defaultLocale = {
      emptyText: conf.locale ? `查询：{ ${strParam} }，暂未查到数据` : '未作查询，暂无数据'
    }
    let pagination = {
      showSizeChanger: true,
      defaultPageSize: 50,
      pageSizeOptions: ['20', '50', '100', '200', '500'],
      total: this.state.count
    }

    return (
      <Fragment>
        <Table
          dataSource={this.state.dataSource}
          columns={this.columns}
          locale={defaultLocale}
          rowKey='createDate'
          pagination={pagination}
          bordered
        />

        <Modal
          title='操作提示'
          visible={this.state.visible}
          onOk={this.actionOnOk}
          onCancel={this.actionOnCancel}
          okText='确认'
          cancelText='取消'
        >
          <p data={this.props.options}>确定解除封禁吗? ...</p>
        </Modal>
      </Fragment>
    )
  }
}

List.propTypes = {
  options: PropTypes.object,
  initials: PropTypes.object,
  onSwitch: PropTypes.func
}
