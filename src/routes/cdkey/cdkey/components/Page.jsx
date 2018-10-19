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
import { queryCDKey } from '../../cdkeys/modules/Module'

const mapDispatchtoProps = {
  queryCDKey,
  keepGlobals,
  fetchGlobalProducts,
  fetchGlobalItems,
  fetchGlobalGoods,
  fetchGlobalChannels
}

const mapStateToProps = (state) => ({
  cdkey: state.cdkey,
  globals: state.globals,
  login: state.islogin
})

@connect(mapStateToProps, mapDispatchtoProps)
export default class Page extends Component {
  state = {
    fields: {
      cdkey: {
        value: ''
      }
    },
    initials: {
      paths: {},
      conf: {
        itemTypes: { item: 0, skill: 4, role: 5 }
      },
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
        cdkeyState: { 0: '未领取', 1: '未领取', 2: '已领取' }
      }
    }
  }

  componentWillMount() {
    this.props.fetchGlobalProducts()
    this.props.fetchGlobalItems({
      path: {
        productId: '_',
        itemType: 0
      }
    })
  }

  // 双向数据绑定
  onChange = (fieldsValue) => {
    this.setState({
      fields: { ...this.state.fields, ...fieldsValue }
    })
  }

  onSearch = (fields) => {
    if (fields.handle === 'GET_ITEMS') {}
    else if (fields.handle === 'GET_CDKEY') {
      this.props.queryCDKey(fields)
      this.props.keepGlobals({
        cdkey: {
          ...this.state.fields
        }
      })
      this.setState({
        initials: {
          ...this.state.initials,
          paths: fields.path
        }
      })
    }
  }

  render() {
    const { cdkey, globals, login } = this.props

    const dataFlow = {
      initials: this.state.initials,
      options: {
        cdkey,
        login,
        globals,
        products: globals.products.map(val => ({ label: val.label, value: val.value }))
      }
    }

    return (
      <Fragment>
        <Filter
          dataFlow={dataFlow}
          {...this.state.fields}
          onChange={this.onChange}
          onSearch={this.onSearch}
        />
        <List
          dataFlow={dataFlow}
        />
      </Fragment>
    )
  }

}

Page.propTypes = {
  login: PropTypes.object,
  cdkey: PropTypes.object,
  globals: PropTypes.object,
  queryCDKey: PropTypes.func,
  keepGlobals: PropTypes.func,
  fetchGlobalProducts: PropTypes.func,
  fetchGlobalItems: PropTypes.func
}
