import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'
import { Table } from 'antd'

const qualityKeys = {
  0: '白',
  1: '绿',
  2: '蓝',
  3: '紫',
  4: '橙'
}

const colorKeys = {
  0: 'white',
  1: 'green',
  2: 'DeepSkyBlue',
  3: 'Orchid',
  4: 'orange'
}

// const aptitudeKeys = {
//   0: '良好',
//   1: '优秀',
//   2: '卓越',
//   3: '完美'
// }

export default class BackList extends Component {

  constructor(props) {
    super(props)
    this.columns = [
      { title: '武将模板ID', dataIndex: 'soldierTemplateId' },
      { title: '武将ID', dataIndex: 'soldierId' },
      { title: '武将名称', dataIndex: 'soldierTemplateName' },
      { title: '战斗力', dataIndex: 'fightCapacity' },
      { title: '经验', dataIndex: 'exp' },
      {
        title: '品质',
        dataIndex: 'quality',
        render: (text, record, index) => {
          const qualityColor = {
            border: '1px solid #666',
            padding: '2px 10px',
            textAlign: 'center',
            borderRadius: '10px',
            background: colorKeys[text]
          }
          const qualityName = qualityKeys[text]
          return <div style={qualityColor}>{qualityName}</div>
        }
      },
      {
        title: '是否上阵',
        dataIndex: 'onFormation',
        render: (text, record) => record.onFormation ? '上阵' : '未上阵'
      },
      { title: '队伍', dataIndex: 'index' },
      { title: '资质', dataIndex: 'aptitude' },
      { title: '等级', dataIndex: 'level' },
      { title: '星级', dataIndex: 'starLevel' },
      { title: '段数', dataIndex: 'starExp' },
      { title: '段数经验', dataIndex: 'starExpExp' }
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
    const equipage = nextProps.options.equipage
    let dataSource = []
    equipage.soldiers.map(function(elem, index) {
      dataSource.push({key: index, ...elem})
    })
    this.setState({
      data: {
        dataSource: [...dataSource],
        count: dataSource.length
      }
    })
  }

  render() {
    const { options } = this.props
    const { params, products } = this.props.initials

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
      total: options.equipage.soldiers.length
    }

    return (
      <Fragment>
        <Table
          bordered
          dataSource={options.equipage.soldiers}
          columns={this.columns}
          locale={defaultLocale}
          rowKey='soldierTemplateId'
          pagination={pagination}
        />
      </Fragment>
    )
  }

}

BackList.propTypes = {
  options: PropTypes.object,
  initials: PropTypes.object,
  // params: PropTypes.object,
  // onSearch: PropTypes.func
}
