import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'
import { Table, Button, Icon, Popconfirm } from 'antd'
import _ from 'lodash'

export default class OfflineList extends Component {

  constructor(props) {
    super(props)
    const { gender, job } = this.props.initials.map
    this.columns = [
      { title: '玩家昵称', dataIndex: 'nickname' },
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
      {
        title: '登录状态',
        dataIndex: 'online',
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
        render: (text, record, index) => {
          const {curd} = this.props.options.login
          if (_.has(curd, '70902')) {
            return (
              record.online
              ?
                <Popconfirm title='您确定要强制该用户退出吗?' onConfirm={() => this.onKickout(text, record, index)} okText='Yes' cancelText='No'>
                  <Button size='small' type='danger'>踢出</Button>
                </Popconfirm>
              :
                <Button disabled size='small' type='danger'>离线状态</Button>
            )
          } else {
            return (
              <span>无踢人权限</span>
            )
          }
        }
      }
    ]

    this.state = {
      data: {
        dataSource: [],
        count: 0
      }
    }
  }

  componentWillReceiveProps(nextProps, nextState) {
    const offline = nextProps.options.offline
    let dataSource = []
    offline.list.map(function(elem, index) {
      dataSource.push({key: index, ...elem})
    })
    this.setState({
      data: {
        dataSource: [...dataSource],
        count: dataSource.length
      }
    })
  }

  onKickout = (record, e) => {
    console.log(this.props.products.value, this.list)
    this.props.handleKickoutHead(this.props.products.value, record.playerId, this.list)
  }

  render() {
    let pagination = {
      showSizeChanger: true,
      defaultPageSize: 50,
      pageSizeOptions: ['20', '50', '100', '200', '500'],
      total: this.state.data.count
    }
    console.log(this.props.options)
    return (
      <Fragment>
        <Table
          bordered
          dataSource={this.state.data.dataSource}
          columns={this.columns}
          rowKey='playerId'
          pagination={pagination}
        />
      </Fragment>
    )
  }

}

OfflineList.propTypes = {
  options: PropTypes.object,
  initials: PropTypes.object,
  products: PropTypes.object,
  handleKickoutHead: PropTypes.func,
}
