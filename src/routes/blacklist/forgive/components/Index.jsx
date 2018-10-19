import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'

import Filter from './Filter'
import List from './List'
import { fetchProductsMap } from '../../../../base/modules/Products'
import {
  fetchBlacklist,
  clearBlacklist,
  removeBlacklist,
  keepBlacklist
} from '../modules/Module'

const mapDispatchtoProps = {
  fetchBlacklist,
  clearBlacklist,
  removeBlacklist,
  keepBlacklist,
  fetchProductsMap
}

const mapStateToProps = (state) => ({
  blacklist: state.blacklist,
  products: state.products,
  login: state.islogin
})

@connect(mapStateToProps, mapDispatchtoProps)
export default class Blacklist extends Component {
  state = {
    fields: {
      products: {
        value: ['1', 'test_001']
      },
      nickname: {
        value: ''
      },
      playerId: {
        value: ''
      }
    },
    initials: {
      products: {
        productId: '',
        serverId: ''
      },
      params: {
        nickname: '',
        playerId: ''
      },
      conf: {
        locale: false,
        route: 'index',
        timeUnits: { 'second': 1, 'minute': 2, 'hour': 3, 'day': 4, 'lasting': 5 }
      },
      map: {
        forbidTypes: { 1: '禁言', 2: '禁用拍卖行', 3: '封号' },
        timeUnits: { 1: '秒', 2: '分钟', 3: '小时', 4: '天', 5: '永久' }
      },
      enum: {}
    }
  }

  componentWillMount() {
    this.props.fetchProductsMap()
    this.props.clearBlacklist()
    const { blacklist } = this.props
    this.setState({
      initials: {
        ...this.state.initials,
        ...blacklist.keeping.index
      }
    })
  }

  componentWillUnmount() {
    this.props.keepBlacklist({
      index: {
        products: {...this.state.initials.products},
        params: {...this.state.initials.params}
      }
    })
  }

  onChange = (changedFields) => {
    this.setState({
      fields: { ...this.state.fields, ...changedFields }
    })
  }

  onSearch = (values) => {
    if (values.handle === 'SEARCH') {
      this.setState({
        initials: {
          ...this.state.initials,
          products: {...values.path},
          params: {...values.params}
        }
      })
      this.props.fetchBlacklist(values)
      this.state.initials.conf.locale = true
    }
  }

  onSwitch = (values) => {
    this.props.removeBlacklist({
      ...values,
      path: {...this.state.initials.products}
    })
  }


  render() {
    const { blacklist, products, login } = this.props
    let options = {
      blacklist,
      login,
      products: {
        list: products.options
      }
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
          onSwitch={this.onSwitch}
        />
      </Fragment>
    )
  }
}

Blacklist.propTypes = {
  login: PropTypes.object,
  products: PropTypes.object,
  blacklist: PropTypes.object,
  fetchBlacklist: PropTypes.func,
  clearBlacklist: PropTypes.func,
  fetchProductsMap: PropTypes.func,
  removeBlacklist: PropTypes.func,
  keepBlacklist: PropTypes.func
}
