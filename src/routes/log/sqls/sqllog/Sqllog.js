/* global API_HOST */
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Card, Table, Button, Modal } from 'antd'

import Filter from './Filter'
import {
  fetchSqls,
  downloadSqls
 } from './Module'
import { fetchProductsMap } from '../../../../base/modules/Products'

const mapDispatchtoProps = {
  fetchSqls,
  downloadSqls,
  fetchProductsMap
}
const mapStatetoProps = (state) => ({
  sqllog: state.sqllog,
  login: state.islogin,
  products: state.products
})

@connect(mapStatetoProps, mapDispatchtoProps)
export default class Modals extends Component {
  static propTypes = {
    // downloadSqls: PropTypes.func,
    fetchProductsMap: PropTypes.func,
    fetchSqls: PropTypes.func,
    sqllog: PropTypes.object,
    login: PropTypes.object,
    products: PropTypes.object
  }

  componentWillMount() {
    this.props.fetchProductsMap()
  }

  onSearch = (v) => {
    this.props.fetchSqls(v)
  }

  onDownload = (url) => {
    // const downloadSqls = this.props.downloadSqls
    Modal.confirm({
      title: '下载日志？',
      content: '确认下载请点击[确认]，取消操作请点击[取消]',
      onOk() {
        // downloadSqls(url)
        window.open(`${API_HOST}/huo/sqls/download/logs/${url.id}`)
      }
    })
  }

  constructor(props) {
    super(props)
    this.columns = [
      {
        title: 'id',
        dataIndex: 'id',
        key: 'id'
      }, {
        title: '产品ID',
        dataIndex: 'productId',
        key: 'productId'
      }, {
        title: '操作',
        dataIndex: 'serverId',
        key: 'serverId'
      }, {
        title: '生成日期',
        dataIndex: 'genDate',
        key: 'genDate'
      }, {
        title: '状态',
        dataIndex: 'status',
        key: 'status',
        render: (text) => {
          return text ? '成功' : '失败'
        }
      }, {
        title: '操作',
        dataIndex: 'action',
        key: 'action',
        render: (text, record) => {
          return (
            <Button onClick={() => this.onDownload(record)}>下载</Button>
          )
        }
      }
    ]
  }

  render() {
    const { sqllog, login } = this.props
    return (
      <Card>
        {
          login.authorize.includes(50801) &&
          <Filter
            products={this.props.products}
            onSearch={this.onSearch}
          />
        }

        <Table
          bordered
          dataSource={sqllog.list}
          columns={this.columns}
          rowKey='id'
          pagination={{
            defaultPageSize: 500,
            showSizeChanger: true,
            pageSizeOptions: ['20', '50', '100', '200', '500', '1000']
          }}
        />
      </Card>
    )
  }
}
