import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'
import { Table, Avatar, Modal, Icon, Form, Input, message } from 'antd'
import moment from 'moment'

import DropOption from '../../../../base/components/DropOption'
import Details from './Detail'

const FormItem = Form.Item

const ModifyNickForm = Form.create()(
  (props) => {
    const { form: { getFieldDecorator }, visible, title, onCancel, onBundle } = props
    const { currentItem } = props.onModalLoad()

    const detail = currentItem

    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 6 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 12 }
      }
    }

    return (
      <Modal
        width={800}
        key='player-rename'
        visible={visible}
        title={title}
        okText='提交'
        onCancel={onCancel}
        onOk={onBundle}
      >
        <Form>
          <FormItem
            {...formItemLayout}
            label='用户 ID'
          >
            {getFieldDecorator('playerId', {
              initialValue: detail.playerId || '',
              rules: [{ required: true, message: '请填写 ID!' }]
            })(
              <Input placeholder='请填写 ID' disabled />
            )}
          </FormItem>

          <FormItem
            {...formItemLayout}
            label='昵称'
          >
            {getFieldDecorator('nickname', {
              initialValue: detail.nickname || '',
              rules: [{ required: true, message: '请填写昵称!' }]
            })(
              <Input placeholder='请填写昵称' />
            )}
          </FormItem>

        </Form>
      </Modal>
    )
  }
)

export default class PlayerList extends Component {

