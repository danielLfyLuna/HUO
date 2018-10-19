import React, { Component } from 'react'
import PropTypes from 'prop-types'

import Filter from './Filter'
import List from './List'

let initials = {
  products: {
    productId: ''
  }
}
export default class NoticesLoginPage extends Component {

  onSearch = (fieldsValue) => {
    this.props.fetchChannelGifts({path: { productId: fieldsValue.products[0] }})
    initials.products.productId = fieldsValue.products[0]
  }

  onDelete = (fieldsValue) => {
    this.props.deleteChannelGift({
      path: { productId: fieldsValue.productId },
      form: fieldsValue.form
    })
  }

  onCreate = (fieldsValue) => {
    this.props.createChannelGift(fieldsValue)
    initials.products.productId = fieldsValue.path.productId
  }

  componentWillMount() {
    this.props.fetchProductsMap()
  }
  render() {
    const {login: {curd}} = this.props
    let options = []
    if (this.props.products.options) {
      options = this.props.products.options
    }
    return (
      <div style={{marginBottom: 6}}>
        <Filter
          curd={curd}
          options={options}
          onChange={this.onChange}
          onSearch={this.onSearch}
          onCreate={this.onCreate}
        />
        <List
          initials={initials}
          options={options}
          onDelete={this.onDelete}
          onUpdate={this.onUpdate}
          data={this.props.cdkey}
        />
      </div>
    )
  }

}

NoticesLoginPage.propTypes = {
  cdkey: PropTypes.object,
  login: PropTypes.object,
  products: PropTypes.object,
  fetchProductsMap: PropTypes.func,
  fetchChannelGifts: PropTypes.func,
  createChannelGift: PropTypes.func,
  deleteChannelGift: PropTypes.func
}
