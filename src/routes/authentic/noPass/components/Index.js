import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Card } from 'antd'

import Filter from './Filter'
import List from './List'

export default class Authentics extends Component {

  componentWillMount() {
    this.props.fetchProductsMap()
  }

  onGet = (value) => {
    this.props.fetchAuthentics(value)
  }

  onCreate = (values) => {
    this.props.addAuthentic(values)
  }

  onDelete = (values) => {
    this.props.delAuthentic(values)
  }

  render() {
    const { login: {curd} } = this.props
    let options = []
    if (this.props.products.options) {
      options = this.props.products.options
    }

    return (
      <div>
        <Card style={{ marginBottom: 6 }}>
          <Filter
            curd={curd}
            options={options}
            onCreate={this.onCreate}
            onGet={this.onGet}
          />
          <List
            curd={curd}
            noPass={this.props.noPass}
            onDelete={this.onDelete}
          />
        </Card>
      </div>
    )
  }
}

Authentics.propTypes = {
  products: PropTypes.object,
  fetchProductsMap: PropTypes.func,
  noPass: PropTypes.object.isRequired,
  login: PropTypes.object,
  fetchAuthentics: PropTypes.func,
  addAuthentic: PropTypes.func,
  delAuthentic: PropTypes.func
}
