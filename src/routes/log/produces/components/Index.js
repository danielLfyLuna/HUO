import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import 'moment/locale/zh-cn'
moment.locale('zh-cn')

import Filter from './Filter'
import List from './List'

export default class LogProducesPage extends Component {

  static propTypes = {
    produce: PropTypes.object,
    login: PropTypes.object,
    item: PropTypes.object,
    fetchLogProduces: PropTypes.func,
    exportLogProduces: PropTypes.func,
    clearLogProduces: PropTypes.func,
    fetchGoodsMap: PropTypes.func,
    produceSources: PropTypes.func,
    keepInitial: PropTypes.func.isRequired,
    fetchProductsMap: PropTypes.func,
    products: PropTypes.object
  }

  state = {
    initial: {
      products: []
    },
    initials: {
      productId: 1,
      renderState: true
    },
    fields: {
      products: {
        value: []
      },
      nickname: {
        value: ''
      },
      playerId: {
        value: ''
      },
      dates: {
        value: [moment('00:00:00', 'HH:mm:ss'), moment('00:00:00', 'HH:mm:ss').subtract({days: -1})]
      },
      items: {
        value: []
      },
      skills: {
        value: []
      },
      roles: {
        value: []
      },
      produceSource: {
        value: []
      }
    }
  }

  // 双向数据绑定
  onChange = (fieldsValue) => {
    this.setState({
      fields: { ...this.state.fields, ...fieldsValue }
    })
  }

  // 搜索
  onSearch = (fieldsValue) => {
    this.props.fetchLogProduces(fieldsValue)
    this.setState({
      initial: {
        ...this.state.initial,
        products: fieldsValue.products
      }
    })
  }

  // 导出
  onSubmit = (fieldsValue) => {
    this.props.exportLogProduces(fieldsValue)
  }

  // Table 和 Filter 数据组装一起，提交Fetch 查询
  onTableChange = (pagination) => {
    let newFilter = {}
    newFilter.nickname = this.state.fields.nickname.value
    newFilter.playerId = this.state.fields.playerId.value
    newFilter.produceSource = this.state.fields.produceSource.value
    newFilter.productId = this.state.fields['products'].value[0]
    newFilter.serverId = this.state.fields['products'].value[1]
    // newFilter.dates = this.state.fields.dates.value
    newFilter.startTime = this.state.fields.dates.value[0].format('YYYY-MM-DD HH:mm:ss')
    newFilter.endTime = this.state.fields.dates.value[1].format('YYYY-MM-DD HH:mm:ss')

    let itemIds = []
    if (this.state.fields.items.value.length > 0) {
      itemIds = itemIds.concat(this.state.fields.items.value)
    }
    if (this.state.fields.skills.value.length > 0) {
      itemIds = itemIds.concat(this.state.fields.skills.value)
    }
    if (this.state.fields.roles.value.length > 0) {
      itemIds = itemIds.concat(this.state.fields.roles.value)
    }
    newFilter.itemId = itemIds.join(',')
    newFilter.pageSize = pagination.pageSize
    newFilter.pageNum = pagination.current
    this.props.fetchLogProduces({params: newFilter})
  }

    onRender = (initials) => {
      this.state.initials.renderState = initials.renderState
    }

    componentWillMount() {
      this.props.fetchProductsMap()
      this.props.clearLogProduces()
      this.setState({
        initial: {
          ...this.state.initial,
          ...this.props.produce.keeping
        }
      })
    }

    shouldComponentUpdate(nextProps, nextState) {
      return this.state.initials.renderState
    }

    componentWillUnmount() {
      this.props.keepInitial({
        ...this.state.initial
      })
    }

    // 道具接口
    getItems = (fieldsValue) => {
      const value = {
        productId: fieldsValue[0]
      }
      this.props.fetchGoodsMap(value)
    }


  render() {
    const {login: {authRoutes}} = this.props
    let options = []
    if (this.props.products.options) {
      options = this.props.products.options
    }

    return (
      <Fragment>
        <Filter
          {...this.state.fields}
          curd={authRoutes}
          options={options}
          onSearch={this.onSearch}
          onChange={this.onChange}
          produce={this.props.produce}
          onSubmit={this.onSubmit}
          item={this.props.item}
          onRender={this.onRender}
          getItems={this.getItems}
          produceSources={this.props.produceSources}
          initial={this.state.initial}
        />
        <List
          data={this.props.produce.produces}
          onTableChange={this.onTableChange}
          produce={this.props.produce}
        />
      </Fragment>
    )
  }

}
