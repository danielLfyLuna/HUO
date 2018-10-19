import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'
import { Table } from 'antd'
import _ from 'lodash'
import moment from 'moment'

export default class List extends Component {

  static propTypes = {
    data: PropTypes.object,
    onTableChange: PropTypes.func
  }

  state = {
    dataSource: [],
    subjectIdTypes: [
      {k: 1, v: '玩家(player)'},
      {k: 2, v: '联盟(alliance)'},
      {k: 3, v: '农田(farm)'},
      {k: 4, v: '道具(item)'},
      {k: 5, v: '技能(skill)'},
      {k: 6, v: '科技(science)'},
      {k: 7, v: '武将(soldier)'},
      {k: 8, v: '灵魂刻印(soul)'},
      {k: 9, v: '副本(tollgate)'},
      {k: 10, v: '建筑(building)'},
      {k: 11, v: 'amulet_item(amulet_item)'},
      {k: 12, v: '坐骑(horse)'},
      {k: 13, v: '法宝(magic)'},
      {k: 14, v: '神兽(pet)'},
      {k: 15, v: '炼魔鼎(pot)'},
      {k: 16, v: '元神(spirit)'},
      {k: 17, v: '元神装备(spirit_equip)'},
      {k: 18, v: '卧龙顶(wolong)'}
    ],
    fields: {
      nickname: {
        value: ''
      },
      playerId: {
        value: ''
      },
      'range-time-picker': {},
      'products': {},
      'datachangeSourceList': {
        value: []
      }
    },
    pagination: {
      current: 1,
      pageSize: 50,
      total: 0
    }
  }

  constructor(props) {
    super(props)
    this.columns = [{
        title: '玩家ID',
        dataIndex: 'playerId',
        key: 'playerId'
      }, {
        title: '昵称',
        dataIndex: 'nickname',
        key: 'nickname'
      }, {
        title: '主体ID',
        dataIndex: 'subjectId',
        key: 'subjectId'
      }, {
        title: '主体',
        dataIndex: 'subjectIdType',
        key: 'subjectIdType',
        render: (text) => {
          let type = ''
          _.map(this.state.subjectIdTypes, (val, idx) => {
            (val.k === text) && (type = val.v)
          })
          return type
        }
      }, {
        title: '创建时间',
        dataIndex: 'createTime',
        key: 'createTime',
        render: (text) => {
          return moment(text).format('YYYY-MM-DD HH:mm:ss')
        }
      }, {
        title: '变化前值',
        dataIndex: 'oldValue',
        key: 'oldValue'
      }, {
        title: '变化后值',
        dataIndex: 'curValue',
        key: 'curValue'
      }, {
        title: '变化源',
        dataIndex: 'dataChangeType',
        key: 'dataChangeType',
        render: (text) => {
          let type = ''
          _.map(this.props.data.source, (val, idx) => {
            (val === text) && (type = idx)
          })
          return type
        }
      }]
  }

  componentWillReceiveProps(nextProps) {
    const { domainObject = [], pagination = {} } = nextProps.data.list
    let dataSource = []
    domainObject.map(function(elem, index) {
      dataSource.push({key: index, ...elem})
    })

    this.setState({
      dataSource: [...dataSource],
      pagination: {
        current: pagination.pageNum,
        pageSize: pagination.pageSize,
        total: pagination.total
      }
    })
  }

  handleTableChange = (pagination) => {
    this.setState({
      pagination: {
        current: pagination.current,
        pageSize: pagination.pageSize,
        total: pagination.total
      }
    })
    this.props.onTableChange(pagination)
  }

  render() {
    const { fetching } = this.props.data

    return (
      <Fragment>
        <Table
          bordered
          dataSource={this.state.dataSource}
          columns={this.columns}
          pagination={{
            showSizeChanger: true,
            defaultPageSize: 50,
            pageSizeOptions: ['20', '50', '100', '200', '500'],
            current: this.state.pagination.current,
            pageSize: this.state.pagination.pageSize,
            total: this.state.pagination.total
          }}
          loading={fetching}
          onChange={this.handleTableChange}
        />
      </Fragment>
    )
  }

}
