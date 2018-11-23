import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'

import Filter from './Filter'
import List from './List'

import {
  keepGlobals,
  fetchGlobalProducts,
  fetchGlobalGoods,
  fetchGlobalItems,
  fetchGlobalChannels
} from '../../../../base/modules/Global'

import {
  fetchCDKeys,
  clearCDKeys,
  updateCDKey,
  createCDKey,
  generateCDKey
} from '../modules/Module'

const mapDispatchtoProps = {
  fetchCDKeys,
  clearCDKeys,
  updateCDKey,
  createCDKey,
  generateCDKey,
  keepGlobals,
  fetchGlobalProducts,
  fetchGlobalGoods,
  fetchGlobalItems,
  fetchGlobalChannels
}

const mapStateToProps = (state) => ({
  cdkey: state.cdkey,
  globals: state.globals,
  login: state.islogin
})

@connect(mapStateToProps, mapDispatchtoProps)
export default class CDKeys extends Component {
  state = {
    fields: {
      products: {
        value: []
      }
    },
    initials: {
      paths: {},
      map: {
        cdkeyTypes: {
          1: '普通兑换码',
          2: '通用兑换码',
          3: '每日通用码',
          4: '每周通用码',
          5: 'QQ充值通用码',
          6: '多次兑换',
          7: '周期类cdkey(通用)'
        },
        goodTypes: { 0: '道具', 4: '技能', 5: '武将' }
      },
      conf: {
        itemTypes: { item: 0, skill: 4, role: 5 }
      },
      enum: {
        cdkeyTypes: [
          { label: '普通兑换码(1)', value: 1 },
          { label: '通用兑换码(2)', value: 2 },
          { label: '每日通用码(3)', value: 3 },
          { label: '每周通用码(4)', value: 4 },
          { label: 'QQ充值通用码(5)', value: 5 },
          { label: '多次兑换(6)', value: 6 },
          { label: '周期类cdkey(通用)(7)', value: 7 }
        ]
      }
    }
  }

  componentWillMount() {
    this.props.fetchGlobalProducts()
    this.props.fetchGlobalChannels()

    const { globals } = this.props
    const products = globals.keeping.cdkey && globals.keeping.cdkey.products
    if (products && products.value && products.value.length) {
      this.props.fetchCDKeys({
        path: {
          productId: products.value[0]
        }
      })
      this.setState({
        fields: {
          ...this.state.fields,
          products
        }
      })
    }
  }

  onSearch = (values) => {
    if (values.handle === 'SEARCH') {
      this.props.fetchCDKeys(values)
      this.props.fetchGlobalGoods(values)
      this.props.keepGlobals({
        cdkey: {
          ...this.state.fields
        }
      })
    } else if (values.handle === 'GOODS') {
      this.props.fetchGlobalGoods(values)
    } else if (values.handle === 'ITEMS') {
      this.props.fetchGlobalItems(values)
    }
  }

  onUpdate = (fields) => {
    this.props.updateCDKey(fields)
  }

  onCreate = (fields) => {
    this.props.createCDKey(fields)
  }

  onSwitch = (fields) => {
    this.props.switchActivity(fields)
  }

  onGenerate = (fields) => {
    this.props.generateCDKey(fields)
  }

  _productFormat = (products) => products.map(val => ({
    value: val.value, label: val.label
  }))

  _goodFormat = (goods, types) => Object.entries(goods).map(val => ({
    label: types[val[0]],
    value: val[0],
    children: Object.entries(val[1]).map(v => ({
      label: v[1],
      value: v[0]
    }))
  }))

  _channelsFormat = (channels) => {
    let arr = []
    Object.entries(channels).map(val => {
      arr.push({
        label: `${val[1]}(${val[0]})`,
        value: val[0]
      })
    })
    arr.unshift({
      label: 'ALL(全部渠道)',
      value: '_'
    })
    return arr
  }

  _channelFormat = (channels) => {
    let result = []
    channels.map(val => {
      const ch = { label: `${val.name}(${val.channel})`, value: val.channel }
      val.channel === '_'
      ? result.unshift(ch)
      : result.push(ch)
    })

    return result
  }

  render() {
    const { globals, login, cdkey } = this.props

    const productOpt = this._productFormat(globals.products)
    const dataFlow = {
      initials: this.state.initials,
      options: {
        fields: this.state.fields,
        globals,
        login,
        cdkey,
        products: productOpt,
        productIds: [{'value': '_', 'label': '全部(_)'}, ...productOpt],
        goods: this._goodFormat(globals.goods, this.state.initials.map.goodTypes),
        channels: this._channelsFormat(globals.channels)
      }
    }

    return (
      <Fragment>
        <Filter
          dataFlow={dataFlow}
          onCreate={this.onCreate}
          onSearch={this.onSearch}
        />
        <List
          dataFlow={dataFlow}
          onUpdate={this.onUpdate}
          onCreate={this.onCreate}
          onGenerate={this.onGenerate}
          onSwitch={this.onSwitch}
          onSearch={this.onSearch}
         />
      </Fragment>
    )
  }
}

CDKeys.propTypes = {
  cdkey: PropTypes.object,
  globals: PropTypes.object,
  login: PropTypes.object,
  fetchCDKeys: PropTypes.func,
  updateCDKey: PropTypes.func,
  createCDKey: PropTypes.func,
  generateCDKey: PropTypes.func,
  switchActivity: PropTypes.func,
  keepGlobals: PropTypes.func,
  fetchGlobalProducts: PropTypes.func,
  fetchGlobalItems: PropTypes.func,
  fetchGlobalGoods: PropTypes.func,
  fetchGlobalChannels: PropTypes.func
}
