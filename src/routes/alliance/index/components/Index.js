import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'

import Filter from './Filter'
import List from './List'

export default class Alliance extends Component {
  state = {
    fields: {
      products: {}
    },
    initials: {
      products: {
        productId: '',
        serverId: ''
      },
      conf: {
        locale: false,
        route: 'index',
        timeUnits: { 'second': 1, 'minute': 2, 'hour': 3, 'day': 4, 'lasting': 5 }
      },
      map: {
        forbidTypes: { 1: '禁言', 2: '禁用拍卖行', 3: '封号' },
        timeUnits: { 1: '秒', 2: '分钟', 3: '小时', 4: '天', 5: '永久' },
        office: { 1: '盟主', 2: '副盟主', 3: '官员', 4: '成员', 5: '见习' }
      },
      enum: {}
    }
  }

  componentWillMount() {
    this.props.fetchProductsMap()
    const { alliance } = this.props
    this.setState({
      initials: {
        ...this.state.initials,
        ...alliance.keeping.index
      }
    })
  }

  componentWillUnmount() {
    this.props.keepAlliance({
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
          products: {...values.path}
        }
      })
      this.props.fetchAlliances(values)
      this.state.initials.conf.locale = true
    }
  }

  render() {
    const { alliance, products, login } = this.props
    const options = {
      alliance,
      login,
      authorize: login.authorize,
      products: {
        list: products.options
      }
    }
    const initials = this.state.initials
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
        />
      </Fragment>
    )
  }
}

Alliance.propTypes = {
  alliance: PropTypes.object.isRequired,
  products: PropTypes.object,
  login: PropTypes.object,
  fetchAlliances: PropTypes.func,
  fetchProductsMap: PropTypes.func,
  keepAlliance: PropTypes.func
}
