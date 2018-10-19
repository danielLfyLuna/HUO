import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import _ from 'lodash'

import Filter from './Filter'
import List from './List'

import {
  keepGlobals,
  fetchGlobalGoods,
  fetchGlobalProducts
} from '../../../../base/modules/Global'
import {
  fetchTemplates,
  newCreateActivity,
  clearTemplateCreate
} from '../../activities/modules/Module'

const mapDispatchtoProps = {
  fetchTemplates,
  newCreateActivity,
  clearTemplateCreate,
  keepGlobals,
  fetchGlobalGoods,
  fetchGlobalProducts
}

const mapStateToProps = (state) => ({
  activity: state.activity,
  globals: state.globals,
  login: state.islogin
})

@connect(mapStateToProps, mapDispatchtoProps)
export default class Page extends Component {
  state = {
    fields: {
      products: {
        value: ['', '']
      }
    },
    initials: {
      paths: {},
      conf: {
        openTypes: { 1001: 'fixed', 1002: 'after' }
      },
      map: {
        goodTypes: { 0: '道具', 4: '技能', 5: '武将' }
      },
      enum: {
        openTypes: [
          { label: '固定时间 (startTime, endTime)', value: 1001 },
          { label: '开服后天数 (afterDays  lastDays)', value: 1002 }
        ]
      }
    }
  }

  componentWillMount() {
    this.props.fetchGlobalProducts()

    const { globals } = this.props
    const products = globals.keeping.activity && globals.keeping.activity.products
    if (products && products.value && products.value.length) {
      this.props.fetchTemplates({
        path: {
          productId: products.value[0],
          serverId: products.value[1]
        }
      })
      this.setState({
        fields: {
          ...this.state.fields,
          products
        }
      })
    }
  }

  // 双向数据绑定
  onChange = (fieldsValue) => {
    this.setState({
      fields: { ...this.state.fields, ...fieldsValue }
    })
  }

  onCreate = (values) => {
    this.props.newCreateActivity(values)
  }

  onClear = () => {
    this.props.clearTemplateCreate()
  }

  onSearch = (values) => {
    if (values.handle === 'SEARCH') {
      this.setState({
        initials: {
          ...this.state.initials,
          paths: values.path
        }
      })
      this.props.keepGlobals({
        activity: {
          ...this.state.fields
        }
      })
      this.props.fetchTemplates(values)
      this.props.fetchGlobalGoods(values)
    }
  }

  _productReduce = (options) => {
    return _.reduce(options, (result, option) => {
      result.push({ value: option.value, label: option.label })
      return result
    }, [])
  }

  _serverReduce = (options, productId) => {
    return _.reduce(options, (result, option) => {
      if (option.value === productId) {
        result = _.reduce(option.children, (res, opt) => {
          res.push({ value: opt.value, label: opt.label })
          return res
        }, [])
      }
      return result
    }, [])
  }

  _serverFormat = (products, productId) => {
    const servers = products.filter(o => o.value == productId).map(v => v.children)
    return Object.values(servers)
  }

  _goodFormat = (goods, types) => {
    return Object.entries(goods).map((val) => ({
      value: val[0],
      label: types[val[0]],
      children: Object.entries(val[1]).map(v => ({
        value: v[0],
        label: v[1]
      }))
    }))
  }

  _goodReduce = (options, types) => {
    let goods = []
    _.reduce(options, (result, option, index) => {
      let gds = []
      _.reduce(option, (res, opt, idx) => {
        res.push({ value: Number(idx), label: `${opt} (${idx})` })
        return res
      }, gds)
      result.push({ value: Number(index), label: `${types[index]} (${index})`, children: gds })
      return result
    }, goods)
    return goods
  }

  render() {
    const { activity, globals, login } = this.props

    const dataFlow = {
      initials: this.state.initials,
      options: {
        login,
        globals,
        activity,
        products: globals.products.map(v => ({ label: v.label, value: v.value })),
        servers: this._serverFormat(globals.products, this.state.fields.products.value[0]),
        goods: this._goodFormat(globals.goods, this.state.initials.map.goodTypes)
      }
    }
    
    return (
      <Fragment>
        <Filter
          dataFlow={dataFlow}
          {...this.state.fields}
          onChange={this.onChange}
          onSearch={this.onSearch}
        />
        <List
          dataFlow={dataFlow}
          onCreate={this.onCreate}
          onClear={this.onClear}
        />
      </Fragment>
    )
  }
}

Page.propTypes = {
  login: PropTypes.object,
  activity: PropTypes.object,
  globals: PropTypes.object,
  fetchTemplates: PropTypes.func,
  newCreateActivity: PropTypes.func,
  clearTemplateCreate: PropTypes.func,
  keepGlobals: PropTypes.func,
  fetchGlobalGoods: PropTypes.func,
  fetchGlobalProducts: PropTypes.func,
}
