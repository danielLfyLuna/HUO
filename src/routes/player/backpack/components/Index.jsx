import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'

import Filter from './Filter'
import List from './List'
import { fetchProductsMap } from '../../../../base/modules/Products'
import {
  fetchBaseInfo,
  fetchBackItems,
} from '../modules/Module'

const mapDispatchtoProps = {
  fetchBaseInfo,
  fetchBackItems,
  fetchProductsMap
}

const mapStateToProps = (state) => ({
  login: state.islogin,
  backpack: state.backpack,
  products: state.products.options,
})

@connect(mapStateToProps, mapDispatchtoProps)
export default class Backpack extends Component {

  state = {
    fields: {
      products: {
        value: []
      },
      nickname: {
        value: ''
      },
      playerId: {
        value: ''
      }
    },
    initials: {
      params: {},
      conf: {},
      map: {
        gender: { 0: '女', 1: '男' },
        job: { 1: '战士', 2: '射手', 3: '法师' },
        online: { 0: '离线', 1: '在线' }
      },
      enum: {}
    }
  }

  componentWillMount() {
    this.props.fetchProductsMap()
  }

  // 双向数据绑定
  onChange = (changedFields) => {
    this.setState({
      fields: { ...this.state.fields, ...changedFields }
    })
  }

  // 搜索提交
  onSearch = (values) => {
    if (values.handle === 'SEARCH') {
      this.props.fetchBaseInfo(values)
    } else if (['ITEM', 'DOWN'].includes(values.handle)) {
      this.props.fetchBackItems(values)
    }
  }

  render() {
    const { login, backpack, products } = this.props
    let options = {
      login,
      backpack,
      products,
    }
    let initials = this.state.initials

    return (
      <Fragment>
        <Filter
          options={options}
          initials={initials}
          {...this.state.fields}
          onChange={this.onChange}
          onSearch={this.onSearch}
        />
        <List
          options={options}
          initials={initials}
          params={this.state.fields}
          onSearch={this.onSearch}
        />
      </Fragment>
    )
  }
}

Backpack.propTypes = {
  login: PropTypes.object,
  backpack: PropTypes.object,
  products: PropTypes.object,
  fetchBaseInfo: PropTypes.func,
  fetchBackItems: PropTypes.func,
  fetchProductsMap: PropTypes.func
}
