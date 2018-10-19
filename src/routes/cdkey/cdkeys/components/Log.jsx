/* global API_HOST */
import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { Table } from 'antd'
import { browserHistory } from 'react-router'

import DropOption from '../../../../base/components/DropOption'
import {
  fetchGenerateLog
} from '../modules/Module'

const mapDispatchtoProps = {
  fetchGenerateLog
}

const mapStateToProps = (state) => ({
  cdkey: state.cdkey,
  login: state.islogin
})

@connect(mapStateToProps, mapDispatchtoProps)
export default class Log extends Component {
  state = {
    currentItem: {},
    modalType: ''
  }

  constructor(props) {
    super(props)
    const { options } = this.props.dataFlow
    this.columns = [
      {
        title: 'ID',
        dataIndex: 'id',
        key: 'id'
      }, {
        title: '活动 ID',
        dataIndex: 'activityId',
        key: 'activityId'
      }, {
        title: '产品 ID',
        dataIndex: 'productId',
        key: 'productId'
      }, {
        title: '渠道',
        dataIndex: 'channel',
        key: 'channel',
        render: (text, record) => {
          return record.channel ? options.globals.channels[record.channel] : ''
        }
      }, {
        title: '数量',
        dataIndex: 'number',
        key: 'number'
      }, {
        title: '创建者',
        dataIndex: 'creator',
        key: 'creator'
      }, {
        title: '创建时间',
        dataIndex: 'createDate',
        key: 'createDate'
      }, {
        title: '操作',
        dataIndex: 'action',
        key: 'action',
        render: (text, record) => {
          const { options } = this.props.dataFlow

          let menuOptions = []
          options.login.authRoutes.includes('cdkey-download') &&
            menuOptions.push({key: 'DOWNLOAD', name: '下载兑换码'})
          // options.login.authRoutes.includes('cdkey-set') && record.type === 7 &&
          options.login.authRoutes.includes('cdkey-set') &&
            menuOptions.push({key: 'SET', name: '设置CDKEY'})
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

    this.dataSource = []
  }

  componentWillMount() {
    const { currentItem, modalType } = this.props.onModalLoad()

    this.setState({
      currentItem: currentItem,
      modalType: modalType
    })
    this.props.fetchGenerateLog({
      path: {
        productId: currentItem.productId,
        activityId: currentItem.activityId
      }
    })
  }

  handleMenuClick = (record, e) => {
    if (e.key === 'DOWNLOAD') {
      const path = `${API_HOST}/huo/products/${record.productId}/cdkeyactivities/${record.activityId}/cdkeys/download/${record.id}`
      window.open(path)
    }
    if (e.key === 'SET') {
      browserHistory.push(`/cdkey/setCDkey?productId=${record.productId}&id=${record.id}`)
    }
  }


  render() {
    const { cdkey: { generateLogs } } = this.props

    this.dataSource = generateLogs.length ? [...generateLogs] : []

    let pagination = {
      showSizeChanger: true,
      defaultPageSize: 50,
      pageSizeOptions: ['20', '50', '100', '200', '500'],
      total: this.dataSource.length
    }

    return (
      <div>
        <Table
          dataSource={this.dataSource}
          columns={this.columns}
          rowKey='id'
          pagination={pagination}
          bordered
        />
      </div>
    )
  }
}

Log.propTypes = {
  cdkey: PropTypes.object,
  dataFlow: PropTypes.object,
  onModalLoad: PropTypes.func,
  fetchGenerateLog: PropTypes.func
}
