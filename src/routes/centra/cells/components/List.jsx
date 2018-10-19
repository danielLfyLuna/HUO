import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'
import { Table, Modal } from 'antd'
import _ from 'lodash'

import ModalContainer from './Modal'
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
    const { cellTypes, cellStatus } = this.props.initials.map
    this.columns = [
      {
        title: '产品ID',
        dataIndex: 'productId'
      }, {
        title: '节点ID',
        dataIndex: 'serverId'
      }, {
        title: '外网IP',
        dataIndex: 'serverHost'
      }, {
        title: '内网IP',
        dataIndex: 'serverLocal'
      }, {
        title: '服务器端口',
        dataIndex: 'serverPort'
      }, {
        title: 'WEB端口',
        dataIndex: 'webPort'
      }, {
        title: '数据库主机',
        dataIndex: 'dbHost'
      }, {
        title: '数据库端口',
        dataIndex: 'dbPort'
      }, {
        title: '合服次数',
        dataIndex: 'combineNum'
      }, {
        title: '主服合服次数',
        dataIndex: 'masterCombineNum'
      }, {
        title: '媒体服务器ID',
        dataIndex: 'audioServerId'
      }, {
        title: '节点类型',
        dataIndex: 'cellType',
        render: (text, record) => {
          return `${cellTypes[record.cellType]}(${record.cellType})`
        }
      }, {
        title: '联合服务器ID',
        dataIndex: 'combineServerId'
      }, {
        title: '跨服ID',
        dataIndex: 'crossServerId'
      }, {
        title: '状态',
        dataIndex: 'status',
        render: (text, record) => {
          return record.status ? `${cellStatus[record.status]}(${record.status})` : ''
        }
      }, {
        title: '操作',
        dataIndex: 'action',
        render: (text, record) => {
          const authRoutes = this.props.options.login.authRoutes
          let menuOptions = []
          authRoutes.includes('update-cell') &&
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
    const cell = nextProps.options.cell
    let dataSource = []
    cell.list.map(function(elem, index) {
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
    _.map(dataSource, (val) => {
      if (val.key === this.state.modal.editing.key) {
        Object.assign(val, fieldsValue)
      }
    })
    this.setState({
      data: {
        dataSource: [...dataSource],
        count: dataSource.length,
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
        editing: {}
      }
    })
  }

  onModalLoad = () => {
    return this.state.modal
  }

  handleMenuClick = (record, e) => {
    if (e.key === 'UPDATE') {
      this.onEditItem(record)
      this.props.onSearch({
        path: {
          productId: record.productId,
        },
        handle: 'UPDATE'
      })
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
          key='modify-cell'
          title='编辑节点'
          visible={this.state.modal.visible}
          onCancel={this.handleCancel}
          footer={null}
          maskClosable={false}
          destroyOnClose
        >
          <ModalContainer
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
  onSearch: PropTypes.func,
  onUpdate: PropTypes.func,
}
