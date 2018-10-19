import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Card } from 'antd'
import moment from 'moment'
import _ from 'lodash'

import Filter from './Filter'
import List from './List'

export default class Groups extends Component {
  state = {
    fields: {},
    initials: {
      conf: {
        renderState: true,
        locale: false
      },
      map: {
        groupTypes: { 1: '每天', 7: '每周', 30: '每月' },
        runDays: {
          1: ['', '每天'],
          7: ['', ...moment.weekdaysShort()],
          30: ['', ..._.range(1, moment().daysInMonth() + 1).map(v => v + '日')]
        },
        openStates: { 0: '关闭', 1: '开启' }
      },
      enum: {
        groupTypes: [
          { value: 1, label: '每天' },
          { value: 7, label: '每周' },
          { value: 30, label: '每月' }
        ]
      }
    }
  }

  componentWillMount() {
    this.props.fetchGroups()
  }

  componentWillUnmount() {
    this.props.keepWelfare({
      route: this.props.route.path
    })
  }

  onSearch = (values) => {
    if (values.handle === 'SEARCH') {
      this.props.fetchGroups()
    } else if (values.handle === 'PLAYER') {
      this.props.fetchPurchases()
    } else if (values.handle === 'REWARD_SYNC') {
      this.props.fetchPurchaseSync(values)
    } else if (values.handle === 'PRODUCTS') {
      this.props.fetchProducts()
    }
  }

  onCreate = (values) => {
    this.props.createGroup(values)
  }

  onUpdate = (values) => {
    this.props.updateGroup(values)
  }

  onDelete = (values) => {
    if (values.handle === 'PLAYER') {
      this.props.deletePlayer(values)
    }
  }

  onBatch = (values) => {
    if (values.handle === 'PLAYER') {
      this.props.batchPlayers(values)
    }
  }

  onImport = (values) => {
    if (values.handle === 'PLAYER') {
      this.props.importPlayers(values)
    }
  }

  render() {
    const { welfare, login, globals } = this.props
    const options = {
      welfare,
      login,
      globals,
      authorize: login.authorize
    }
    const initials = this.state.initials

    return (
      <div>
        <Card style={{ marginBottom: 6 }}>
          <Filter
            options={options}
            initials={initials}
            onSearch={this.onSearch}
            onCreate={this.onCreate}
          />
          <List
            options={options}
            initials={initials}
            onUpdate={this.onUpdate}
            onDelete={this.onDelete}
            onSearch={this.onSearch}
            onBatch={this.onBatch}
            onImport={this.onImport}
          />
        </Card>
      </div>
    )
  }
}

Groups.propTypes = {
  welfare: PropTypes.object.isRequired,
  login: PropTypes.object,
  route: PropTypes.object,
  globals: PropTypes.object,
  fetchGroups: PropTypes.func,
  createGroup: PropTypes.func,
  updateGroup: PropTypes.func,
  deletePlayer: PropTypes.func,
  batchPlayers: PropTypes.func,
  fetchPurchases: PropTypes.func,
  fetchPurchaseSync: PropTypes.func,
  fetchProducts: PropTypes.func,
  importPlayers: PropTypes.func,
  keepWelfare: PropTypes.func
}
