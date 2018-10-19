import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Card } from 'antd'

import Filter from './Filter'
import List from './List'

export default class Index extends Component {
  state = {
    fields: {
      products: {}
    },
    initials: {
      products: {
      },
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
    this.props.fetchPlayers({
      path: {
        groupId: this.props.location.query.groupId
      }
    })
  }

  componentWillUnmount() {
    this.props.keepWelfare({
      route: this.props.route.path
    })
  }

  // 双向数据绑定
  onChange = (fieldsValue) => {
    this.setState({
      fields: { ...this.state.fields, ...fieldsValue }
    })
  }

  onCreate = (values) => {
    this.props.createPlayer(values)
  }

  onDelete = (values) => {
    this.props.deletePlayer(values)
  }

  onImport = (values) => {
    this.props.importPlayers(values)
  }

  onBatch = (values) => {
    this.props.batchPlayers(values)
  }

  onSearch = (values) => {
    if (values.handle === 'SEARCH') {
      this.props.fetchPlayers({
        path: {
          groupId: this.props.location.query.groupId
        }
      })
    } else if (values.handle === 'SYNCH') {
      this.props.fetchPurchaseSync(values)
    } else if (values.handle === 'BATCH') {
      this.props.fetchPurchases()
    }
  }

  render() {
    const { welfare, globals, login, location } = this.props
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
          onImport={this.onImport}
          onCreate={this.onCreate}
        />
        <List
          options={options}
          initials={initials}
          onSearch={this.onSearch}
          onCreate={this.onCreate}
          onDelete={this.onDelete}
          onBatch={this.onBatch}
        />
      </Card>
    )
  }
}

Index.propTypes = {
  welfare: PropTypes.object,
  login: PropTypes.object,
  route: PropTypes.object,
  location: PropTypes.object,
  globals: PropTypes.object,
  fetchPlayers: PropTypes.func,
  importPlayers: PropTypes.func,
  deletePlayer: PropTypes.func,
  createPlayer: PropTypes.func,
  batchPlayers: PropTypes.func,
  fetchProducts: PropTypes.func,
  keepWelfare: PropTypes.func,
  fetchPurchases: PropTypes.func,
  fetchPurchaseSync: PropTypes.func
}
