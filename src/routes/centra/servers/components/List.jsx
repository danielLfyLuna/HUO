import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'
import { Table, Modal } from 'antd'
import _ from 'lodash'

import ServerModal from './Modal'
import DropOption from '../../../../base/components/DropOption'

export default class List extends Component {
  state = {
    data: {
      dataSource: [],
      count: 0,
    },
    modal: {
      currentItem: {},
      modalType: '',
      visible: false,
      editing: {},
    }
  }

  constructor(props) {
    super(props)
    const { recommendTypes, hotTypes, serverStatus } = this.props.initials.map
    this.columns = [
      {
        title: '服务器 ID',
        dataIndex: 'serverId',
        key: 'serverId'
      }, {
        title: ' 产品 ID',
        dataIndex: 'productId',
        key: 'productId'
      }, {
        title: '名称',
        dataIndex: 'serverName',
        key: 'serverName'
      }, {
        title: '分组',
        dataIndex: 'group',
        key: 'group'
      }, {
        title: '类型',
        dataIndex: 'recommend',
        key: 'recommend',
        render: (text, record) => {
          return recommendTypes[record.recommend]
        }
      }, {
        title: '地址',
        dataIndex: 'serverAddress',
        key: 'serverAddress'
      }, {
        title: '火爆程度',
        dataIndex: 'hot',
        key: 'hot',
        render: (text, record) => {
          return hotTypes[record.hot]
        }
      }, {
        title: '开服状态',
        dataIndex: 'status',
        key: 'status',
        render: (text, record) => {
          return serverStatus[record.status]
        }
      }, {
        title: '充值开启',
        dataIndex: 'purchaseOpen',
        key: 'purchaseOpen',
        render: (text, record) => {
          return record.purchaseOpen ? '是' : '否'
        }
      }, {
        title: '开启时间',
        dataIndex: 'openingTime',
        key: 'openingTime'
      }, {
        title: '操作',
        dataIndex: 'action',
        render: (text, record) => {
          const authRoutes = this.props.options.login.authRoutes
          let menuOptions = []
          authRoutes.includes('update-server') &&
            menuOptions.push({key: 'UPDATE', name: '编辑'})

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

  componentWillReceiveProps(nextProps) {
    const server = nextProps.options.server
    let dataSource = []
    server.list.map(function(elem, index) {
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
          visible: true,
          editing: record
        }
      })
    }
  }

  onUpdate = (fieldsValue) => {
    const dataSource = [...this.state.data.dataSource]
    _.map(dataSource, (val, index) => {
      if (val.key === this.state.modal.editing.key) {
        val = Object.assign(val, fieldsValue)
      }
    })
    this.setState({
      data: {
        dataSource: [ ...dataSource ],
        count: dataSource.length
      },
      modal: {
        currentItem: {},
        modalType: '',
        visible: false,
        editing: {},
      }
    })
    this.props.onUpdate(fieldsValue)
  }

  handleCancel = (e) => {
    this.setState({
      modal: {
        currentItem: {},
        modalType: '',
        visible: false,
        editing: {},
      }
    })
  }

  onModalLoad = () => {
    return this.state.modal
  }

  handleMenuClick = (record, e) => {
    if (e.key === 'UPDATE') {
      this.onEditItem(record)
    }
  }

  render() {
    let pagination = {
      showSizeChanger: true,
      defaultPageSize: 50,
      pageSizeOptions: ['20', '50', '100', '200', '500'],
      total: this.state.data.count,
      showTotal: (total, range) => `第 ${range[0]}-${range[1]} 条 / 共 ${total} 条`
    }

    return (
      <Fragment>
        <Table
          bordered
          dataSource={this.state.data.dataSource}
          columns={this.columns}
          rowKey='serverId'
          pagination={pagination}
        />
        <Modal
          width={1000}
          key='update-server'
          title='编辑服务器'
          visible={this.state.modal.visible}
          onCancel={this.handleCancel}
          footer={null}
          maskClosable={false}
          destroyOnClose
        >
          <ServerModal
            options={this.props.options}
            initials={this.props.initials}
            onModalLoad={this.onModalLoad}
            onUpdate={this.onUpdate}
            onSubmitting={this.handleCancel}
          />
        </Modal>
      </Fragment>
    )
  }

}

List.propTypes = {
  options: PropTypes.object,
  initials: PropTypes.object,
  onUpdate: PropTypes.func,
}
