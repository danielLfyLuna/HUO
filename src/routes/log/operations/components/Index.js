import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import 'moment/locale/zh-cn'
moment.locale('zh-cn')

import Filter from './Filter'
import List from './List'

export default class LogOperationsPage extends Component {

  static propTypes = {
    operation: PropTypes.object,
    login: PropTypes.object,
    fetchLogOperations: PropTypes.func,
    exportLogOperations: PropTypes.func,
    clearLogOperations: PropTypes.func,
    operationSources: PropTypes.func,
    keepInitial: PropTypes.func.isRequired,
    fetchProductsMap: PropTypes.func,
    products: PropTypes.object
  }

  state = {
    initial: {
      products: []
    },
    initials: {
      productId: 1,
      renderState: true
    },
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
      dates: {
        value: [moment('00:00:00', 'HH:mm:ss'), moment('00:00:00', 'HH:mm:ss').subtract({days: -1})]
      },
      'operationType': {
        value: []
      }
    }
  }

  // 双向数据绑定
  onChange = (fieldsValue) => {
    this.setState({
      fields: { ...this.state.fields, ...fieldsValue }
    })
  }

  // 搜索
  onSearch = (fieldsValue) => {
    this.props.fetchLogOperations(fieldsValue)
    this.setState({
      initial: {
        ...this.state.initial,
        products: fieldsValue.products
      }
    })
  }

  // 导出
  onSubmit = (fieldsValue) => {
    this.props.exportLogOperations(fieldsValue)
  }

  // Table 和 Filter 数据组装一起，提交Fetch 查询
  onTableChange = (pagination) => {
    let newFilter = {}
    newFilter.nickname = this.state.fields.nickname.value
    newFilter.playerId = this.state.fields.playerId.value
    newFilter.operationType = this.state.fields.operationType.value
    newFilter.productId = this.state.fields['products'].value[0]
    newFilter.serverId = this.state.fields['products'].value[1]
    // newFilter.dates = this.state.fields.dates.value
    newFilter.startTime = this.state.fields.dates.value[0].format('YYYY-MM-DD HH:mm:ss')
    newFilter.endTime = this.state.fields.dates.value[1].format('YYYY-MM-DD HH:mm:ss')
    newFilter.pageSize = pagination.pageSize
    newFilter.pageNum = pagination.current
    this.props.fetchLogOperations({params: newFilter})
  }

  onRender = (initials) => {
    this.state.initials.renderState = initials.renderState
  }

  shouldComponentUpdate(nextProps, nextState) {
    return this.state.initials.renderState
  }

  componentWillMount() {
    this.props.fetchProductsMap()
    this.props.clearLogOperations()
    this.setState({
      initial: {
        ...this.state.initial,
        ...this.props.operation.keeping
      }
    })
  }

  componentWillUnmount() {
    this.props.keepInitial({
      ...this.state.initial
    })
  }

  render() {
    const {login: {authRoutes}} = this.props

    let options = []
    if (this.props.products.options) {
      options = this.props.products.options
    }

    return (
      <Fragment>
        <Filter
          {...this.state.fields}
          curd={authRoutes}
          options={options}
          onSearch={this.onSearch}
          onChange={this.onChange}
          operation={this.props.operation}
          onSubmit={this.onSubmit}
          onRender={this.onRender}
          operationSources={this.props.operationSources}
          initial={this.state.initial}
        />
        <List
          operation={this.props.operation}
          onTableChange={this.onTableChange}
          data={this.props.operation.operations}
        />
      </Fragment>
    )
  }

}
