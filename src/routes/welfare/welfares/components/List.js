import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Table, Row, Col, Button, Modal, Icon } from 'antd'
import moment from 'moment'

import BatchForm from './Batch'

class PlayerList extends Component {

  constructor(props) {
    super(props)
    this.columns = [
      { title: '玩家 ID', dataIndex: 'playerId' },
      { title: '昵称', dataIndex: 'nickname' },
      { title: '分组 ID', dataIndex: 'groupId' },
      { title: ' 产品', dataIndex: 'productId' },
      { title: '服务器', dataIndex: 'serverId' },
      { title: 'VIP 等级', dataIndex: 'vipLevel' },
      { title: '状态', dataIndex: 'status' },
      {
        title: '是否开启',
        dataIndex: 'open',
        render: (text, record) => {
          return record.open
            ? <span>已开启 <Icon style={{ fontSize: 16, color: 'green' }} type='check-circle-o' /></span>
            : <span>未开启 <Icon style={{ fontSize: 16, color: 'red' }} type='close-circle-o' /></span>
        }
      },
      { title: '未登陆天数', dataIndex: 'noLoginDays' },
      {
        title: '最后登录时间',
        dataIndex: 'lastedLoginTime',
        render: (text, record) => text ? moment(text).format('YYYY-MM-DD HH:mm:ss') : '-'
      },
      {
        title: '最后登出时间',
        dataIndex: 'lastedLogoutTime',
        render: (text, record) => text ? moment(text).format('YYYY-MM-DD HH:mm:ss') : '-'
      },
      {
        title: '操作',
        dataIndex: 'action',
        width: 180,
        render: (text, record) => {
          const { options } = this.props
          return (
            <Row gutter={48}>
              {
                options.authorize.includes(150105) &&
                <Col span={8}>
                  <Button onClick={() => this.handleClick({ ...record }, { handle: 'DELTET' })}>移除</Button>
                </Col>
              }
              {
                options.authorize.includes(150201) &&
                <Col span={8}>
                  <Button onClick={() => this.handleClick({ ...record }, { handle: 'PERSON' })}>日志</Button>
                </Col>
              }
            </Row>
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
      },
      selectedRowKeys: [],
      selectedRows: []
    }

  }

  componentWillReceiveProps(nextProps, nextState) {
    const { welfare } = nextProps.options
    if (welfare.players.length) {
      this.setState({
        data: {
          dataSource: [...welfare.players],
          count: welfare.players.length
        }
      })
    }
    if (welfare.batch.length) {
      this.setState({
        selectedRowKeys: [...Array(0)],
        selectedRows: [...Array(0)]
      })
    }
  }

  handleClick = (option, action) => {
    switch (action.handle) {
      case 'DELTET':
        this.onDeleteAction({
          currentItem: option,
          modalType: action.handle.toLowerCase()
        })
        break
      case 'PERSON':
        this.onLogsAction({
          currentItem: option,
          modalType: action.handle.toLowerCase()
        })
        break
      default:
        return 0
    }
  }

  onDeleteAction = (data) => {
    Modal.confirm({
      title: '删除玩家',
      content: (
        <div>
          <div>是否确认删除下列玩家 ？</div>
          <div>昵称：<em>{data.currentItem.nickname}</em></div>
          <div>ID：<em>{data.currentItem.playerId}</em></div>
        </div>
      ),
      okText: '确认',
      cancelText: '取消',
      onOk: () => {
        this.props.onDelete({
          form: {
            ...data.currentItem
          },
          path: {
            groupId: data.currentItem.groupId
          }
        })
      }
    })
  }

  onLogsAction = ({currentItem, modalType}) => {
    this.context.router.push({
      pathname: '/welfare/logs',
      query: {
        productId: currentItem.productId,
        serverId: currentItem.serverId,
        groupId: currentItem.groupId,
        playerId: currentItem.playerId
      }
    })
  }

  handleBatch = () => {
    const { selectedRows, data: { dataSource } } = this.state
    const { location } = this.props.options

    this.setState({
      modal: {
        currentItem: {
          players: dataSource,
          groupId: location.query.groupId,
          indexList: [...selectedRows.map(v => v.index)]
        },
        modalTitle: '批量管理玩家和设置奖励',
        modalType: 'batch',
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

  onSelectChange = (selectedRowKeys, selectedRows) => {
    this.setState({
      selectedRowKeys,
      selectedRows
    })
  }

  onRowSelection = (selectedRowKeys) => {
    const dataSource = this.state.data.dataSource
    return {
      selectedRowKeys,
      onChange: this.onSelectChange,
      hideDefaultSelections: true,
      selections: [{
        key: 'all-data',
        text: '选择所有玩家',
        onSelect: () => {
          this.setState({
            selectedRowKeys: [...dataSource.map(v => `${v.groupId}_${v.index}`)], // 0...45
            selectedRows: [...dataSource]
          })
        }
      }, {
        key: 'open',
        text: '所有已开启玩家',
        onSelect: () => {
          let newSelectedRowKeys = []
          newSelectedRowKeys = dataSource.filter(v => !!v.open)
          this.setState({
            selectedRowKeys: newSelectedRowKeys.map(v => `${v.groupId}_${v.index}`),
            selectedRows: newSelectedRowKeys
          })
        }
      }, {
        key: 'stop',
        text: '所有未开启玩家',
        onSelect: () => {
          let newSelectedRowKeys = []
          newSelectedRowKeys = dataSource.filter(v => !v.open)
          this.setState({
            selectedRowKeys: newSelectedRowKeys.map(v => `${v.groupId}_${v.index}`),
            selectedRows: newSelectedRowKeys
          })
        }
      }]
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

    const { selectedRowKeys } = this.state
    const rowSelection = this.onRowSelection(selectedRowKeys)

    const { modalType, modalTitle, visible } = this.state.modal

    return (
      <div>
        <div style={{ marginBottom: 4 }}>
          <Button
            type='primary'
            onClick={this.handleBatch}
            disabled={selectedRowKeys.length === 0}
          >
            开启玩家和设置奖励
          </Button>
        </div>
        <Table
          rowSelection={rowSelection}
          dataSource={this.state.data.dataSource}
          columns={this.columns}
          rowKey={record => `${record.groupId}_${record.index}`}
          pagination={pagination}
        />
        <Modal
          width={800}
          key={`batch-${Math.random()}`}
          title={modalType === 'batch' && modalTitle}
          visible={modalType === 'batch' && visible}
          onCancel={this.handleCancel}
          footer={null}
          maskClosable={false}
        >
          <BatchForm
            options={this.props.options}
            onBatch={this.props.onBatch}
            onSearch={this.props.onSearch}
            onModalLoad={this.onModalLoad}
            onSubmitting={this.handleCancel}
          />
        </Modal>
      </div>
    )
  }
}

PlayerList.propTypes = {
  options: PropTypes.object,
  onDelete: PropTypes.func,
  onSearch: PropTypes.func,
  onBatch: PropTypes.func
}

PlayerList.contextTypes = {
  router: PropTypes.object
}

export default PlayerList
