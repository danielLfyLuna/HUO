import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router'
import _ from 'lodash'

import { fetchBatchmail, addBatchmail, updateBatchmail, fetchBatchmailPlayer } from '../modules/Module'
import { fetchProductsMap } from '../../../../../../../base/modules/Products'
import { fetchGoodsMap } from '../../../../../../../base/modules/Goods'
// import { fetchItemPrice } from '../../../../../../modules/itemPrice'
// import { fetchPriceMax } from '../../../../../../modules/mailMax'

import Filter from './Filter'
import List from './List'

const mapDispatchtoProps = {
  fetchProductsMap,
  fetchGoodsMap,
  // fetchItemPrice,
  // fetchPriceMax,
  fetchBatchmail,
  addBatchmail,
  updateBatchmail,
  fetchBatchmailPlayer
}

const mapStateToProps = (state) => ({
  login: state.islogin,
  // mailMax: state.mailMax,
  batchmail: state.batchmail,
  products: state.products,
  goods: state.goods
  // itemPrice: state.itemPrice
})


@connect(mapStateToProps, mapDispatchtoProps)
class Index extends Component {
  static propTypes = {
    fetchGoodsMap: PropTypes.func,
    // fetchItemPrice: PropTypes.func,
    // fetchPriceMax: PropTypes.func,
    login: PropTypes.object.isRequired,
    goods: PropTypes.object,
    // mailMax: PropTypes.object,
    // itemPrice: PropTypes.object,
    batchmail: PropTypes.object,
    fetchBatchmail: PropTypes.func,
    addBatchmail: PropTypes.func,
    // clearBatchmailAdd: PropTypes.func,
    updateBatchmail: PropTypes.func,
    router: PropTypes.object
  }

  static childContextTypes = {
    router: PropTypes.object
  }

  getChildContext() {
    return { router: this.props.router }
  }

  componentWillMount() {
    this.props.fetchGoodsMap({productId: '_'})
  }

  // 查询批量邮件
  onSearch = (value) => {
    this.props.fetchBatchmail(value)
  }

  // 添加批量邮件
  onCreate = (value) => {
    this.props.addBatchmail(value)
  }

  // 修改批量邮件
  onUpdate = (value) => {
    this.props.updateBatchmail(value)
  }

  render() {
    const { login: {curd} } = this.props
    let item = []
    if (this.props.goods.options[0]) {
      _.map(this.props.goods.options[0], (value, key) => {
          item.push(
            {value: key, label: `${value}(${key})`}
          )
      })
    }

    return (
      <div style={{marginBottom: 6}}>
        <Filter
          curd={curd}
          onSearch={this.onSearch}
          onCreate={this.onCreate}
          item={item}
        />
        <List
          onUpdate={this.onUpdate}
          data={this.props.batchmail.batchmails}
          login={this.props.login}
          fetching={this.props.batchmail.fetching}
          item={item}
        />
      </div>
    )
  }
}

export default withRouter(Index)
