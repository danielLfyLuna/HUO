import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import _ from 'lodash'

import { fetchTradeGoods } from '../modules/GoodsModule'
import { fetchGoodsMap } from '../../../../base/modules/Goods'
import { fetchProductsMap } from '../../../../base/modules/Products'
import { fetchTrades, clearTrades, checkTrade, exportTrades, keepTrade } from '../modules/Module'
import Filter from './Filter'
import List from './List'

const mapDispatchtoProps = {
  fetchTrades,
  clearTrades,
  checkTrade,
  exportTrades,
  keepTrade,
  fetchGoodsMap,
  fetchTradeGoods,
  fetchProductsMap
}
const mapStateToProps = (state) => ({
  trade: state.trade,
  tradeGoods: state.tradeGoods,
  goods: state.goods,
  products: state.products,
  login: state.islogin
})

@connect(mapStateToProps, mapDispatchtoProps)
export default class Trades extends Component {
  state = {
    fields: {
      products: {},
      time: {},
      selectTypes: {},
      itemIds: {},
      state: {},
      sign: {},
      low: 0,
      high: 0,
      buyer: '',
      seller: ''
    },
    initials: {
      params: {
        selectType: 0,
        items: {
          type: 0,
          itemId: 0
        },
        low: 0,
        high: 0,
        buyer: '',
        seller: ''
      },
      products: {
        productId: '',
        serverId: ''
      },
      conf: {
        locale: false,
        tradeState: { 'none': 0, 'pass': 3, 'reject': 2 },
        tradeSign: { 'yes': true, 'no': false },
        select: { 'all': 0, 'sign': 1, 'reject': 2, 'pass': 3, 'item': 4, 'price': 5, 'num': 6, 'name': 7 }
      },
      map: {
        tradeState: { 0: '全部 [NONE]', 2: '禁止上架', 3: '下架' },
        selectTypes: { 0: '全部', 1: '按标注', 2: '按下架', 3: '按禁止上架', 4: '按道具', 5: '按价格', 6: '按数量', 7: '按昵称' },
        tradeStatus: { 1: '待售', 2: '售卖中', 3: '已售', 4: '已下架', 5: '管理员强制下架', 6: '已售且收到钻石', 7: '禁止上架' },
        goodTypes: { 0: '道具', 4: '技能', 5: '武将' }
      },
      enum: {
        selectTypes: [
          { label: '全部', value: 0 },
          { label: '按标注', value: 1 },
          { label: '按下架', value: 2 },
          { label: '按禁止上架', value: 3 },
          { label: '按道具', value: 4 },
          { label: '按价格', value: 5 },
          { label: '按数量', value: 6 },
          { label: '按昵称', value: 7 }
        ],
        tradeState: [
          { label: '全部 [NONE]', value: 0 },
          { label: '禁止上架', value: 2 },
          { label: '下架', value: 3 }
        ],
        tradeSign: [
          { label: '标注', value: true },
          { label: '取消标注', value: false }
        ]
      }
    }
  }

  onChange = (changedFields) => {
    this.setState({
      fields: { ...this.state.fields, ...changedFields }
    })
  }

  onSearch = (fields) => {
    if (fields.handle === 'GET_GOODS') {
      this.state.initials.products = Object.assign(this.state.initials.products, fields.products)
      this.props.fetchGoodsMap(this.state.initials.products)
    } else if (fields.handle === 'GET_TRADES') {
      this.props.fetchTrades({
        products: this.state.initials.products,
        search: fields.search ? `?${fields.search}` : fields.search
      })
      this.setState({
        initials: {
          ...this.state.initials,
          params: {...fields.params},
          conf: {
            ...this.state.initials.conf,
            locale: true
          }
        }
      })
    }
  }
  onExport = (fields) => {
    if (fields.handle === 'GOODS') {
      this.props.fetchTradeGoods(fields.products)
    } else if (fields.handle === 'EXPORTS') {
      this.props.exportTrades({
        products: fields.products,
        search: fields.search ? `?${fields.search}` : fields.search
      })
    }
  }

  onClear = () => {
    this.props.clearTrades()
  }

  onCheck = (fields) => {
    this.props.checkTrade(fields)
  }

  _reduce = (options) => {
    return _.reduce(options, (result, option) => {
      result.push({ value: option.value, label: option.label })
      return result
    }, [])
  }

  _reduceMap = (options) => {
    return _.reduce(options, (result, option, key) => {
      result.push({ value: key, label: option })
      return result
    }, [])
  }

  _goodReduce = (options, types) => {
    let goods = []
    _.reduce(options, (result, option, index) => {
      let gds = []
      _.reduce(option, (res, opt, idx) => {
        res.push({ value: idx, label: opt })
        return res
      }, gds)
      result.push({ value: index, label: types[index], children: gds })
      return result
    }, goods)
    return goods
  }

  componentWillMount() {
    this.props.fetchProductsMap()
    const { trade } = this.props
    this.setState({
      ...this.state.initials,
      ...trade.keeping.index
    })
  }

  componentWillUnmount() {
    this.props.keepTrade({
      index: {
        products: {...this.state.initials.products},
        params: {...this.state.initials.params}
      }
    })
  }


  render() {
    const { goods, products, login } = this.props
    const initials = this.state.initials
    const options = {
      items: goods.list,
      products: products.options,
      goods: {
        map: goods.options,
        list: this._goodReduce(goods.options, initials.map.goodTypes)
      },
      authorize: login.authorize
    }

    return (
      <div>
        <Filter
          tradeGoods={this.props.tradeGoods}
          options={options}
          initials={initials}
          {...this.state.fields}
          data={this.props.trade}
          onChange={this.onChange}
          onSearch={this.onSearch}
          onExport={this.onExport}
          onClear={this.onClear}
        />
        <List
          options={options}
          initials={initials}
          data={this.props.trade}
          onCheck={this.onCheck}
         />
      </div>
    )
  }
}

Trades.propTypes = {
  goods: PropTypes.object,
  tradeGoods: PropTypes.object,
  trade: PropTypes.object,
  products: PropTypes.object,
  login: PropTypes.object,
  fetchTrades: PropTypes.func,
  clearTrades: PropTypes.func,
  checkTrade: PropTypes.func,
  exportTrades: PropTypes.func,
  keepTrade: PropTypes.func,
  fetchGoodsMap: PropTypes.func,
  fetchTradeGoods: PropTypes.func,
  fetchProductsMap: PropTypes.func
}
