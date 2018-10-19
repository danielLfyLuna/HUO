import React, {Component} from 'react'
import PropTypes from 'prop-types'
import ItemList from './ItemList'
import ItemFilter from './ItemFilter'
import { Divider } from 'antd'

export default class Index extends Component {

  render() {
    return (
      <div>
        <ItemFilter
          onSearch={this.props.fetchAllRewadItemList}
          products={this.props.products}
          handleSyncItem={this.props.handleSyncItem}
        />
        <Divider />
        <ItemList
          data={this.props.items.list.list}
          editBlackRewardItem={this.props.editBlackRewardItem}
        />
      </div>
    )
  }

  // 初始化
  componentWillMount() {
    this.props.fetchProductsMap()
  }
  componentDidMount() {
    // console.log('componentDidMount--')
  }

  // 进行中
  // previous
  componentWillReceiveProps(nextProps, nextState) {
    // console.log('componentWillReceiveProps--', nextProps.sync.fetching)
  }
  shouldComponentUpdate(nextProps, nextState) {
    // console.log('shouldComponentUpdate--', nextProps.sync.fetching)
    return true
  }
  componentWillUpdate(nextProps, nextState) {
    // console.log('componentWillUpdate--', nextProps.sync.fetching)
  }

  // 销毁
  componentWillUnmount() {
    // console.log('componentWillUnmount--')
  }
}


Index.propTypes = {
  fetchAllRewadItemList: PropTypes.func.isRequired,
  editBlackRewardItem: PropTypes.func.isRequired,
  handleSyncItem: PropTypes.func.isRequired,
  fetchProductsMap: PropTypes.func.isRequired,
  items: PropTypes.object,
  products: PropTypes.object,

}
