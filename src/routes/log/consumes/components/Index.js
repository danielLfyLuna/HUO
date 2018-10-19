import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import 'moment/locale/zh-cn'
moment.locale('zh-cn')

import Filter from './Filter'
import List from './List'

export default class LogConsumesPage extends Component {

  static propTypes = {
    consume: PropTypes.object.isRequired,
    login: PropTypes.object.isRequired,
    fetchLogConsumes: PropTypes.func.isRequired,
    exportLogConsumes: PropTypes.func.isRequired,
    fetchGoodsMap: PropTypes.func.isRequired,
    clearLogConsumes: PropTypes.func.isRequired,
    consumeSources: PropTypes.func.isRequired,
    item: PropTypes.object.isRequired,
    keepInitial: PropTypes.func.isRequired,
    products: PropTypes.object,
    fetchProductsMap: PropTypes.func
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
      consumeSource: {
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
    this.props.fetchLogConsumes(fieldsValue)
    this.setState({
      initial: {
        ...this.state.initial,
        products: fieldsValue.products
      }
    })
  }

  // 导出
  onSubmit = (fieldsValue) => {
    this.props.exportLogConsumes(fieldsValue)
  }

    onRender = (initials) => {
      this.state.initials.renderState = initials.renderState
    }

    shouldComponentUpdate(nextProps, nextState) {
      return this.state.initials.renderState
    }

    // 道具接口
    getItems = (fieldsValue) => {
      const value = {
        productId: fieldsValue[0]
      }
      this.props.fetchGoodsMap(value)
    }

    // Table 和 Filter 数据组装一起，提交Fetch 查询
    onTableChange = (pagination) => {
      let newFilter = {}
      newFilter.nickname = this.state.fields.nickname.value
      newFilter.playerId = this.state.fields.playerId.value
      newFilter.consumeSource = this.state.fields.consumeSource.value
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

      this.props.fetchLogConsumes({params: newFilter})
    }

  componentWillMount() {
    this.props.fetchProductsMap()
    this.props.clearLogConsumes()
    this.setState({
      initial: {
        ...this.state.initial,
        ...this.props.consume.keeping
      }
    })
  }
  componentWillUnmount() {
    this.props.keepInitial({
      ...this.state.initial
    })
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
          consume={this.props.consume}
          onSubmit={this.onSubmit}
          item={this.props.item}
          onRender={this.onRender}
          getItems={this.getItems}
          consumeSources={this.props.consumeSources}
          initial={this.state.initial}
        />
        <List
          data={this.props.consume.consumes}
          consume={this.props.consume}
          onTableChange={this.onTableChange}
        />
      </Fragment>
    )
  }

}
