import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'
import { Table, Modal, Icon } from 'antd'
import _ from 'lodash'
import DropOption from '../../../../base/components/DropOption'

import ForbidModal from './Modal'

export default class List extends Component {
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
    }
  }

  constructor(props) {
    super(props)
    const { initials } = this.props
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
        render: (text, reason) => {
          return `${initials.map.genderTypes[text]}(${text})`
        }
      }, {
        title: '职业',
        dataIndex: 'job',
        render: (text, record) => {
          return `${initials.map.jobTypes[text]}(${text})`
        }
      }, {
        title: '等级',
        dataIndex: 'level',
      }, {
        title: '封禁状态',
        dataIndex: 'forbidList',
        render: (text, record) => {
          return record.forbidList && record.forbidList.length
                  ? _.join(_.values(_.pick(initials.map.forbidTypes, record.forbidList)), '；')
                  : '正常'
        }
      }, {
        title: '操作',
        dataIndex: 'action',
        render: (text, record) => {
          const { authRoutes } = this.props.options.login
          let menuOptions = []
          let optionName = ''
          let records = {...record}
          if (record.forbidList.length != 0) {
            optionName = '解除封禁'
          }
          authRoutes.includes('blacklist-forbid') &&
            menuOptions.push({key: 'forbid', name: '禁言&封号'})
          authRoutes.includes('blacklist-forgive') &&
            menuOptions.push({key: 'forgive', name: optionName})
          return (
            <DropOption
              onMenuClick={e => this.handleMenuClick(records, e)}
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

  handleMenuClick = (records, e) => {
    if (e.key === 'forbid') {
      this.handleForbid({
        currentItem: { ...records },
        modalType: e.key.toLowerCase()
      })
    } else if (e.key === 'forgive') {
      this.actionOnOk(records)
    }
  }

  handleForbid = (record) => {
    this.setState({
      modal: {
        ...record,
        modalTitle: '禁言 & 封号',
        visible: true
      }
    })
  }

  componentWillReceiveProps(nextProps) {
    const players = nextProps.options.players
    let dataSource = []
    players.list.map(function(elem, index) {
      dataSource.push({key: index, ...elem})
    })
    this.setState({
      data: {
        dataSource: [...dataSource],
        count: dataSource.length
      }
    })
  }

  handleCancel = () => {
    this.setState({
      modal: {
        ...this.state.modal,
        visible: false
      }
    })
  }

  onModalLoad = () => {
    return this.state.modal
  }

  actionOnOk = (v) => {
    const currentItem = v
    console.log(v)
    // const dataSource = [...this.state.dataSource]
    const { options } = this.props

    // _.map(dataSource, (val, index) => {
    //   if (val.key === currentItem.key) {
    //     val = Object.assign(val, currentItem)
    //   }
    // })

    Modal.confirm({
      title: `解除封禁`,
      content: (
        <Fragment>
          <p><Icon type='question-circle' /> 您确定要解除封禁吗</p>
        </Fragment>
      ),
      okText: '确认',
      cancelText: '取消',
      onOk: () => {
        this.props.onSwitch({
          form: {
            playerId: currentItem.playerId,
            nickname: currentItem.nickname,
            reason: currentItem.reason,
            manager: options.login.admin.userName,
            forbidType: currentItem.forbidList[0]
          },
          params: {
            payload: currentItem.playerId,
            nickname: currentItem.nickname
          }
        })
      }
    })

    // this.props.onSwitch({
    //   form: {
    //     playerId: currentItem.playerId,
    //     nickname: currentItem.nickname,
    //     reason: currentItem.reason,
    //     manager: options.login.admin.userName,
    //     forbidType: currentItem.forbidList[0]
    //   },
    //   params: {
    //     payload: currentItem.playerId,
    //     nickname: currentItem.nickname
    //   }
    // })
  }

  render() {
    const { initials, fields: { products, nickname, playerId } } = this.props
    let arrParam = []
    products.value.length ? arrParam.push(`产品/服务器：${products.value[0]}/${products.value[1]}`) : ''
    nickname.value ? arrParam.push(`昵称：${nickname.value}`) : ''
    playerId.value ? arrParam.push(`玩家 ID：${playerId.value}`) : ''
    let strParam = arrParam.join('，')
    let defaultLocale = {
      emptyText: initials.conf.locale ? `查询：{ ${strParam} }，暂未查到数据` : '未作查询，暂无数据'
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
          dataSource={this.state.data.dataSource}
          columns={this.columns}
          locale={defaultLocale}
          rowKey='playerId'
          pagination={pagination}
          bordered
        />

        <Modal
          width={800}
          key='blacklist-forbid'
          title='禁言 & 封号'
          visible={this.state.modal.visible}
          onCancel={this.handleCancel}
          footer={null}
          maskClosable={false}
          destroyOnClose
        >
          <ForbidModal
            options={this.props.options}
            initials={this.props.initials}
            onForbid={this.props.onForbid}
            onModalLoad={this.onModalLoad}
            onSubmitting={this.handleCancel}
          />
        </Modal>
      </Fragment>
    )
  }
}

List.propTypes = {
  options: PropTypes.object,
  fields: PropTypes.object,
  initials: PropTypes.object,
  onForbid: PropTypes.func,
  onSwitch: PropTypes.func
}
