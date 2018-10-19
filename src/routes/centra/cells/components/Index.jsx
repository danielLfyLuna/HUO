import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'

import {
  fetchGlobalProducts,
  keepGlobals
} from '../../../../base/modules/Global'
import { fetchCells, fetchCellTypes, updateCell } from '../modules/Module'

import Filter from './Filter.jsx'
import List from './List.jsx'

const mapDispatchtoProps = {
  fetchCells,
  fetchCellTypes,
  fetchGlobalProducts,
  keepGlobals,
  updateCell
}

const mapStateToProps = (state) => ({
  cell: state.cell,
  globals: state.globals,
  login: state.islogin
})

@connect(mapStateToProps, mapDispatchtoProps)
export default class Cells extends Component {
  state = {
    fields: {
      products: {
        value: [ ]
      }
    },
    initials: {
      map: {
        cellStatus: { 1: '开启', 2: '维护', 3: '不可用', 4: '初置阶段', 5: '部署完成', 6: '测试' },
        cellTypes: { 'cross': '国战服', 'hqb': 'RPG服', 'audio': '语音服' }
      },
      enum: {
        cellStatus: [
          { label: '开启', value: 1 },
          { label: '维护', value: 2 },
          { label: '不可用', value: 3 },
          { label: '初置阶段', value: 4 },
          { label: '部署完成', value: 5 },
          { label: '测试', value: 6 }
        ]
      }
    }
  }

  onChange = (changedFields) => {
    this.setState({
      fields: { ...this.state.fields, ...changedFields }
    })
  }

  onSearch = (fields) => {
    if (fields.handle === 'SEARCH') {
      this.props.fetchCells(fields)
      this.props.keepGlobals({
        centra: {
          products: {
            value: [...this.state.fields.products.value]
          }
        }
      })
    } else if (fields.handle === 'UPDATE') {
      this.props.fetchCellTypes(fields)
    }
  }

  onUpdate = (fields) => {
    this.props.updateCell(fields)
  }

  componentWillMount() {
    this.props.fetchGlobalProducts()
    const { globals } = this.props
    const products = globals.keeping.centra && globals.keeping.centra.products
    if (products && products.value && products.value.length) {
      this.props.fetchCells({
        path: {
          productId: products.value[0]
        }
      })
      this.setState({
        fields: {
          ...this.state.fields,
          products: {
            value: [...products.value]
          }
        }
      })
    }
  }

  render() {
    const { cell, globals, login } = this.props
    const options = {
      globals: globals,
      cell: cell,
      login: login
    }
    const initials = this.state.initials
    return (
      <Fragment>
        <Filter
          options={options}
          initials={initials}
          {...this.state.fields}
          onChange={this.onChange}
          onSearch={this.onSearch}
        />
        <List
          options={options}
          initials={initials}
          onSearch={this.onSearch}
          onUpdate={this.onUpdate}
         />
      </Fragment>
    )
  }
}

Cells.propTypes = {
  login: PropTypes.object,
  cell: PropTypes.object,
  globals: PropTypes.object,
  fetchCells: PropTypes.func,
  fetchCellTypes: PropTypes.func,
  fetchGlobalProducts: PropTypes.func,
  keepGlobals: PropTypes.func,
  updateCell: PropTypes.func,
}
