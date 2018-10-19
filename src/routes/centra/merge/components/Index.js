import React, { Component } from 'react'
import PropTypes from 'prop-types'

import Filter from './Filter'
import List from './List'

export default class Index extends Component {

  componentWillMount() {
    this.props.fetchProductsMap()
    this.props.fetchProductsCellMap()
  }

  componentWillUnmount() {
    this.props.clearMerge()
  }

  onSearch = (values) => {
    this.props.fetchMerge(values)
  }

  onCreate = (fields) => {
    this.props.addMerge(fields)
  }

  onUpdate = (fields) => {
    this.props.updateMerge(fields)
  }

  render() {
    const {curd} = this.props.login

    let options = []
    if (this.props.products.options) {
      options = this.props.products.options
    }

    let cellOptions = []
    if (this.props.productsCell.options) {
      cellOptions = this.props.productsCell.options
    }

    return (
      <div style={{ marginBottom: 6 }}>
        <Filter
          curd={curd}
          onSearch={this.onSearch}
          onCreate={this.onCreate}
          options={options}
          cellOptions={cellOptions}
          merge={this.props.merge}
        />
        <List
          curd={curd}
          onUpdate={this.onUpdate}
          data={this.props.merge.list}
          cellOptions={cellOptions}
         />
      </div>
    )
  }
}

Index.propTypes = {
  login: PropTypes.object.isRequired,
  merge: PropTypes.object,
  clearMerge: PropTypes.func,
  addMerge: PropTypes.func,
  fetchMerge: PropTypes.func,
  updateMerge: PropTypes.func,
  products: PropTypes.object,
  productsCell: PropTypes.object,
  fetchProductsMap: PropTypes.func,
  fetchProductsCellMap: PropTypes.func
}
