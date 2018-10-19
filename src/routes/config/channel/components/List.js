import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Table } from 'antd'
import _ from 'lodash'


export default class List extends Component {
  state = {
    dataSource: [],
    visible: false
  }

  constructor(props) {
    super(props)
    this.columns = [
      {
        title: 'channel',
        dataIndex: 'channel',
        key: 'channel'
      }, {
        title: '名称',
        dataIndex: 'name',
        key: 'name'
      }
    ]
  }

  componentWillReceiveProps(nextProps) {
  }

  render() {
    const dataSource = _.map(this.props.data.list, (val, idx) => ({
      channel: idx,
      name: val
    }))
    return (
      <div>
        <Table bordered dataSource={dataSource}
          columns={this.columns}
          rowKey='channel'
          size='small'
          pagination={{
            showSizeChanger: true,
            defaultPageSize: 500,
            pageSizeOptions: ['20', '50', '100', '200', '500']
          }}
         />
      </div>
    )
  }
}

List.propTypes = {
  data: PropTypes.object
}
