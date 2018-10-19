import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import _ from 'lodash'

import Filter from './Filter'
import List from './List'

import {
  keepGlobals,
  fetchGlobalPlayers,
  fetchGlobalProducts
} from '../../../../base/modules/Global'
import {
  sendRecharge,
  fetchRechargeMap,
  fetchRechargeLog,
  sendMonthCard
} from '../modules/Module'

const mapDispatchtoProps = {
  keepGlobals,
  fetchGlobalPlayers,
  fetchGlobalProducts,
  sendRecharge,
  fetchRechargeMap,
  fetchRechargeLog,
  sendMonthCard
}

const mapStateToProps = (state) => ({
  pay: state.pay,
  globals: state.globals,
  login: state.islogin
})

@connect(mapStateToProps, mapDispatchtoProps)
export default class Recharge extends Component {
  state = {
    fields: {
      products: {
        value: []
      },
      nickname: {
        value: ''
      },
      playerId: {
        value: ''
      },
    },
    initials: {
      paths: {},
      params: {},
      conf: {
        locale: false,
        route: 'index',
        timeUnits: { 'second': 1, 'minute': 2, 'hour': 3, 'day': 4, 'lasting': 5 }
      },
      map: {
        jobTypes: { 1: '战士', 2: '射手', 3: '法师' },
        genderTypes: { 0: '女', 1: '男' }
      },
      enum: {}
    }
  }

  componentWillMount() {
    this.props.fetchGlobalProducts()
    const { globals } = this.props
    const products = globals.keeping.pay && globals.keeping.pay.products
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
    const nextPayment = nextProps.pay.payment
    const thisPayment = this.props.pay.payment
    if (nextPayment.msg === 'OK' && nextPayment.msg !== thisPayment.msg) {
      // this.state.initials.conf.renderState = false
      this.props.fetchGlobalPlayers({
        path: this.state.initials.paths,
        params: this.state.initials.params
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
      this.setState({
        initials: {
          ...this.state.initials,
          paths: {...values.path},
          params: {...values.params}
        }
      })
      this.props.keepGlobals({
        pay: {
          ...this.state.fields
        }
      })
      this.props.fetchGlobalPlayers(values)
      this.props.fetchRechargeMap(values)
      this.state.initials.conf.locale = true
    }
  }

  onRecharge = (values) => {
    this.props.sendRecharge(values)
  }

  onSendMonthCard = (values) => {
    this.props.sendMonthCard(values)
  }

  render() {
    const { pay, globals, login } = this.props
    const options = {
      pay,
      globals,
      login,
      authorize: login.authorize,
      purchases: _.map(pay.remaps, (val, idx) => ({ value: idx, label: `${val}-(${idx})` }))
    }
    const initials = this.state.initials

    return (
      <div>
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
            onRecharge={this.onRecharge}
            onSendMonthCard={this.onSendMonthCard}
          />
        </Fragment>
      </div>
    )
  }
}

Recharge.propTypes = {
  pay: PropTypes.object,
  login: PropTypes.object,
  globals: PropTypes.object,
  keepGlobals: PropTypes.func,
  fetchGlobalPlayers: PropTypes.func,
  fetchGlobalProducts: PropTypes.func,
  fetchRechargeMap: PropTypes.func,
  sendRecharge: PropTypes.func,
  sendMonthCard: PropTypes.func,
}
