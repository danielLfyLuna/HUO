/* global API_HOST */
import React from 'react'
import { Modal, Table, Button } from 'antd'
import _ from 'lodash'

export function alert(response) {
  let dataSource = []
  let columns = [{
      title: '产品ID',
      dataIndex: 'productId',
      key: 'productId'
    }, {
      title: '服务器ID',
      dataIndex: 'serverId',
      key: 'serverId'
    }, {
      title: '开始时间',
      dataIndex: 'startTime',
      key: 'startTime'
    }, {
      title: '结束时间',
      dataIndex: 'endTime',
      key: 'endTime'
    }, {
      title: '是否成功',
      dataIndex: 'isSuccess',
      key: 'isSuccess',
      render: (text, record) => {
        return (
          record.isSuccess ? <p>是</p> : <p>否</p>
        ) }
    }, {
      title: '描述',
      dataIndex: 'desc',
      key: 'desc'
    }, {
      title: '下载导出文件',
      dataIndex: 'download',
      key: 'download',
      render: (text, record) => {
        return (
          <Button
            type='primary'
            disabled={!record.isSuccess}
          >
            <a href={`${API_HOST}/huo/${record.logFileUrl}`}>点击下载</a>
          </Button>
        ) }
    }]
  if (response.status == 200) {
    _.map(response.data.domainObject, (val, index) => {
      dataSource.push({
        key: index,
        startTime: val.startTime,
        endTime: val.endTime,
        productId: val.productId,
        serverId: val.serverId,
        logFileUrl: val.logFileUrl,
        isSuccess: val.isSuccess,
        desc: val.desc
      })
    })
  }

  Modal.info({
    title: '查看详细信息',
    width: 1000,
    content: (
      <Table
        rowKey='key'
        bordered
        dataSource={dataSource}
        columns={columns}
        pagination={{
        pageSize: 50
        }}
      />
    ),
    onOk() {}
  })

}
