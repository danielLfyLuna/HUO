import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import moment from 'moment'

import Filter from './Filter'
import List from './List'

import {
  keepGlobals,
  fetchGlobalProducts
} from '../../../../base/modules/Global'
import {
  fetchOrders,
  orderExport,
  orderRepair
} from '../../recharge/modules/Module'

const mapDispatchtoProps = {
  fetchOrders,
  orderExport,
  orderRepair,
  keepGlobals,
  fetchGlobalProducts
}

const mapStateToProps = (state) => ({
  pay: state.pay,
  globals: state.globals,
  login: state.islogin
})

@connect(mapStateToProps, mapDispatchtoProps)
export default class Page extends Component {

  state = {
    fields: {
      products: {
        value: []
      },
      times: {
        value: [moment(), moment()]
      },
      nickname: {
        value: ''
      },
      playerId: {
        value: ''
      },
      orderId: {
        value: ''
      },
      platformId: {
        value: ''
      }
    },
    initials: {
      paths: {},
      params: {},
      conf: {
        locale: false
      },
      map: {
        orderStatus: { 0: '失败', 1: '成功' }
      },
      enum: {}
    }
  }

  componentWillMount() {
    this.props.fetchGlobalProducts()
    const { globals } = this.props
    const { products = {} } = globals.keeping.pay || {}
    if (
      products &&
      products.value &&
      products.value.length
    ) {
      this.setState({
        fields: {
          ...this.state.fields,
          products
        }
      })
    }
  }

  componentWillReceiveProps(nextProps) {
    const nextRepair = nextProps.pay.repair
    const thisRepair = this.props.pay.repair
    if (nextRepair.msg && nextRepair.msg.includes('补单成功') && nextRepair.msg !== thisRepair.msg) {
      this.props.fetchOrders({
        path: this.state.initials.products,
        params: this.state.initials.params
      })
    }
  }

  // 双向数据绑定
  onChange = (fieldsValue) => {
    this.setState({
      fields: { ...this.state.fields, ...fieldsValue }
    })
  }

  onSearch = (fields) => {
    if (fields.handle === 'SEARCH') {
      this.setState({
        initials: {
          ...this.state.initials,
          paths: fields.path,
          params: fields.params
        }
      })
      this.props.keepGlobals({
        pay: {
          ...this.state.fields
        }
      })
      this.props.fetchOrders(fields)
      this.state.initials.conf.locale = true
    }
  }

  onExport = (values) => {
    this.props.orderExport(values)
  }

  onRepair = (values) => {
    this.props.orderRepair(values)
  }

  render() {
    const { pay, globals, login } = this.props
    const options = {
      pay,
      globals,
      login,
      authorize: login.authorize
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
          onExport={this.onExport}
          onRepair={this.onRepair}
        />
        <List
          options={options}
          initials={initials}
        />
      </Fragment>
    )
  }
}

Page.propTypes = {
  pay: PropTypes.object,
  globals: PropTypes.object,
  login: PropTypes.object,
  fetchOrders: PropTypes.func,
  orderExport: PropTypes.func,
  orderRepair: PropTypes.func,
  keepGlobals: PropTypes.func,
  fetchGlobalProducts: PropTypes.func,
}
