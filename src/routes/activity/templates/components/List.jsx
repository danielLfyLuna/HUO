import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Table, Button, Row, Col, Modal } from 'antd'

import CreateModal from './Create'
import Tip from './Tip'
import Detail from './Modal'

export default class List extends Component {

  constructor(props) {
    super(props)
    this.columns = [
      { title: '模板 ID', dataIndex: 'templateId' },
      { title: '名称', dataIndex: 'name' },
      { title: '类型', dataIndex: 'functionId' },
      { title: '操作人',
        dataIndex: 'adminUserName',
        render: (text, record) => {
          if (record.ownCreateLog && record.ownCreateLog.adminUserName) { return record.ownCreateLog.adminUserName }
          else { return '' }
        }
      },
      {
        title: '操作',
        dataIndex: 'action',
        width: 300,
        render: (text, record) => {
          const { options } = this.props.dataFlow
          return (
            <div>
              <Row gutter={16}>
                {
                  options.login.authRoutes &&
                  <Col span={7}>
                    <Button onClick={() => this.handleClick({ ...record }, { handle: 'PREVIEW' })}>预览模板</Button>
                  </Col>
                }
                {
                  (
                    options.login.authRoutes ||
                    options.login.authRoutes ||
                    options.login.authRoutes
                  ) &&
                  <Col span={7}>
                    <Button onClick={() => this.handleClick({ ...record }, { handle: 'TEMPLATE' })}>创建活动</Button>
                  </Col>
                }

              </Row>
            </div>
          )
        }
      }
    ]

    this.state = {
      templateV: false,
      visible: false,
      list: {},
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

  expandedRowRender = (data) => {
    const columns = [
      {
        title: 'id',
        dataIndex: 'id',
        key: 'id'
      }, {
        title: '操作人',
        dataIndex: 'adminUserName',
        key: 'adminUserName'
      }, {
        title: '操作时间',
        dataIndex: 'createTime',
        key: 'createTime'
      }, {
        title: '组id',
        dataIndex: 'groupId',
        key: 'groupId'
      }, {
        title: '产品id',
        dataIndex: 'productId',
        key: 'productId'
      }, {
        title: '服务器id',
        dataIndex: 'serverId',
        key: 'serverId'
      }, {
        title: '模板id',
        dataIndex: 'templateId',
        key: 'templateId'
      }, {
        title: '是否成功',
        dataIndex: 'success',
        key: 'success',
        render: (text, reocrd) => {
          return text ? '成功' : <span style={{ color: '#FF1111' }}>失败</span>
        }
      }, {
        title: '操作提示信息',
        dataIndex: 'msg',
        key: 'msg'
      }
    ]

    return (
      (data.length === 0 || !data) ?
        '无活动模板日志数据'
      :
        <Table
          columns={columns}
          dataSource={data}
          rowKey='id'
          locale={{emptyText: '无相关数据'}}
          size='small'
          pagination={false}
          title={() => '活动模板日志'}
        />
    )
  }

  componentWillReceiveProps(nextProps) {
    const activities = nextProps.dataFlow.options.activity.activities
    let dataSource = []
    activities.templates.map((elem, index) => {
      dataSource.push({key: index, ...elem})
    })
    this.setState({
      data: {
        dataSource: [...dataSource],
        count: dataSource.length
      }
    })
  }

  handleClick = (option, action) => {
    switch (action.handle) {
      case 'PREVIEW':
        this.onDetailAction(option)
        break
      case 'TEMPLATE':
        this.onCreateAction(option)
        break
      default:
        console.log('Error')
    }
  }

  onDetailAction = (option) => {
    this.setState({
      visible: true,
      list: option
    })
    // const { initials } = this.props.dataFlow
    // const pathname = `/activity/408`
    // const query = {
    //   ...initials.products,
    //   functionId: option.functionId,
    //   templateId: option.templateId,
    //   handle: action.handle.toLowerCase()
    // }
    // this.context.router.push({
    //   pathname,
    //   query
    // })
  }

  onCreateAction = (data) => {
    this.setState({
      modal: {
        currentItem: data,
        modalType: 'template',
        modalTitle: '创建活动',
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
        visible: false,
      }
    })
  }

  templateVCancel = (e) => {
    this.setState({
      templateV: false
    })
  }

  templateVVisible = (e) => {
    this.setState({
      templateV: true
    })
  }

  handleDetailCancel = (e) => {
    this.setState({
      visible: false
    })
  }

  onModalLoad = () => {
    return this.state.modal
  }

  render() {
    const { initials } = this.props.dataFlow
    const paths = initials.paths
    const defaultLocale = {
      emptyText: paths.productId ? `${paths.productId}/${paths.serverId}: 暂未查到数据` : '未作查询，暂无数据'
    }
    const pagination = {
      showSizeChanger: true,
      defaultPageSize: 200,
      pageSizeOptions: ['20', '50', '100', '200', '500'],
      total: this.state.data.count,
      showTotal: (total, range) => `第 ${range[0]}-${range[1]} 条 / 共 ${total} 条`
    }

    return (
      <div>
        <Table
          bordered
          dataSource={this.state.data.dataSource}
          expandedRowRender={record => this.expandedRowRender(record.batchCreateLogs)}
          columns={this.columns}
          rowKey='templateId'
          locale={defaultLocale}
          pagination={pagination}
        />

        <Modal
          width={1000}
          key='create-activity'
          title={this.state.modal.modalTitle}
          visible={this.state.modal.visible}
          onCancel={this.handleCancel}
          footer={null}
          maskClosable={false}
          destroyOnClose
        >
          <CreateModal
            dataFlow={this.props.dataFlow}
            onCreate={this.props.onCreate}
            onModalLoad={this.onModalLoad}
            onSubmitting={this.handleCancel}
            templateVVisible={this.templateVVisible}
          />
        </Modal>

        <Modal
          width={1000}
          key='response-template'
          visible={this.state.templateV}
          onCancel={this.templateVCancel}
          footer={null}
          maskClosable={false}
          destroyOnClose
        >
          <Tip
            dataFlow={this.props.dataFlow}
            onClear={this.props.onClear}
          />
        </Modal>

        <Modal
          width={1000}
          key='detail'
          visible={this.state.visible}
          onCancel={this.handleDetailCancel}
          footer={null}
          maskClosable={false}
          destroyOnClose
        >
          <Detail
            goods={this.props.dataFlow.options.globals.goods}
            data={this.state.list}
          />
        </Modal>
      </div>
    )
  }
}

List.propTypes = {
  dataFlow: PropTypes.object,
  onCreate: PropTypes.func,
  onClear: PropTypes.func
}

List.contextTypes = {
  router: PropTypes.object
}
