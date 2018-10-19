import React from 'react'
import { Modal, Table } from 'antd'

export function alert(response) {
  let dataSource = []
  let columns = []
  if (response.data.domainObject.columnNames.length > 0) {

    if (response.data.domainObject.success === true) {
      response.data.domainObject.columnNames.map((value, index) => {
        columns.push({
          title: value,
          dataIndex: value,
          key: value
        })
      })
      dataSource = response.data.domainObject.rowMapDatas
    }
  }

  Modal.info({
    title: '查看详细信息',
    width: 1000,
    content: (
      <Table bordered dataSource={dataSource} columns={columns} />
    ),
    onOk() {}
  })

}
