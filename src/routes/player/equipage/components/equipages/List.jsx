import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'
import { Table } from 'antd'
import moment from 'moment'

// const typeKeys = {
//   0: '否',
//   1: '是'
// }

const qualityKeys = {
  0: '白',
  1: '绿',
  2: '蓝',
  3: '紫',
  4: '橙',
  5: '红'
}

const colorKeys = {
  0: 'white',
  1: 'green',
  2: 'DeepSkyBlue',
  3: 'Orchid',
  4: 'orange',
  5: 'red'
}

export default class BackList extends Component {

  constructor(props) {
    super(props)
    this.columns = [
      { title: '道具名称', dataIndex: 'itemTemplateName' },
      { title: '是否绑定',
        dataIndex: 'binding',
        render: (text, record) => {
          return text ? '是' : '否'
        }
      },
      { title: '评分', dataIndex: 'score' },
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
      { title: '数量', dataIndex: 'count' },
      { title: '位置', dataIndex: 'pos' },
      { title: '强化等级', dataIndex: 'intensifyLevel' },
      { title: '道具ID', dataIndex: 'itemId' },
      { title: '道具模板ID', dataIndex: 'itemTemplateId' },
      { title: '宝石', dataIndex: 'inlayGemStr' },
      {
        title: '创建时间',
        dataIndex: 'createTime',
        render: (text, record) => moment(record.createTime).format('YYYY-MM-DD HH:mm:ss')
      }
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
    equipage.equipages.map(function(elem, index) {
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
      total: options.equipage.equipages.length
    }

    return (
      <Fragment>
        <Table
          bordered
          dataSource={options.equipage.equipages}
          columns={this.columns}
          locale={defaultLocale}
          rowKey='itemId'
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
