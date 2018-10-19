import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'
import _ from 'lodash'
// import moment from 'moment'

import Filter from './Filter'
import List from './List'


export default class SqlsPage extends Component {

  static propTypes = {
    clearExecSqls: PropTypes.func.isRequired,
    sql: PropTypes.object.isRequired,
    login: PropTypes.object.isRequired,
    execSqls: PropTypes.func.isRequired,
    exportSqls: PropTypes.func.isRequired,
    updateSqls: PropTypes.func.isRequired,
    deleteSqls: PropTypes.func.isRequired,
    addSqls: PropTypes.func.isRequired,
    fetchSqls: PropTypes.func.isRequired,
    clearSqls: PropTypes.func.isRequired,
    mergebeforeSqls: PropTypes.func,
    fetchProductsMap: PropTypes.func,
    products: PropTypes.object
  }

  componentWillMount() {
    this.props.fetchProductsMap()
    this.props.clearSqls()
  }

  // 搜索
  onSearch = () => {
    this.props.fetchSqls()
  }
  // 添加
  onSubmit = (fieldsValue) => {
    const value = {
      form: {
        name: fieldsValue.name,
        type: fieldsValue.type,
        sql: fieldsValue.sql,
        conditions: fieldsValue.conditions
      }
    }
    this.props.addSqls(value)
  }

  // 删除
  onDelete = (fieldsValue) => {
    this.props.deleteSqls({
      path: { id: fieldsValue.id }
    })
  }
  // 修改
  onUpdate = (fieldsValue) => {
    const value = {
      form: {
        id: fieldsValue.id,
        name: fieldsValue.name,
        type: fieldsValue.type,
        sql: fieldsValue.sql,
        conditions: fieldsValue.conditions
      }
    }
    this.props.updateSqls(value)
  }
  // 执行
  onExec = (fieldsValue) => {
    let value = {
      list: {
        productId: fieldsValue.products[0],
        serverId: fieldsValue.products[1]
      },
      id: fieldsValue.id
    }
    const options = fieldsValue.conditions.split(',')
    _.map(options, (opt, idx) => {
      if (fieldsValue[opt]) {

        if (opt == 'startTime' || opt == 'endTime') {
          value.list[opt] = fieldsValue[opt].format('YYYY-MM-DD HH:mm:ss')
        } else {
          value.list[opt] = fieldsValue[opt]
        }
      }
    })

    this.props.execSqls({
      form: value.list,
      path: { id: value.id }
    })
  }
  // 合服前执行
  onNew = (fieldsValue) => {
    let value = {
      list: {
        productId: fieldsValue.productId[0],
        serverId: fieldsValue.serverId
      },
      id: fieldsValue.id
    }
    const options = fieldsValue.conditions.split(',')
    _.map(options, (opt, idx) => {
      if (fieldsValue[opt]) {
        value.list[opt] = fieldsValue[opt]
      }
    })

    this.props.mergebeforeSqls({
      form: value.list,
      path: { id: value.id }
    })
  }
  // 导出
  onExport = (fieldsValue) => {
    const options = fieldsValue.conditions.split(',')
    let value = {}
    value.id = fieldsValue.id
    value.list = {}
    _.map(options, (opt, idx) => {
      if (fieldsValue[opt]) {
        value.list[opt] = fieldsValue[opt]
      }
    })
    value.list.productId = fieldsValue.products[0]
    value.list.serverId = fieldsValue.products[1]
    if (value.list.startTime) { value.list.startTime = value.list.startTime.format('YYYY-MM-DD HH:mm:ss') }
    if (value.list.endTime) { value.list.endTime = value.list.endTime.format('YYYY-MM-DD HH:mm:ss') }

    this.props.exportSqls({
      form: value.list,
      path: { id: value.id }
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
          curd={authRoutes}
          options={options}
          onSearch={this.onSearch}
          onSubmit={this.onSubmit}
          execSqls={this.props.sql.execSqls}
        />
        <List
          curd={authRoutes}
          options={options}
          data={this.props.sql.sqls}
          execSqls={this.props.sql.execSqls}
          clearExecSqls={this.props.clearExecSqls}
          onDelete={this.onDelete}
          onUpdate={this.onUpdate}
          onExec={this.onExec}
          onExport={this.onExport}
          onNew={this.onNew}
          fetching={this.props.sql.fetching}
        />
      </Fragment>
    )
  }

}
