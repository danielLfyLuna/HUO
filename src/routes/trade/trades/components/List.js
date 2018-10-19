import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Table, Button, Modal } from 'antd'
// import _ from 'lodash'
import moment from 'moment'
import Filters from './Form'

const ButtonGroup = Button.Group


export default class List extends Component {
  state = {
    dataSource: [],
    count: 0,
    visible: false,
    option: {}
  }

  constructor(props) {
    super(props)
    this.columns = [
      {
        title: '交易 ID',
        dataIndex: 'id',
        key: 'id',
        width: 80,
        fixed: 'left'
      }, {
        title: '价格',
        dataIndex: 'price',
        key: 'price'
      }, {
        title: '数量',
        dataIndex: 'num',
        key: 'num'
      }, {
        title: '原本道具 ID',
        dataIndex: 'itemId',
        key: 'itemId'
      }, {
        title: '道具 ID',
        dataIndex: 'templateId',
        key: 'templateId',
        render: (text, record) => {
          return `${record.templateId}(${record.itemName})`
        }
      }, {
        title: '上架人自身 ID',
        dataIndex: 'sourceId',
        key: 'sourceId'
      }, {
        title: '卖家名称',
        dataIndex: 'sellerName',
        key: 'sellerName'
      }, {
        title: '购买者 ID',
        dataIndex: 'buyerId',
        key: 'buyerId'
      }, {
        title: '购买者',
        dataIndex: 'buyerName',
        key: 'buyerName'
      }, {
        title: '上架时间',
        dataIndex: 'createTime',
        key: 'createTime',
        render: (text, record) => {
          return moment(text).format('YYYY-MM-DD HH:mm:ss')
        }
      }, {
        title: '更新时间',
        dataIndex: 'updateTime',
        key: 'updateTime',
        render: (text, record) => {
          return moment(text).format('YYYY-MM-DD HH:mm:ss')
        }
      }, {
        title: '操作人',
        dataIndex: 'adminUserName',
        key: 'adminUserName',
        render: (text, record) => {
          return record.mapping.adminUserName
        }
      }, {
        title: '下架原因',
        dataIndex: 'reason',
        key: 'reason',
      }, {
        title: '是否标注',
        dataIndex: 'isSign',
        key: 'isSign',
        width: 80,
        fixed: 'right',
        render: (text, record) => {
          return text ? <div style={{color: '#EE0000'}}>已标注</div> : '未标注'
        }
      }, {
        title: '状态',
        dataIndex: 'status',
        key: 'status',
        width: 100,
        fixed: 'right',
        render: (text, record) => {
          return this.props.initials.map.tradeStatus[record.status]
        }
      }, {
        title: '操作',
        dataIndex: 'action',
        width: 280,
        fixed: 'right',
        render: (text, record) => {
          const { tradeState, tradeSign } = this.props.initials.conf
          const { options } = this.props
          return (
            <div>
              {
                options.authorize.includes(170102) &&
                <ButtonGroup size='small'>
                  <Button icon={record.isSign ? 'tags' : 'tag-o'} type='default' onClick={() => this.handleCheck({
                    ...record,
                    isSign: record.isSign ? tradeSign.no : tradeSign.yes
                  }, {
                    handle: 'SIGN'
                  })}>{record.isSign ? '取消标注' : '添加标注'}</Button>
                  <Button type='danger' ghost onClick={() => this.handleCheck({
                    ...record,
                    state: tradeState.reject
                  }, {
                    handle: 'STATE'
                  })}>驳回</Button>
                  <Button type='primary' ghost onClick={() => this.handleCheck({
                    ...record,
                    state: tradeState.pass
                  }, {
                    handle: 'STATE'
                  })}>通过</Button>
                </ButtonGroup>
              }
            </div>
          )
        }
      }
    ]
  }

  componentWillReceiveProps(nextProps) {
    const trade = nextProps.data
    let dataSource = []
    trade.list.map(function(elem, index) {
      dataSource.push({key: index, ...elem})
    })
    this.setState({
      dataSource: [...dataSource],
      count: dataSource.length
    })
  }

  handleCheck = (option, action) => {
    this.setState({
      visible: action.handle !== 'SIGN',
      option: option
    })
    if (action.handle === 'SIGN') {
      this.onCheck(option)
    }
  }

  onCheck = (option) => {
    this.props.onCheck({
      send: {
        id: option.id,
        isSign: option.isSign,
        state: option.state
      },
      products: this.props.initials.products
    })
  }

  actionOnOk = (value) => {
    let option = {
      id: this.state.option.id,
      reason: value.reason,
      state: this.state.option.state
    }
    // const dataSource = [...this.state.dataSource]

    // _.map(dataSource, (val, index) => {
    //   if (val.key === option.key) {
    //     val = Object.assign(val, option)
    //   }
    // })
    this.setState({
      visible: false,
      // dataSource: [...dataSource]
    })
    this.props.onCheck({
      send: option,
      products: this.props.initials.products
    })
  }

  actionOnCancel = () => {
    this.setState({
      visible: false,
      option: {}
    })
  }

  render() {
    const { params, products, conf, map: { tradeState, selectTypes } } = this.props.initials
    let arrParam = []
    products.productId ? arrParam.push(`产品/服务器：${products.productId}/${products.serverId}`) : ''
    params.selectType ? arrParam.push(`类型：${selectTypes[params.selectType]}`) : ''
    params.items.itemId ? arrParam.push(`道具：${params.items.itemId}`) : ''
    params.low ? arrParam.push(`最小值：${params.low}`) : ''
    params.high ? arrParam.push(`最大值：${params.high}`) : ''
    let strParam = arrParam.join('，')
    let defaultLocale = {
      emptyText: conf.locale ? `查询：{ ${strParam} }，暂未查到数据` : '未作查询，暂无数据'
    }
    let pagination = {
      showSizeChanger: true,
      defaultPageSize: 50,
      pageSizeOptions: ['20', '50', '100', '200', '500'],
      total: this.state.count
    }

    return (
      <div>
        <Table
          bordered
          dataSource={this.state.dataSource}
          columns={this.columns}
          locale={defaultLocale}
          rowKey='id'
          scroll={{ x: 1600 }}
          pagination={pagination}
        />

        <Modal
          key={Math.random()}
          title={<p data={this.props.data}>确定 {tradeState[this.state.option.state]} 此条记录吗?</p>}
          visible={this.state.visible}
          onCancel={this.actionOnCancel}
          footer={null}
        >
          <Filters
            actionOnCancel={this.actionOnCancel}
            actionOnOk={this.actionOnOk}
          />
        </Modal>
      </div>
    )
  }

}

List.propTypes = {
  data: PropTypes.object,
  initials: PropTypes.object,
  options: PropTypes.object,
  onCheck: PropTypes.func
}
