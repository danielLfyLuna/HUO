import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'
import { Table } from 'antd'
import moment from 'moment'

export default class NickList extends Component {

  constructor(props) {
    super(props)
    this.columns = [{
        title: '玩家ID',
        dataIndex: 'playerId',
        width: '30%'
      }, {
        title: '昵称',
        dataIndex: 'name'
      }, {
        title: '修改时间',
        dataIndex: 'editTime',
        width: '30%',
        render: (text) => text ? moment(text).format('YYYY-MM-DD HH:mm:ss') : '正在使用中'
      }]

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
    const archive = nextProps.dataFlow.options.archive
    let dataSource = []
    Object.values(archive.nicknames).map((elem, index) => {
      if (elem.length > 1) {
        dataSource.push({ ...elem.shift(), children: [...elem] })
      } else if (elem.length > 0) {
        dataSource.push({ ...elem.shift() })
      }

    })
    this.setState({
      data: {
        dataSource: [...dataSource],
        count: dataSource.length
      }
    })
  }

  render() {
    const { params, products } = this.props.dataFlow.initials

    let arrParam = []
    products.productId && arrParam.push(`产品/服务器：${products.productId}/${products.serverId}`)
    params.nickname && arrParam.push(`昵称：${params.nickname}`)
    params.playerId && arrParam.push(`玩家 ID：${params.playerId}`)

    const defaultLocale = {
      emptyText: arrParam.length ? `查询：{ ${arrParam.join('，')} }，暂未查到数据` : '未作查询，暂无数据'
    }
    const pagination = {
      showSizeChanger: true,
      defaultPageSize: 50,
      pageSizeOptions: ['20', '50', '100', '200', '500'],
      total: this.state.data.count
    }

    return (
      <Fragment>
        <Table
          bordered
          dataSource={this.state.data.dataSource}
          columns={this.columns}
          locale={defaultLocale}
          rowKey={record => `${record.playerId}-${record.editTime}`}
          pagination={pagination}
        />
      </Fragment>
    )
  }

}

NickList.propTypes = {
  dataFlow: PropTypes.object,
}
