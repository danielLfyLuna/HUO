import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import _ from 'lodash'

import Filter from './Filter'
import List from './List'

import {
  fetchGlobalProducts,
  fetchGlobalGroups,
  keepGlobals
} from '../../../../base/modules/Global'
import {
  fetchServers,
  clearServers,
  createServer,
  updateServer,
  switchServers
} from '../modules/Module'

const mapDispatchtoProps = {
  fetchServers,
  clearServers,
  createServer,
  updateServer,
  switchServers,
  fetchGlobalProducts,
  fetchGlobalGroups,
  keepGlobals
}

const mapStateToProps = (state) => ({
  server: state.server,
  globals: state.globals,
  login: state.islogin
})

@connect(mapStateToProps, mapDispatchtoProps)
export default class Servers extends Component {
  state = {
    fields: {
      products: {
        value: [ ]
      },
      status: {
        value: []
      }
    },
    initials: {
      path: {
        productId: 1
      },
      conf: {
        renderState: true,
        status: { 1: '正常状态', 2: '维护状态', 3: '不可用状态' }
      },
      map: {
        status: { 1: '正常', 2: '维护', 3: '不可用' },
        recommendTypes: { 1: '不推荐', 2: '推荐' },
        hotTypes: { 1: '新服', 2: '满', 3: '爆满' },
        serverStatus: { 1: '正常', 2: '维护', 3: '不可用', 4: '初置阶段', 5: '部署完成', 6: '测试' }
      },
      enum: {
        status: [
          { label: '正常', value: 1 },
          { label: '维护', value: 2 },
          { label: '不可用', value: 3 }
        ],
        hotTypes: [
          { label: '新服', value: 1 },
          { label: '满', value: 2 },
          { label: '爆满', value: 3 }
        ],
        recommendTypes: [
          { label: '不推荐', value: 1 },
          { label: '推荐', value: 2 }
        ],
        serverStatus: [
          { label: '正常', value: 1 },
          { label: '维护', value: 2 },
          { label: '不可用', value: 3 },
          { label: '初置阶段', value: 4 },
          { label: '部署完成', value: 5 },
          { label: '测试', value: 6 },
        ]
      }
    }
  }

  onChange = (changedFields) => {
    this.setState({
      fields: { ...this.state.fields, ...changedFields }
    })
  }

  onSearch = (fields) => {
    this.props.fetchServers(fields)
    this.props.keepGlobals({
      centra: {
        products: {
          value: [...this.state.fields.products.value]
        }
      }
    })
  }

  onClear = () => {
    this.props.clearServers()
  }

  onCreate = (fields) => {
    this.props.createServer(fields)
  }

  onUpdate = (fields) => {
    this.props.updateServer(fields)
  }

  onSwitch = (fields) => {
    this.props.switchServers(fields)
  }

  _productFormat = (products) => products.map(pd => ({
    label: pd.label,
    value: pd.value
  }))

  _serverFormat = (servers) => {
    const status = _.uniq(_.map(servers, 'status'))
    const statusMap = { 1: '正常状态', 2: '维护状态', 3: '不可用状态' }
    return status.map(st => ({
      label: statusMap[st],
      value: String(st),
      key: String(st),
      children: servers.filter(se => se.status === st).map(sv => ({
        label: `${sv.serverName}-(${sv.serverId})-(${statusMap[st]})`,
        value: sv.serverId,
        key: sv.serverId
      }))
    }))
  }

  _groupFormat = (groups) => Object.entries(groups).map(gp => ({
    label: `${gp[1]}(${gp[0]})`,
    value: gp[0]
  }))

  componentWillMount() {
    this.props.fetchGlobalProducts()
    this.props.fetchGlobalGroups()
    const { globals } = this.props
    const products = globals.keeping.centra && globals.keeping.centra.products
    if (products && products.value && products.value.length) {
      this.props.fetchServers({
        path: {
          productId: products.value[0]
        }
      })
      this.setState({
        fields: {
          ...this.state.fields,
          products: {
            value: [...products.value]
          }
        }
      })
    }
  }

  render() {
    const { server, globals, login } = this.props
    const options = {
      server,
      login,
      globals,
      list: {
        product: this._productFormat(globals.products)
      },
      servers: this._serverFormat(server.list),
      groups: this._groupFormat(globals.groups)
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
          onCreate={this.onCreate}
          onSwitch={this.onSwitch}
          onClear={this.onClear}
        />
        <List
          options={options}
          initials={initials}
          onUpdate={this.onUpdate}
         />
      </Fragment>
    )
  }
}

Servers.propTypes = {
  login: PropTypes.object,
  globals: PropTypes.object,
  server: PropTypes.object,
  fetchServers: PropTypes.func,
  clearServers: PropTypes.func,
  createServer: PropTypes.func,
  updateServer: PropTypes.func,
  switchServers: PropTypes.func,
  fetchGlobalProducts: PropTypes.func,
  fetchGlobalGroups: PropTypes.func,
  keepGlobals: PropTypes.func,
}
