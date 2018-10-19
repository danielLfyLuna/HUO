import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'

import Filter from './Filter'
import List from './List'
import { fetchProductsMap } from '../../../../base/modules/Products'
import {
  fetchSEN,
  addSEN,
  syncSEN
} from './../modules/Module'

const mapDispatchtoProps = {
  fetchSEN,
  addSEN,
  syncSEN,
  fetchProductsMap
}
const mapStateToProps = (state) => ({
  login: state.islogin,
  sensitive: state.sensitive,
  products: state.products
})

@connect(mapStateToProps, mapDispatchtoProps)
export default class Index extends Component {
  static propTypes = {
    fetchSEN: PropTypes.func,
    addSEN: PropTypes.func,
    syncSEN: PropTypes.func,
    fetchProductsMap: PropTypes.func,
    sensitive: PropTypes.object,
    products: PropTypes.object,
    login: PropTypes.object
  }

  onSearch = (fieldsValue) => {
    this.props.fetchSEN(fieldsValue)
  }

  onAdd = (fieldsValue) => {
    this.props.addSEN(fieldsValue)
  }

  onSync = (fieldsValue) => {
    this.props.syncSEN(fieldsValue)
  }

  componentWillMount() {
    this.props.fetchProductsMap()
  }
  render() {
    const { curd } = this.props.login
    let options = []
    if (this.props.products.options) {
      options = this.props.products.options
    }
    return (
      <div>
        <div style={{marginBottom: 6}}>
          <Filter
            onSearch={this.onSearch}
            onAdd={this.onAdd}
            onSync={this.onSync}
            options={options}
            curd={curd}
          />
          <List
            data={this.props.sensitive}
          />
        </div>
      </div>
    )
  }

}
