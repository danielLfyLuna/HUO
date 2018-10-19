import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'
import { Table, Modal, Icon } from 'antd'

import DropOption from '../../../../base/components/DropOption'
import GroupModal from './Modal'

export default class List extends Component {

  constructor(props) {
    super(props)
    const { verifyTypes } = this.props.initials.map
    this.columns = [
      {
        title: '分组',
        dataIndex: 'group'
      }, {
        title: '分组名称',
        dataIndex: 'name'
      }, {
        title: '是否验证',
        dataIndex: 'verify',
        render: (text, record) => verifyTypes[record.verify]
      }, {
        title: '操作',
        dataIndex: 'action',
        render: (text, record) => {
          const authRoutes = this.props.options.login.authRoutes
          let menuOptions = []
          authRoutes.includes('update-group') &&
            menuOptions.push({key: 'UPDATE', name: '编辑'})
          authRoutes.includes('delete-group') &&
            menuOptions.push({key: 'DELETE', name: '删除'})

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
        count: 0,
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
    const group = nextProps.options.group
    let dataSource = []
    group.list.map(function(elem, index) {
      dataSource.push({key: index, ...elem})
    })
    this.setState({
      data: {
        dataSource: [...dataSource],
        count: dataSource.length
      }
    })
  }

  onEditItem = (fields) => {
    this.setState({
      modal: {
        ...fields,
        modalTitle: '编辑分组',
        visible: true
      }
    })
  }

  deleteModalShow = (fields) => {
    this.setState({
      modal: {
        ...fields,
        modalTitle: '删除分组',
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

  handleMenuClick = (record, e) => {
    if (e.key === 'UPDATE') {
      this.onEditItem({
        currentItem: { ...record },
        modalType: e.key.toLowerCase()
      })
    } else if (e.key === 'DELETE') {
      this.deleteModalShow({
        currentItem: { ...record },
        modalType: e.key.toLowerCase()
      })
    }
  }

  deleteOnOk = () => {
    const { currentItem } = this.state.modal
    this.setState({
      modal: {
        currentItem: {},
        modalType: '',
        modalTitle: '',
        visible: false
      }
    })
    this.props.onDelete({
      path: {
        group: currentItem.group
      }
    })
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
          rowKey='group'
          pagination={pagination}
        />
        <Modal
          width={1000}
          key='update-group'
          title={modalType === 'update' && modalTitle}
          visible={modalType === 'update' && visible}
          onCancel={this.handleCancel}
          footer={null}
          maskClosable={false}
          destroyOnClose
        >
          <GroupModal
            options={this.props.options}
            initials={this.props.initials}
            onUpdate={this.props.onUpdate}
            onModalLoad={this.onModalLoad}
            onSubmitting={this.handleCancel}
          />
        </Modal>

        <Modal
          key='delete-group'
          title={modalType === 'delete' && modalTitle}
          visible={modalType === 'delete' && visible}
          onOk={this.deleteOnOk}
          onCancel={this.handleCancel}
          okText='确认'
          cancelText='取消'
        >
          <p><Icon type='question-circle' /> 是否确认删除下列分组：</p>
          <p><em>分组：{this.state.modal.currentItem.group}</em></p>
        </Modal>
      </Fragment>
    )
  }

}

List.propTypes = {
  options: PropTypes.object,
  initials: PropTypes.object,
  onUpdate: PropTypes.func,
  onDelete: PropTypes.func
}
