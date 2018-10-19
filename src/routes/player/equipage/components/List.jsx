import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'
import { Table } from 'antd'

import DropOption from '../../../../base/components/DropOption'

export default class BackList extends Component {

  constructor(props) {
    super(props)
    const { gender, job } = this.props.initials.map
    this.columns = [
      { title: '玩家 ID', dataIndex: 'playerId' },
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
      { title: 'VIP等级', dataIndex: 'vipLevel' },
      {
        title: '操作',
        render: (text, record, index) => {
          let menuOptions = []
          menuOptions.push({key: 'ITEM', name: '查看背包道具'})
          menuOptions.push({key: 'DOWN', name: '导出背包道具'})

          return (
            <DropOption
              onMenuClick={e => this.handleMenuClick(record, e)}
              menuOptions={menuOptions}
              dropdownProps={{ trigger: ['hover'] }}
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
    const backpack = nextProps.options.backpack
    let dataSource = []
    backpack.list.map(function(elem, index) {
      dataSource.push({key: index, ...elem})
    })
    this.setState({
      data: {
        dataSource: [...dataSource],
        count: dataSource.length
      }
    })
  }

  handleMenuClick = (record, e) => {
    const { products } = this.props.params
    const paths = {
      productId: products.value[0],
      serverId: products.value[1],
      playerId: record.playerId,
      nickname: record.nickname
    }
    switch (e.key) {
      case 'ITEM':
        this.props.onSearch({
          path: paths,
          handle: e.key
        })
        break
      case 'DOWN':
        this.props.onSearch({
          path: paths,
          handle: e.key
        })
        break
      default:
        return 'Error'
    }
  }


  render() {
    const { options } = this.props
    const pagination = {
      showSizeChanger: true,
      defaultPageSize: 50,
      pageSizeOptions: ['20', '50', '100', '200', '500'],
      total: options.backpack.list.length
    }

    return (
      <Fragment>
        <Table
          bordered
          dataSource={options.backpack.list}
          columns={this.columns}
          rowKey='playerId'
          pagination={pagination}
        />
      </Fragment>
    )
  }

}

BackList.propTypes = {
  options: PropTypes.object,
  initials: PropTypes.object,
  params: PropTypes.object,
  onSearch: PropTypes.func
}
