import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import moment from 'moment'
import _ from 'lodash'

import Filter from './Filter'
import List from './List'

import { fetchGlobalProducts } from '../../../../base/modules/Global'
import {
  keepAction,
  fetchLogActions,
  exportLogActions,
  fetchOperateType,
  fetchConsumeSources,
  fetchProduceSources
} from './../modules/Module'

const mapDispatchtoProps = {
  keepAction,
  fetchLogActions,
  exportLogActions,
  fetchOperateType,
  fetchConsumeSources,
  fetchProduceSources,
  fetchGlobalProducts
}

const mapStateToProps = (state) => ({
  login: state.islogin,
  action: state.action,
  globals: state.globals
})

@connect(mapStateToProps, mapDispatchtoProps)
export default class Actions extends Component {

  state = {
    fields: {
      products: {
        value: []
      },
      startTime: {
        value: moment()
      },
      nickname: {
        value: ''
      },
      playerId: {
        value: ''
      },
      produceSource: {
        value: []
      },
      consumeSource: {
        value: []
      },
      operationType: {
        value: []
      }
    },
    initials: {
      conf: {
        renderState: false
      }
    }
  }

  componentWillMount() {
    this.props.fetchGlobalProducts()
    this.setState({
      initials: {
        ...this.state.initials,
        ...this.props.action.keeping
      }
    })
  }

  componentWillUnmount() {
    this.props.keepAction({
      ...this.state.initials
    })
  }

  onChange = (changedFields) => {
    this.setState({
      fields: { ...this.state.fields, ...changedFields }
    })
  }

  // 搜索
  onSearch = (fieldsValue) => {
    if (fieldsValue.handle === 'ACTIONS') {
      this.props.fetchLogActions(fieldsValue)
      this.setState({
        initials: {
          ...this.state.initials,
          products: fieldsValue.products
        }
      })
    } else if (fieldsValue.handle === 'OPERATES') {
      this.props.fetchOperateType()
    } else if (fieldsValue.handle === 'CONSUMES') {
      this.props.fetchConsumeSources()
    } else if (fieldsValue.handle === 'PRODUCES') {
      this.props.fetchProduceSources()
    }
  }
  // 导出
  onExport = (fieldsValue) => {
    this.props.exportLogActions(fieldsValue)
  }

  render() {
    const { login, globals, action } = this.props

    const options = {
      login,
      globals,
      action,
      sources: {
        produce: _.map(action.produces, (val, idx) => ({ label: `${idx}(${val})`, value: `${val}`, key: `${val}` })),
        consume: _.map(action.consumes, (val, idx) => ({ label: `${idx}(${val})`, value: `${val}`, key: `${val}` })),
        operate: _.map(action.operates, (val, idx) => ({ label: `${idx}(${val})`, value: `${val}`, key: `${val}` }))
      }
    }
    const initials = this.state.initial

    return (
      <Fragment>
        <Filter
          options={options}
          initials={initials}
          {...this.state.fields}
          onSearch={this.onSearch}
          onChange={this.onChange}
          onExport={this.onExport}
        />
        <List
          options={options}
        />
      </Fragment>
    )
  }

}

Actions.propTypes = {
  action: PropTypes.object,
  login: PropTypes.object,
  globals: PropTypes.object,
  keepAction: PropTypes.func,
  fetchLogActions: PropTypes.func,
  exportLogActions: PropTypes.func,
  fetchOperateType: PropTypes.func,
  fetchConsumeSources: PropTypes.func,
  fetchProduceSources: PropTypes.func,
  fetchGlobalProducts: PropTypes.func,
}
