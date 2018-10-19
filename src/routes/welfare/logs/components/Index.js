import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Card } from 'antd'

import Filter from './Filter'
import List from './List'

export default class Index extends Component {
  state = {
    fields: {
      products: {
        value: []
      },
      groupId: {
        value: ''
      },
      playerId: {
        value: ''
      }
    },
    initials: {
      conf: {
      },
      map: {
      },
      enum: {
      }
    }
  }

  componentWillMount() {
    this.props.fetchProducts()
    this.props.fetchPurchases()
    const { location } = this.props
    if (location.query.playerId) {
      this.props.fetchBatchPlayers({
        path: {
          productId: location.query.productId,
          serverId: location.query.serverId
        },
        params: {
          groupId: location.query.groupId,
          playerId: location.query.playerId
        }
      })
    }
  }

  componentWillUnmount() {
    this.onClear()
  }

  // 双向数据绑定
  onChange = (fieldsValue) => {
    this.setState({
      fields: { ...this.state.fields, ...fieldsValue }
    })
  }

  onSearch = (values) => {
    if (values.handle === 'LOGS') {
      this.props.fetchBatchPlayers(values)
    }
  }

  onClear = () => {
    this.props.clearPlayerLogs()
  }

  onKeep = (values) => {
    this.props.keepWelfare(values)
  }

  render() {
    const { welfare, globals, login, location, route } = this.props
    const initials = this.state.initials
    let purchases = {}
    globals.purchases.map(v => {
      purchases[v.rechargeId] = v.rechargeName
    })
    const options = {
      welfare,
      login,
      globals,
      location,
      route,
      purchases: {...purchases},
      authorize: login.authorize
    }

    return (
      <Card style={{marginBottom: 6}}>
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
          onKeep={this.onKeep}
          onClear={this.onClear}
        />
      </Card>
    )
  }
}

Index.propTypes = {
  welfare: PropTypes.object,
  globals: PropTypes.object,
  login: PropTypes.object,
  location: PropTypes.object,
  route: PropTypes.object,
  fetchBatchPlayers: PropTypes.func,
  clearPlayerLogs: PropTypes.func,
  keepWelfare: PropTypes.func,
  fetchProducts: PropTypes.func,
  fetchPurchases: PropTypes.func
}
