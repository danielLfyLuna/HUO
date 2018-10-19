import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Card, Tabs, Icon } from 'antd'
import _ from 'lodash'

import Filter from './transDetail/Filter'
import List from './transDetail/List'
import Filters from './amount/Filter'
import Lists from './amount/List'

const TabPane = Tabs.TabPane

import { connect } from 'react-redux'
import { getItemDetail, getItemAmount } from '../modules/Module'
import { fetchProductsMap } from '../../../../base/modules/Products'

const mapDispatchtoProps = {
  getItemDetail,
  getItemAmount,
  fetchProductsMap
}
const mapStatetoProps = (state) => ({
  itemDetails: state.itemDetails,
  products: state.products,
  login: state.islogin
})

@connect(mapStatetoProps, mapDispatchtoProps)
export default class Index extends Component {
  static propTypes = {
    itemDetails: PropTypes.object,
    products: PropTypes.object,
    login: PropTypes.object,
    getItemDetail: PropTypes.func,
    getItemAmount: PropTypes.func,
    fetchProductsMap: PropTypes.func
  }

  state = {
    dataDetail: {},
    dataAmount: {}
  }

  onSearch = (value) => {
    this.props.getItemDetail(value)
    this.setState({
      dataDetail: value
    })
  }

  onGet = (value) => {
    this.props.getItemAmount(value)
    this.setState({
      dataAmount: value
    })
  }

  handleTableChange = (pagination, symbol) => {
    if (symbol === 'detail') {
      let value = { ...this.state.dataDetail }
      value.time.pageNum = pagination.current
      value.time.pageSize = pagination.pageSize
      this.props.getItemDetail(value)
    } else {
      let value = { ...this.state.dataAmount }
      value.time.pageNum = pagination.current
      value.time.pageSize = pagination.pageSize
      this.props.getItemAmount(value)
    }
  }

  componentWillMount() {
    this.props.fetchProductsMap()
  }

  render() {
    const { itemDetails, products, login } = this.props
    const data = {
      products: products.options
    }

    return (
      <div>
        <Card style={{ marginBottom: 6 }}>
          <Tabs defaultActiveKey='itemDetail'>
            {
              _.has(login.curd, '170201') &&
              <TabPane tab={<div><Icon type='book' />物品交易明细</div>} key='itemDetail'>
                <Filter
                  data={data}
                  onSearch={this.onSearch}
                />
                <List
                  handleTableChange={this.handleTableChange}
                  itemDetails={itemDetails}
                 />
              </TabPane>
            }
            {
              _.has(login.curd, '170202') &&
              <TabPane tab={<div><Icon type='pay-circle-o' />交易额明细</div>} key='amount'>
                <Filters
                  data={data}
                  onGet={this.onGet}
                />
                <Lists
                  handleTableChange={this.handleTableChange}
                  itemDetails={itemDetails}
                 />
              </TabPane>
            }
          </Tabs>

        </Card>
      </div>
    )
  }
}
