import React, { Component } from 'react'
import PropTypes from 'prop-types'
// import { Card } from 'antd'

import Filter from './Filter'
import List from './List'


export default class NoticesUpdatePage extends Component {

  static propTypes = {
    login: PropTypes.object.isRequired,
    notice: PropTypes.object.isRequired,
    fetchNoticesUpdate: PropTypes.func.isRequired,
    products: PropTypes.object.isRequired,
    fetchProductsMap: PropTypes.func.isRequired,
    fetchGoodsMap: PropTypes.func,
    goods: PropTypes.object,
    keepUpdate: PropTypes.func.isRequired
  }

  state = {
    fields: {
      products: this.props.notice.keeping
    }
  }

  // 双向数据绑定
  onChange = (fieldsValue) => {
    this.setState({
      fields: { ...this.state.fields, ...fieldsValue }
    })
  }

  onSearch = (fieldsValue) => {
    this.props.fetchNoticesUpdate(fieldsValue)
  }

  render() {
    const {products: {options}, notice: {keeping}, login: {curd}, goods} = this.props

    return (
      <div style={{marginBottom: 6}}>
        <Filter
          curd={curd}
          initialFiler={keeping}
          {...this.state.fields}
          options={options}
          onChange={this.onChange}
          onSearch={this.onSearch}
        />
        <List
          curd={curd}
          options={options}
          goods={goods}
          data={this.props.notice.notices}
        />
      </div>
    )
  }

  componentWillMount() {
    this.props.fetchProductsMap()
    this.props.fetchGoodsMap({ productId: '_' })
  }

  componentDidMount() {

  }

  componentWillUnmount() {
    this.props.keepUpdate(this.state.fields.products)
  }
}
