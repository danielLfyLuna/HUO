import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Card } from 'antd'
import _ from 'lodash'

import Filter from './Filter'
import List from './List'

export default class Page extends Component {

  state = {
    fields: {
      products: {}
    },
    initials: {
      products: {
        productId: ''
      },
      conf: {
        locale: false
      },
      map: {
        orderStatus: { 0: '失败', 1: '成功' }
      },
      enum: {
      }
    }
  }

  componentWillMount() {
    this.props.fetchProductsMap()
    const { recharge } = this.props
    this.setState({
      initials: {
        ...this.state.initials,
        ...recharge.keeping.rates
      }
    })
  }

  componentWillUnmount() {
    this.props.keepRecharge({
      rates: {
        products: {...this.state.initials.products}
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
    if (fields.handle === 'SEARCH') {
      this.setState({
        initials: {
          ...this.state.initials,
          products: fields.path
        }
      })
      this.props.fetchRates(fields)
      this.state.initials.conf.locale = true
    }
  }

  onCreate = (values) => {
    this.props.createRate(values)
  }

  onDelete = (values) => {
    this.props.deleteRate(values)
  }

  _productReduce = (options) => {
    return _.reduce(options, (result, option) => {
      result.push({ value: option.value, label: option.label })
      return result
    }, [])
  }

  render() {
    const { recharge, products, login } = this.props
    const options = {
      recharge,
      login,
      products: {
        list: this._productReduce(products.options)
      }
    }
    const initials = this.state.initials

    return (
      <Card style={{marginBottom: 6}}>
        <Filter
          options={options}
          initials={initials}
          {...this.state.fields}
          onChange={this.onChange}
          onSearch={this.onSearch}
          onCreate={this.onCreate}
        />
        <List
          options={options}
          initials={initials}
          onDelete={this.onDelete}
        />
      </Card>
    )
  }

}

Page.propTypes = {
  recharge: PropTypes.object,
  products: PropTypes.object,
  login: PropTypes.object,
  fetchRates: PropTypes.func,
  fetchProductsMap: PropTypes.func,
  createRate: PropTypes.func,
  deleteRate: PropTypes.func,
  keepRecharge: PropTypes.func
}
