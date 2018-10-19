import React, {Component} from 'react'
import PropTypes from 'prop-types'
import { Table, Button, Modal } from 'antd'
import _ from 'lodash'

import Update from './Update'


export default class List extends Component {

  static propTypes = {
    curd: PropTypes.object.isRequired,
    data: PropTypes.array,
    cellOptions: PropTypes.array,
    onUpdate: PropTypes.func
  }

  state = {
    visible: false,
    update: {}
  }

  constructor(props) {
    super(props)
    this.MainColumns = [{
        title: 'id',
        dataIndex: 'id',
        key: 'id'
      }, {
        title: '产品ID',
        dataIndex: 'productId',
        key: 'productId'
      }, {
        title: '',
        dataIndex: 'details',
        key: 'details',
        render: (text, record) => {
          return (
            <Table
              bordered
              dataSource={record.mergeList}
              columns={this.columns}
              pagination={false}
            />
          )
        }
      }, {
        title: '操作',
        dataIndex: 'action',
        render: (text, record) => {
          const { curd } = this.props
          let menuOptions = []
          _.forEach(curd, (value, key, collection) => {
            switch (key) {
              case '20602':
                menuOptions.push(
                  <Button type='primary' key={record.id} onClick={() => this.handleUpdate(record)}>
                    修改
                  </Button>
                )
                break
              default:
            }
          })
          return (
            <div>{menuOptions}</div>
          )
        }
      }]
    this.columns = [
      {
        title: '主节点',
        dataIndex: 'master',
        key: 'master'
      }, {
        title: '从节点',
        dataIndex: 'slaves',
        key: 'slaves',
        render: (text, record) => {
          let values = ''
          values = record.slaves.join(',')
          return values
        }
      }, {
        title: '状态',
        dataIndex: 'status',
        key: 'status',
        render: (text, record) => {
          if (record.status === 0) { return <div style={{color: '#ffb800'}}>初始化</div> }
          if (record.status === 1) { return <div style={{color: '#ff3d00'}}>合服中</div> }
          if (record.status === 2) { return <div>合服完成</div> }
        }
      }, {
        title: '创建时间',
        dataIndex: 'createTime',
        key: 'createTime'
      }, {
        title: '合服时间',
        dataIndex: 'mergeTime',
        key: 'mergeTime'
      }, {
        title: '完成时间',
        dataIndex: 'commitTime',
        key: 'commitTime'
      }
    ]
  }

  handleUpdate = (e) => {
    this.setState({
      visible: true,
      update: e
    })
  }

  handleCancel = () => {
    this.setState({
      visible: false
    })
  }

  render() {
    let pagination = {
      showSizeChanger: true,
      defaultPageSize: 200,
      pageSizeOptions: ['20', '50', '100', '200', '500'],
      total: this.state.count
    }

    return (
      <div>
        <Table
          bordered
          dataSource={this.props.data}
          columns={this.MainColumns}
          rowKey='id'
          pagination={pagination}
        />

        <Modal
          width={1000}
          key={Math.random()}
          title='修改合服'
          visible={this.state.visible}
          onCancel={this.handleCancel}
          footer={null}
          maskClosable={false}
        >
          <Update
            data={this.state.update}
            onUpdate={this.props.onUpdate}
            handleCancel={this.handleCancel}
            cellOptions={this.props.cellOptions}
          />
        </Modal>
      </div>
    )
  }

}