  constructor(props) {
    super(props)
    const { gender, job } = this.props.initials.map
    this.columns = [
      { title: '玩家 ID', width: 120, dataIndex: 'playerId', fixed: 'left' },
      { title: '玩家昵称', width: 100, dataIndex: 'nickname', fixed: 'left' },
      { title: '平台 ID', dataIndex: 'platformId' },
      { title: '渠道 ID', dataIndex: 'channelUid' },
      {
        title: '头像',
        dataIndex: 'headImageUrl',
        render: (text, record, index) => {
          return (
            <Avatar onClick={() => this.onLoadImage(record)} src={text} shape='square' size='large' icon='user' />
          )
        }
      },
      { title: '等级', dataIndex: 'level' },
      {
        title: '性别',
        dataIndex: 'gender',
        render: (text, record, index) => gender[record.gender]
      },
      {
        title: '职业',
        dataIndex: 'job',
        render: (text, record, index) => job[record.job]
      },
      { title: '战力', dataIndex: 'fightCapacity' },
      { title: '流通元宝', dataIndex: 'coin' },
      { title: '元宝', dataIndex: 'coinToken' },
      { title: '黄金', dataIndex: 'gold' },
      { title: '皇宫宝藏积分', dataIndex: 'lotteryScore' },
      { title: '技能兑换石', dataIndex: 'skillStone' },
      { title: '经验', dataIndex: 'curExp' },
      { title: 'VIP等级', dataIndex: 'vipLevel' },
      { title: '联盟', dataIndex: 'alliance' },
      { title: '联盟坐标', dataIndex: 'alliancePos' },
      // { title: '占领城池', dataIndex: 'occupyCity' },
      { title: '个人主城', dataIndex: 'personalPos' },
      {
        title: '所在州',
        dataIndex: 'regionId',
        render: (text, record, index) => {
          let value = '其它'
          if (text === 1) { value = '江夏' }
          if (text === 1) { value = '武陵' }
          if (text === 1) { value = '南阳' }
          return value
        }
      },
      { title: '体力', dataIndex: 'energy' },
      {
        title: '月卡到期时间',
        dataIndex: 'monthCardEndTime',
        render: (text, record, index) => text ? moment(text).format('YYYY-MM-DD HH:mm:ss') : '-'
      },
      {
        title: '周卡到期时间',
        dataIndex: 'weekCardEndTime',
        render: (text, record, index) => text ? moment(text).format('YYYY-MM-DD HH:mm:ss') : '-'
      },
      {
        title: '创建时间',
        dataIndex: 'createDate',
        render: (text, record, index) => moment(record.createDate).format('YYYY-MM-DD HH:mm:ss')
      },
      {
        title: '最近登录',
        dataIndex: 'lastLoginDate',
        render: (text, record, index) => moment(record.lastLoginDate).format('YYYY-MM-DD HH:mm:ss')
      },
      {
        title: '登录状态',
        dataIndex: 'online',
        fixed: 'right',
        width: 100,
        render: (text, record, index) => {
          return (
              record.online
              ? <span>在线<Icon style={{color: 'green'}} type='check' /></span>
              : <span>离线<Icon style={{color: 'red'}} type='close' /></span>
          )
        }
      },
      {
        title: '操作',
        fixed: 'right',
        width: 100,
        render: (text, record, index) => {
          const { authRoutes } = this.props.options.login
          let menuOptions = []
          authRoutes.includes('fetch-players') &&
            menuOptions.push({key: 'READ', name: '查看'})
          authRoutes.includes('fetch-head-image') &&
            menuOptions.push({key: 'STOP', name: '禁用头像'})
          authRoutes.includes('fetch-skip-novice') &&
            menuOptions.push({key: 'SKIP', name: '跳过新手'})
          authRoutes.includes('fetch-nickname') &&
            menuOptions.push({key: 'NAME', name: '修改昵称'})
          authRoutes.includes('fetch-kickout') &&
            menuOptions.push({key: 'KICK', name: '踢人'})
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

  componentWillReceiveProps(nextProps, nextState) {
    const player = nextProps.options.player
    let dataSource = []
    player.players.map(function(elem, index) {
      dataSource.push({key: index, ...elem})
    })
    this.setState({
      data: {
        dataSource: [...dataSource],
        count: dataSource.length
      }
    })
  }

  onLoadImage = (record) => {
    Modal.info({
      title: '查看头像',
      okText: '关闭',
      width: 600,
      content: (
        <img src={record.headImageUrl} />
      )
    })
  }

  onReadAction = (fields) => {
    this.setState({
      modal: {
        ...fields,
        modalTitle: '查看玩家信息',
        visible: true
      }
    })
  }

  onStopAction = (fields) => {
    const params = this.props.params
    if (params.products.value.length < 2) {
      message.warning('请先选择产品和服务器', 5)
      return this.handleCancel()
    }
    Modal.confirm({
      title: '您确定要删除该玩家头像图片吗?',
      content: '删除后无法再恢复该头像，并且只能在游戏中添加头像！',
      okText: '确认',
      cancelText: '取消',
      onOk: () => {
        this.props.onStop({
          path: {
            productId: params.products.value[0],
            serverId: params.products.value[1],
            playerId: fields.currentItem.playerId
          }
        })
      }
    })
  }

  onSkipAction = (fields) => {
    const params = this.props.params
    if (params.products.value.length < 2) {
      message.warning('请先选择产品和服务器', 5)
      return this.handleCancel()
    }
    Modal.confirm({
      title: '您确定要设置跳过新手吗?',
      content: '确认后将设置为跳过新手！',
      okText: '确认',
      cancelText: '取消',
      onOk: () => {
        this.props.onSkip({
          path: {
            productId: params.products.value[0],
            serverId: params.products.value[1],
            nickname: fields.currentItem.nickname
          },
          handle: fields.modalType.toUpperCase()
        })
      }
    })
  }

  onRenameAction = (fields) => {
    this.setState({
      modal: {
        ...fields,
        modalTitle: '修改玩家昵称',
        visible: true
      }
    })
  }

  onKickoutAction = (fields) => {
    const params = this.props.params
    if (params.products.value.length < 2) {
      message.warning('请先选择产品和服务器', 5)
      return this.handleCancel()
    }
    Modal.confirm({
      title: '您确定要强制该用户退出吗?',
      content: '您确定要强制该用户退出吗?',
      okText: '确认',
      cancelText: '取消',
      onOk: () => {
        this.props.onKick({
          path: {
            productId: params.products.value[0],
            serverId: params.products.value[1],
            platformId: fields.currentItem.platformId
          }
        })
      }
    })
  }

  handleMenuClick = (record, e) => {

    switch (e.key) {
      case 'READ':
        this.onReadAction({
          currentItem: { ...record },
          modalType: e.key.toLowerCase()
        })
        break
      case 'STOP':
        this.onStopAction({
          currentItem: { ...record },
          modalType: e.key.toLowerCase()
        })
        break
      case 'SKIP':
        this.onSkipAction({
          currentItem: { ...record },
          modalType: e.key.toLowerCase()
        })
        break
      case 'NAME':
        this.onRenameAction({
          currentItem: { ...record },
          modalType: e.key.toLowerCase()
        })
        break
      case 'KICK':
        this.onKickoutAction({
          currentItem: { ...record },
          modalType: e.key.toLowerCase()
        })
        break
      default:
        return 'Error'
    }
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

  handleBundle = () => {
    const form = this.form
    form.validateFieldsAndScroll((err, values) => {
      if (err) {
        return
      }

      const data = {
        playerId: values.playerId,
        nickname: values.nickname
      }

      const params = this.props.params
      if (params.products.value.length < 2) {
        message.warning('请先选择产品和服务器', 5)
        return this.handleCancel()
      }

      const posts = {
        form: data,
        path: {
          productId: params.products.value[0],
          serverId: params.products.value[1]
        },
        handle: this.state.modal.modalType.toUpperCase()
      }

      this.props.onUpdate(posts)

      form.resetFields()
      this.setState({
        modal: {
          currentItem: {},
          modalType: '',
          modalTitle: '',
          visible: false
        }
      })
    })
  }

  saveFormRef = (form) => {
    this.form = form
  }

  render() {
    const pagination = {
      showSizeChanger: true,
      defaultPageSize: 50,
      pageSizeOptions: ['20', '50', '100', '200', '500'],
      total: this.state.data.count
    }
    const { modalType, modalTitle, visible } = this.state.modal

    return (
      <Fragment>
        <Table
          bordered
          dataSource={this.state.data.dataSource}
          columns={this.columns}
          rowKey='playerId'
          pagination={pagination}
          scroll={{ x: 3000 }}
        />
        <Modal
          width={1000}
          key='player-detail'
          title={modalType === 'read' && modalTitle}
          visible={modalType === 'read' && visible}
          onCancel={this.handleCancel}
          footer={null}
          maskClosable={false}
          destroyOnClose
        >
          <Details
            options={this.props.options}
            initials={this.props.initials}
            onModalLoad={this.onModalLoad}
          />
        </Modal>
        <ModifyNickForm
          ref={this.saveFormRef}
          title={modalType === 'name' && modalTitle}
          visible={modalType === 'name' && visible}
          onCancel={this.handleCancel}
          onBundle={this.handleBundle}
          options={this.props.options}
          onModalLoad={this.onModalLoad}
        />
      </Fragment>
    )
  }
}

PlayerList.propTypes = {
  options: PropTypes.object,
  initials: PropTypes.object,
  params: PropTypes.object,
  onKick: PropTypes.func,
  onSkip: PropTypes.func,
  onStop: PropTypes.func,
  onUpdate: PropTypes.func
}
