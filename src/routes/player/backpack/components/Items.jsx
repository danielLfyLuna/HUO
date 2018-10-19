import React from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import { Modal, Table } from 'antd'

const viewItemPane = ({ dataSource }) => {

  const columns = [{
    title: '道具 ID',
    dataIndex: 'itemId',
  }, {
    title: '背包类型',
    dataIndex: 'bagType',
  }, {
    title: '背包名称',
    dataIndex: 'bagName',
  }, {
    title: '道具模板 ID',
    dataIndex: 'itemTemplateId',
  }, {
    title: '道具模板名称',
    dataIndex: 'itemTemplateName',
  }, {
    title: '数量',
    dataIndex: 'count',
  }, {
    title: 'pos',
    dataIndex: 'pos',
  }, {
    title: '强化等级',
    dataIndex: 'intensifyLevel',
  }, {
    title: '创建时间',
    dataIndex: 'createTime',
    render: (text, record) => moment(record.createTime).format('YYYY-MM-DD HH:mm:ss')
  }]

  Modal.info({
    title: '查看背包道具信息',
    okText: '关闭',
    width: 1000,
    content: (
      <Table
        size='middle'
        dataSource={dataSource}
        columns={columns}
        rowKey='itemId'
        pagination={{ pageSize: 50 }}
      />
    )
  })
}

viewItemPane.propTypes = {
  title: PropTypes.object,
  visible: PropTypes.boolean,
  onCancel: PropTypes.func,
  footer: PropTypes.object
}

export {
  viewItemPane
}
