import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'

import Filter from './Filter'
import List from './List'
import { fetchProductsMap } from '../../../../base/modules/Products'
import {
  fetchNoticesTiming,
  addTimingNotice,
  stopTimingNotice,
  deleteTimingNotice,
  keepNoticesTiming
} from './../modules/Module'

const mapDispatchtoProps = {
  fetchNoticesTiming,
  addTimingNotice,
  stopTimingNotice,
  deleteTimingNotice,
  fetchProductsMap,
  keepNoticesTiming
}

const mapStateToProps = (state) => ({
  login: state.islogin,
  notice: state.timingNotice,
  products: state.products
})

@connect(mapStateToProps, mapDispatchtoProps)
export default class NoticesTiming extends Component {

  static propTypes = {
    login: PropTypes.object,
    notice: PropTypes.object,
    deleteTimingNotice: PropTypes.func,
    stopTimingNotice: PropTypes.func,
    addTimingNotice: PropTypes.func,
    fetchNoticesTiming: PropTypes.func,
    products: PropTypes.object,
    fetchProductsMap: PropTypes.func,
    keepNoticesTiming: PropTypes.func
  }

  state = {
    fields: {
      products: {},
      time: {},
      noticeType: {}
    }
  }

  // 双向数据绑定
  onChange = (fieldsValue) => {
    this.setState({
      fields: { ...this.state.fields, ...fieldsValue }
    })
  }

  onTableChange = (pagination) => {
    let v = {
      path: {
        productId: this.state.fields.products.value[0]
      },
      params: {
        type: this.state.fields.noticeType.value,
        startTime: this.state.fields.time.value[0].format('YYYY-MM-DD HH:mm:ss'),
        endTime: this.state.fields.time.value[1].format('YYYY-MM-DD HH:mm:ss'),
        pageNum: pagination.current,
        pageSize: pagination.pageSize
      }
    }
    this.props.fetchNoticesTiming(v)
  }

  onSearch = (fieldsValue) => {
    this.props.fetchNoticesTiming(fieldsValue)
  }

  onCreate = (fieldsValue) => {
    this.props.addTimingNotice(fieldsValue)
  }

  onStopItem = (fieldsValue) => {
    this.props.stopTimingNotice(fieldsValue)
  }

  onDeleteItem = (fieldsValue) => {
    this.props.deleteTimingNotice(fieldsValue)
  }

  render() {
    const {products: {options}, notice: {keeping}, login: {curd}} = this.props

    return (
      <Fragment>
        <Filter
          curd={curd}
          initialFiler={keeping}
          {...this.state.fields}
          options={options}
          onChange={this.onChange}
          onSearch={this.onSearch}
          onCreate={this.onCreate}
        />
        <List
          curd={curd}
          options={options}
          data={this.props.notice.notices}
          onStopItem={this.onStopItem}
          onDeleteItem={this.onDeleteItem}
          onTableChange={this.onTableChange}
        />
      </Fragment>
    )
  }

  componentWillMount() {
    this.props.fetchProductsMap()
  }

  componentDidMount() {

  }

  componentWillUnmount() {
    this.props.keepNoticesTiming(this.state.fields.products)
  }
}
