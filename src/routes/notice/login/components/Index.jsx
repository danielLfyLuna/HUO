import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'

import Filter from './Filter'
import List from './List'
import {
  keepGlobals,
  fetchGlobalProducts,
  fetchGlobalChannels
} from '../../../../base/modules/Global'
import {
  fetchLoginNotices,
  fetchLoginNotice,
  createLoginNotice,
  updateLoginNotice,
  deleteLoginNotice,
  openLoginNotice,
  orderLoginNotice
} from './../modules/Module'

const mapDispatchtoProps = {
  fetchLoginNotices,
  fetchLoginNotice,
  createLoginNotice,
  updateLoginNotice,
  deleteLoginNotice,
  openLoginNotice,
  orderLoginNotice,
  keepGlobals,
  fetchGlobalProducts,
  fetchGlobalChannels
}

const mapStateToProps = (state) => ({
  login: state.islogin,
  globals: state.globals,
  notice: state.notice
})

@connect(mapStateToProps, mapDispatchtoProps)
export default class LoginNotice extends Component {

  state = {
    fields: {
      products: {
        value: []
      },
      channels: {
        value: []
      },
      times: {
        value: []
      },
      open: {
        value: []
      }
    },
    initials: {
      paths: {},
      params: {},
      conf: {
        openItems: { stop: 0, open: 1 }
      },
      map: {
        openItems: {
          0: '关',
          1: '开',
        }
      },
      enum: {
        openItems: [
          { label: '关(0)', value: 0 },
          { label: '开(1)', value: 1 },
        ]
      }
    }
  }

  componentWillMount() {
    this.props.fetchGlobalProducts()
    this.props.fetchGlobalChannels()

    const { globals } = this.props
    const products = globals.keeping.notice && globals.keeping.notice.products
    if (products && products.value && products.value.length) {
      this.setState({
        fields: {
          ...this.state.fields,
          products
        }
      })
    }
  }

  componentWillReceiveProps(nextProps) {
    const create = nextProps.notice.login.create
    if (create.id) {
      this.setState({
        fields: {
          ...this.state.fields,
          products: {
            value: [create.productId]
          }
        }
      })
    }
  }

  onChange = (changedFields) => {
    this.setState({
      fields: { ...this.state.fields, ...changedFields }
    })
  }

  onSearch = (values) => {
    if (values.handle === 'SEARCH') {
      this.props.fetchLoginNotices(values)
      this.props.keepGlobals({
        notice: {
          ...this.state.fields
        }
      })
    } else if (values.handle === 'ONE') {
      this.props.fetchLoginNotice(values)
    }
  }

  onCreate = (fields) => {
    this.props.createLoginNotice(fields)
  }

  onUpdate = (fields) => {
    this.props.updateLoginNotice(fields)
  }

  onDelete = (fields) => {
    this.props.deleteLoginNotice(fields)
  }

  onOpen = (fields) => {
    this.props.openLoginNotice(fields)
  }

  onOrder = (fields) => {
    this.props.orderLoginNotice(fields)
  }

  _productFormat = (products) => products.map(val => ({
    value: val.value, label: val.label
  }))

  _channelsFormat = (channels) => Object.entries(channels).map(val => ({
    label: val[1], value: val[0]
  }))

  render() {
    const { globals, login, notice } = this.props

    const dataFlow = {
      initials: this.state.initials,
      options: {
        globals,
        login,
        notice,
        products: this._productFormat(globals.products),
        channels: this._channelsFormat(globals.channels)
      }
    }
    return (
      <Fragment>
        <Filter
          dataFlow={dataFlow}
          {...this.state.fields}
          onChange={this.onChange}
          onSearch={this.onSearch}
          onCreate={this.onCreate}
        />
        <List
          dataFlow={dataFlow}
          onDelete={this.onDelete}
          onUpdate={this.onUpdate}
          onOpen={this.onOpen}
          onOrder={this.onOrder}
        />
      </Fragment>
    )
  }
}

LoginNotice.propTypes = {
  login: PropTypes.object,
  globals: PropTypes.object,
  notice: PropTypes.object,
  fetchLoginNotices: PropTypes.func,
  fetchLoginNotice: PropTypes.func,
  createLoginNotice: PropTypes.func,
  updateLoginNotice: PropTypes.func,
  deleteLoginNotice: PropTypes.func,
  openLoginNotice: PropTypes.func,
  orderLoginNotice: PropTypes.func,
  keepGlobals: PropTypes.func,
  fetchGlobalProducts: PropTypes.func,
  fetchGlobalChannels: PropTypes.func,
}
