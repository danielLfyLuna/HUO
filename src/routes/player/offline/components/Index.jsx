import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'

import Filter from './Filter'
import List from './List'
import { fetchProductsMap } from '../../../../base/modules/Products'
import {
  fetchOnline,
  receiveOnLine,
  kickoutActionCreator,
  keepKickout
} from '../modules/Module'

const mapDispatchtoProps = {
  fetchOnline,
  receiveOnLine,
  kickoutActionCreator,
  fetchProductsMap,
  keepKickout
}

const mapStateToProps = (state) => ({
  login: state.islogin,
  offline: state.offline,
  products: state.products,
})

@connect(mapStateToProps, mapDispatchtoProps)
export default class Offline extends Component {

  state = {
    fields: {
      products: {
        value: ['1']
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

  products = {
    value: []
  }

  // 双向数据绑定
  onChange = (changedFields) => {
    this.setState({
      fields: { ...this.state.fields, ...changedFields }
    })
  }

  // 搜索提交
  onSearch = (data) => {
    if (data.handle === 'SEARCH') {
      this.props.fetchOnline(data)
    }
  }

  render() {
    const {
      receiveOnLine,
      kickoutActionCreator
    } = this.props
    const { login, offline, products } = this.props
    let options = {
      login,
      offline,
      products,
    }
    let initials = this.state.initials

    return (
      <Fragment>
        <Filter
          options={options}
          {...this.state.fields}
          onChange={this.onChange}
          onSearch={this.onSearch}
        />
        <List
          options={options}
          initials={initials}
          products={this.products}
          handleUpdate={receiveOnLine}
          handleKickoutHead={kickoutActionCreator}
        />
      </Fragment>
    )
  }

  componentWillMount() {
    this.props.fetchProductsMap()
  }

  componentWillUnmount() {
    this.props.keepKickout(this.state.fields.products)
  }
}

Offline.propTypes = {
  login: PropTypes.object,
  offline: PropTypes.object,
  products: PropTypes.object,
  fetchOnline: PropTypes.func,
  receiveOnLine: PropTypes.func,
  kickoutActionCreator: PropTypes.func,
  fetchProductsMap: PropTypes.func,
  keepKickout: PropTypes.func
}
