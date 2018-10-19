import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'
import { Table, Modal, Icon } from 'antd'
// import _ from 'lodash'

import VersionModal from './Modal'
import DropOption from '../../../../base/components/DropOption'

const versionTypes = {
  1: '软更新(没有硬更新版本)',
  2: '软更新(但有硬更新版本)',
  3: '硬更新',
  4: '审核版本(非正式更新用)'
}

const versionStatus = {
  1: '正式',
  2: '测试'
}

export default class List extends Component {
  state = {
    data: {
      dataSource: [],
      count: 0,
      editing: {},
    },
    modal: {
      currentItem: {},
      modalType: '',
      visible: false,
    }
  }

  constructor(props) {
    super(props)
    this.columns = [
      {
        title: '产品 ID',
        dataIndex: 'productId',
        key: 'productId'
      }, {
        title: '分组',
        dataIndex: 'group',
        key: 'group'
      }, {
        title: '版本',
        dataIndex: 'version',
        key: 'version'
      }, {
        title: '类型',
        dataIndex: 'type',
        key: 'type',
        render: (text, record) => {
          return versionTypes[record.type]
        }
      }, {
        title: '状态',
        dataIndex: 'status',
        key: 'status',
        render: (text, record) => {
          return versionStatus[record.status]
        }
      }, {
        title: '资源 URL',
        dataIndex: 'resourceUrl',
        key: 'resourceUrl'
      }, {
        title: '应用 URL',
        dataIndex: 'appUrl',
        key: 'appUrl'
      }, {
        title: '描述',
        dataIndex: 'description',
        key: 'description'
      }, {
        title: '操作',
        dataIndex: 'action',
        render: (text, record) => {
          const authRoutes = this.props.options.login.authRoutes
          let menuOptions = []
          authRoutes.includes('update-version') &&
            menuOptions.push({key: 'UPDATE', name: '编辑'})
          authRoutes.includes('delete-version') &&
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
  }

  componentWillReceiveProps(nextProps) {
    const version = nextProps.options.version
    let dataSource = []
    version.list.map(function(elem, index) {
      dataSource.push({key: index, ...elem})
    })
    this.setState({
      dataSource: [...dataSource],
      count: dataSource.length
    })
  }

  onEditItem = (record) => {
    this.setState({
      modal: {
        ...record,
        modalTitle: '编辑版本',
        visible: true
      }
    })
  }


  deleteModalShow = (fields) => {
    this.setState({
      modal: {
        ...fields,
        modalTitle: '删除版本',
        visible: true
      }
    })
  }

  onUpdate = (fieldsValue) => {
    // const dataSource = [...this.state.dataSource]
    // _.map(dataSource, (val, index) => {
    //   if (val.key === this.state.editing.key) {
    //     val = Object.assign(val, fieldsValue)
    //   }
    // })
    // this.setState({
    //   visible: false,
    //   dataSource: [...dataSource]
    // })
    this.props.onUpdate(fieldsValue)
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
        productId: currentItem.productId,
        version: currentItem.version
      }
    })
  }

  render() {
    let pagination = {
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
          dataSource={this.state.dataSource}
          columns={this.columns}
          rowKey='version'
          pagination={pagination}
        />
        <Modal
          width={1000}
          key='update-version'
          title={modalType === 'update' && modalTitle}
          visible={modalType === 'update' && visible}
          onCancel={this.handleCancel}
          footer={null}
          maskClosable={false}
          destroyOnClose
        >
          <VersionModal
            options={this.props.options}
            initials={this.props.initials}
            onModalLoad={this.onModalLoad}
            onUpdate={this.onUpdate}
            onSubmitting={this.handleCancel}
          />
        </Modal>

        <Modal
          key='delete-version'
          title={modalType === 'delete' && modalTitle}
          visible={modalType === 'delete' && visible}
          onOk={this.deleteOnOk}
          onCancel={this.handleCancel}
          okText='确认'
          cancelText='取消'
        >
          <p><Icon type='question-circle' /> 是否确认删除下列分组：</p>
          <p><em>版本：{this.state.modal.currentItem.version}</em></p>
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
