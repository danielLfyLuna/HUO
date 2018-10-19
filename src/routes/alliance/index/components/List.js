import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router'
import { Table, Button } from 'antd'
import moment from 'moment'

export default class List extends Component {
  constructor(props) {
    super(props)
    this.columns = [
      {
        title: '联盟 ID',
        dataIndex: 'allianceId',
        key: 'allianceId'
      }, {
        title: '名称',
        dataIndex: 'name',
        key: 'name'
      }, {
        title: '等级',
        dataIndex: 'level',
        key: 'level'
      }, {
        title: '盟主 ID',
        dataIndex: 'leaderPlayerId',
        key: 'leaderPlayerId'
      }, {
        title: ' 盟主昵称',
        dataIndex: 'leaderName',
        key: 'leaderName'
      }, {
        title: '升级冷却时间',
        dataIndex: 'coolEndTime',
        key: 'coolEndTime'
      }, {
        title: '创建时间',
        dataIndex: 'createTime',
        key: 'createTime',
        render: (text, record) => {
          return text ? moment(text).format('YYYY-MM-DD HH:mm:ss') : text
        }
      }, {
        title: '是否自动创建',
        dataIndex: 'isAuto',
        key: 'isAuto'
      }, {
        title: '联盟所在州',
        dataIndex: 'regionId',
        key: 'regionId'
      }, {
        title: '盟主申请开始时间',
        dataIndex: 'leaderApplyStartTime',
        key: 'leaderApplyStartTime'
      }, {
        title: '最近一次盟主更换时间',
        dataIndex: 'leaderLastChangeTime',
        key: 'leaderLastChangeTime'
      }, {
        title: '服务器 ID',
        dataIndex: 'serverId',
        key: 'serverId'
      }, {
        title: '联盟人数',
        dataIndex: 'totalMemberCount',
        key: 'totalMemberCount'
      }, {
        title: '势力值',
        dataIndex: 'power',
        key: 'power'
      }, {
        title: '操作',
        dataIndex: 'action',
        key: 'action',
        render: (text, record) => {
          const { initials } = this.props
          let pathname = '/alliance/member'
          let query = { ...initials.products, serverId: record.serverId, allianceId: record.allianceId }
          return (
            <div>
              {
                // options.authorize.includes(130102) &&
                <Link to={{ pathname: pathname, query: { ...query, handle: 'members' } }}>
                  <Button>联盟成员列表</Button>
                </Link>
              }
            </div>
          )
        }
      }
    ]

    this.dataSource = []
  }

  render() {
    const { products, conf } = this.props.initials
    const options = this.props.options
    this.dataSource = options.alliance.list
    let arrParam = []
    products.productId ? arrParam.push(`产品/服务器：${products.productId}/${products.serverId}`) : ''
    let strParam = arrParam.join('，')
    let defaultLocale = {
      emptyText: conf.locale ? `查询：{ ${strParam} }，暂未查到数据` : '未作查询，暂无数据'
    }
    let pagination = {
      showSizeChanger: true,
      defaultPageSize: 50,
      pageSizeOptions: ['20', '50', '100', '200', '500'],
      total: this.dataSource.length
    }
    return (
      <Fragment>
        <Table
          dataSource={this.dataSource}
          columns={this.columns}
          locale={defaultLocale}
          rowKey='allianceId'
          pagination={pagination}
          bordered
        />
      </Fragment>
    )
  }
}

List.propTypes = {
  options: PropTypes.object,
  initials: PropTypes.object
}
