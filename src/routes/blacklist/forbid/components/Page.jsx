import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import _ from 'lodash'

import Filter from './Filter'
import List from './List'

import { fetchProductsMap } from '../../../../base/modules/Products'
import { fetchPlayers, clearPlayers } from '../../../../base/modules/Players'
import { addBlacklist, removeBlacklist, keepBlacklist } from '../../forgive/modules/Module'

const mapDispatchtoProps = {
  addBlacklist,
  keepBlacklist,
  fetchPlayers,
  clearPlayers,
  removeBlacklist,
  fetchProductsMap
}

const mapStateToProps = (state) => ({
  login: state.islogin,
  players: state.players,
  products: state.products,
  blacklist: state.blacklist,
})

@connect(mapStateToProps, mapDispatchtoProps)
export default class Page extends Component {

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
        timeUnits: { 'second': 1, 'minute': 2, 'hour': 3, 'day': 4, 'lasting': 5 }
      },
      map: {
        forbidTypes: { 1: '禁言', 2: '禁用拍卖行', 3: '封号' },
        timeUnits: { 1: '秒', 2: '分钟', 3: '小时', 4: '天', 5: '永久' },
        jobTypes: { 1: '战士', 2: '射手', 3: '法师' },
        genderTypes: { 0: '女', 1: '男' }
      },
      enum: {
        timeUnits: [
          { label: '秒', value: 1 },
          { label: '分钟', value: 2 },
          { label: '小时', value: 3 },
          { label: '天', value: 4 },
          { label: '永久', value: 5 }
        ],
        forbidTypes: [
          { label: '禁言', value: 1 },
          { label: '禁用拍卖行', value: 2 },
          { label: '封号', value: 3 }
        ]
      }
    }
  }

  componentWillMount() {
    this.props.fetchProductsMap()
    this.props.clearPlayers()
    const { blacklist } = this.props
    this.setState({
      fields: {
        ...this.state.fields,
        ...blacklist.keeping.forbid
      }
    })
  }

  componentWillUnmount() {
    this.props.keepBlacklist({
      forbid: { ...this.state.fields }
    })
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
          products: fields.path,
          params: fields.params
        }
      })
      this.props.fetchPlayers(fields)
      this.state.initials.conf.locale = true
    }
  }

  onForbid = (values) => {
    this.props.addBlacklist(values)
  }

  onSwitch = (values) => {
    this.props.removeBlacklist({
      ...values,
      path: {...this.state.initials.products}
    })
  }

  _productReduce = (options) => {
    return _.reduce(options, (result, option) => {
      result.push({ value: option.value, label: option.label })
      return result
    }, [])
  }

  render() {
    const { blacklist, players, products, login } = this.props

    let options = {
      login,
      players,
      blacklist,
      products: {
        list: products.options
      },
    }
    let initials = this.state.initials
    let fields = this.state.fields

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
          fields={fields}
          options={options}
          initials={initials}
          onSwitch={this.onSwitch}
          onForbid={this.onForbid}
        />
      </Fragment>
    )
  }

}

Page.propTypes = {
  login: PropTypes.object,
  players: PropTypes.object,
  products: PropTypes.object,
  blacklist: PropTypes.object,
  fetchPlayers: PropTypes.func,
  clearPlayers: PropTypes.func,
  fetchProductsMap: PropTypes.func,
  addBlacklist: PropTypes.func,
  removeBlacklist: PropTypes.func,
  keepBlacklist: PropTypes.func
}
