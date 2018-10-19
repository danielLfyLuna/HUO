import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'

import List from './List'
import Filter from './RanksFilter'


export default class RanksPage extends Component {

  state = {
    rankName: '',
    initial: {
      products: []
    }
  }

  _setRankName = (e) => {
    this.setState({
      rankName: e
    })
  }

  componentWillMount() {
    this.props.fetchProductsMap()
  }

  componentWillUnmount() {
  }

  render() {
    const { login: {curd} } = this.props

    return (
      <Fragment>
        <Filter
          options={this.props.products.options}
          onSearch={this.props.fetchGet}
          _setRankName={this._setRankName}
          initial={this.state.initial}
        />
        <List
          curd={curd}
          data={this.props.ranks}
        />
      </Fragment>
    )
  }
}

RanksPage.propTypes = {
  ranks: PropTypes.object,
  login: PropTypes.object,
  products: PropTypes.object,
  fetchGet: PropTypes.func,
  fetchProductsMap: PropTypes.func
}
