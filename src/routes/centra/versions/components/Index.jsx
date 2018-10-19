import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import _map from 'lodash/map'

import Filter from './Filter'
import List from './List'

import {
  fetchGlobalProducts,
  fetchGlobalGroups,
  keepGlobals
} from '../../../../base/modules/Global'
import { fetchVersions, clearVersions, createVersion, updateVersion, deleteVersion } from '../modules/Module'

const mapDispatchtoProps = {
  fetchVersions,
  clearVersions,
  createVersion,
  updateVersion,
  deleteVersion,
  fetchGlobalProducts,
  fetchGlobalGroups,
  keepGlobals
}

const mapStateToProps = (state) => ({
  version: state.version,
  globals: state.globals,
  login: state.islogin
})

@connect(mapStateToProps, mapDispatchtoProps)
export default class Versions extends Component {
  state = {
    fields: {
      products: {
        value: []
      }
    },
    initials: {
      productId: 1
    }
  }

  onChange = (changedFields) => {
    this.setState({
      fields: { ...this.state.fields, ...changedFields }
    })
  }

  onSearch = (fields) => {
    if (fields.handle === 'SEARCH') {
      this.props.fetchVersions(fields)
      this.props.keepGlobals({
        centra: {
          products: {
            value: [...this.state.fields.products.value]
          }
        }
      })
    }
  }

  onClear = () => {
    this.props.clearVersions()
  }

  onCreate = (fields) => {
    this.props.createVersion(fields)
  }

  onUpdate = (fields) => {
    this.props.updateVersion(fields)
  }

  onDelete = (fields) => {
    this.props.deleteVersion(fields)
  }

  componentWillMount() {
    this.props.fetchGlobalProducts()
    this.props.fetchGlobalGroups()
    const { globals } = this.props
    const products = globals.keeping.centra && globals.keeping.centra.products
    if (products && products.value && products.value.length) {
      this.props.fetchVersions({
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
    const { version, globals, login } = this.props
    const options = {
      globals,
      version,
      login,
      products: _map(globals.products, (opt) => ({ label: `${opt.label}`, value: opt.value })),
      groups: _map(globals.groups, (val, key) => ({ label: `${val}(${key})`, value: key }))
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
          onClear={this.onClear}
        />
        <List
          options={options}
          initials={initials}
          onUpdate={this.onUpdate}
          onDelete={this.onDelete}
         />
      </Fragment>
    )
  }
}

Versions.propTypes = {
  login: PropTypes.object,
  globals: PropTypes.object,
  version: PropTypes.object,
  fetchVersions: PropTypes.func,
  clearVersions: PropTypes.func,
  createVersion: PropTypes.func,
  updateVersion: PropTypes.func,
  deleteVersion: PropTypes.func,
  fetchGlobalProducts: PropTypes.func,
  fetchGlobalGroups: PropTypes.func,
  keepGlobals: PropTypes.func,
}
