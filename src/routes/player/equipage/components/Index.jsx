import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { Tabs, Icon } from 'antd'

import { fetchProductsMap } from '../../../../base/modules/Products'
import { fetchGoodsMap } from '../../../../base/modules/Goods'
import {
  fetchHorses,
  fetchSkills,
  fetchSoldiers,
  fetchEquipments
} from '../modules/Module'

import Filter from './Filter'

const TabPane = Tabs.TabPane
const TabPaneContent = (props) => {
  const List = require(`./${props.dataType}/List`).default
  return (
    <Fragment>
      <Filter
        options={props.options}
        initials={props.initials}
        {...props.fields}
        dataType={props.dataType}
        onChange={props.onChange}
        onSearch={props.onSearch}
      />
      <List
        options={props.options}
        initials={props.initials}
        dataType={props.dataType}
      />
    </Fragment>
  )
}
TabPaneContent.propTypes = {
  options: PropTypes.object,
  initials: PropTypes.object,
  fields: PropTypes.object,
  dataType: PropTypes.string,
  onChange: PropTypes.func,
  onSearch: PropTypes.func,
}

const mapDispatchtoProps = {
  fetchHorses,
  fetchSkills,
  fetchSoldiers,
  fetchEquipments,
  fetchProductsMap,
  fetchGoodsMap,
}

const mapStateToProps = (state) => ({
  login: state.islogin,
  equipage: state.equipage,
  products: state.products.options,
  goods: state.goods.options
})

@connect(mapStateToProps, mapDispatchtoProps)
export default class Index extends Component {

  state = {
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
    },
    initials: {
      products: {},
      params: {},
      conf: {},
      map: {},
      enum: {}
    }
  }

  componentWillMount() {
    this.props.fetchProductsMap()
  }

  onChange = (changedFields) => {
    this.setState({
      fields: { ...this.state.fields, ...changedFields }
    })
  }

  onSearch = (values) => {
    if (values.handle === 'HORSES') {
      this.props.fetchHorses(values)
    } else if (values.handle === 'SKILLS') {
      this.props.fetchSkills(values)
    } else if (values.handle === 'SOLDIERS') {
      this.props.fetchSoldiers(values)
    } else if (values.handle === 'EQUIPAGES') {
      this.props.fetchEquipments(values)
      this.props.fetchGoodsMap({ productId: values.path.productId || '_' })
    }
    this.setState({
      initials: {
        ...this.state.initials,
        products: values.path,
        params: values.params || {}
      }
    })
  }


  render() {
    const { login, equipage, products, goods } = this.props
    const options = {
      login,
      equipage,
      products,
      goods,
    }
    const initials = this.state.initials
    const authRoutes = login.authRoutes

    return (
      <Fragment>
        <Tabs>
          {
            authRoutes.includes('player-horses') &&
            <TabPane tab={<span><Icon type='bars' />坐骑数据</span>} key='horses'>
              <TabPaneContent
                options={options}
                initials={initials}
                fields={this.state.fields}
                onChange={this.onChange}
                onSearch={this.onSearch}
                dataType='horses'
              />
            </TabPane>
          }
          {
            authRoutes.includes('player-skills') &&
            <TabPane tab={<span><Icon type='bars' />技能数据</span>} key='skills'>
              <TabPaneContent
                options={options}
                initials={initials}
                fields={this.state.fields}
                onChange={this.onChange}
                onSearch={this.onSearch}
                dataType='skills'
              />
            </TabPane>
          }
          {
            authRoutes.includes('player-soldiers') &&
            <TabPane tab={<span><Icon type='bars' />武将数据</span>} key='soldiers'>
              <TabPaneContent
                options={options}
                initials={initials}
                fields={this.state.fields}
                onChange={this.onChange}
                onSearch={this.onSearch}
                dataType='soldiers'
              />
            </TabPane>
          }
          {
            authRoutes.includes('player-equipages') &&
            <TabPane tab={<span><Icon type='bars' />装备数据</span>} key='equipages'>
              <TabPaneContent
                options={options}
                initials={initials}
                fields={this.state.fields}
                onChange={this.onChange}
                onSearch={this.onSearch}
                dataType='equipages'
              />
            </TabPane>
          }
        </Tabs>
      </Fragment>
    )
  }

}

Index.propTypes = {
  login: PropTypes.object,
  equipage: PropTypes.object,
  goods: PropTypes.object,
  products: PropTypes.object,
  fetchHorses: PropTypes.func,
  fetchSkills: PropTypes.func,
  fetchSoldiers: PropTypes.func,
  fetchEquipments: PropTypes.func,
  fetchProductsMap: PropTypes.func,
  fetchGoodsMap: PropTypes.func,
}
