import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'

import Filter from './Filter'
import List from './List'

import {
  keepGlobals,
  fetchGlobalProducts
} from '../../../../base/modules/Global'

import {
  fetchGoodsMap
} from '../../../../base/modules/Goods'

import {
  fetchActivities,
  clearActivities,
  switchActivity,
  updateActivity,
} from '../modules/Module'

const mapDispatchtoProps = {
  fetchActivities,
  clearActivities,
  switchActivity,
  updateActivity,
  keepGlobals,
  fetchGlobalProducts,
  fetchGoodsMap
}

const mapStateToProps = (state) => ({
  activity: state.activity,
  globals: state.globals,
  goods: state.goods,
  login: state.islogin
})

@connect(mapStateToProps, mapDispatchtoProps)
export default class Activities extends Component {
  state = {
    fields: {
      products: {
        value: []
      }
    },
    initials: {
      paths: {},
      conf: {
        renderState: true
      },
      map: {
        cellStatus: { 1: '开启', 2: '开启', 3: '不可用', 4: '初置阶段', 5: '部署完成', 6: '测试' }
      },
      enum: {
        cellStatus: [
          { text: '开启', value: 3 },
          { text: '初置阶段', value: 4 },
          { text: '部署完成', value: 5 },
          { text: '测试', value: 6 }
        ],
        functionIds: [
          { label: '将领礼包(418)', value: 418 },
          { label: '限时团购礼包(422)', value: 422 },
          { label: '战备礼包(429)', value: 429 },
          { label: '超值锦囊(430)', value: 430 },
          { label: 'RMB坐骑礼包(433)', value: 433 }
        ]
      }
    }
  }

  componentWillMount() {
    this.props.fetchGlobalProducts()
    const { globals } = this.props
    const products = globals.keeping.activity && globals.keeping.activity.products
    if (products && products.value && products.value.length) {
      this.props.fetchActivities({
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

  shouldComponentUpdate(nextProps, nextState) {
    return this.state.initials.conf.renderState
  }


  onChange = (changedFields) => {
    this.setState({
      fields: { ...this.state.fields, ...changedFields }
    })
  }

  onSearch = (fields) => {
    if (fields.handle === 'SEARCH') {
      this.setState({
        initials: {
          ...this.state.initials,
          paths: fields.path
        }
      })
      this.props.keepGlobals({
        activity: {
          ...this.state.fields
        }
      })
      this.props.fetchActivities(fields)
      this.props.fetchGoodsMap({productId: fields.path.productId})
    }
  }

  onUpdate = (fields) => {
    this.props.updateActivity(fields)
  }

  onSwitch = (fields) => {
    this.props.switchActivity(fields)
  }

  onRender = (nextInitials) => {
    this.state.initials.conf.renderState = nextInitials.renderState
  }

  render() {
    const { globals, login, activity, goods } = this.props

    const dataFlow = {
      initials: this.state.initials,
      options: {
        globals,
        login,
        activity
      }
    }

    return (
      <div>
        <Fragment>
          <Filter
            dataFlow={dataFlow}
            {...this.state.fields}
            onChange={this.onChange}
            onSearch={this.onSearch}
            onRender={this.onRender}
          />
          <List
            dataFlow={dataFlow}
            goods={goods}
            onSearch={this.onSearch}
            onUpdate={this.onUpdate}
            onSwitch={this.onSwitch}
            onRender={this.onRender}
           />
        </Fragment>
      </div>
    )
  }
}

Activities.propTypes = {
  login: PropTypes.object,
  activity: PropTypes.object,
  globals: PropTypes.object,
  goods: PropTypes.object,
  fetchGoodsMap: PropTypes.func,
  fetchActivities: PropTypes.func,
  updateActivity: PropTypes.func,
  switchActivity: PropTypes.func,
  keepGlobals: PropTypes.func,
  fetchGlobalProducts: PropTypes.func,
}
