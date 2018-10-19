import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Card } from 'antd'
import List from './List'

export default class Page extends Component {
  state = {
    fields: {
      products: {}
    },
    initials: {
      products: {
        productId: '',
        serverId: '',
      },
      conf: {
        locale: false,
        timeUnits: {'second': 1, 'minute': 2, 'hour': 3, 'day': 4, 'lasting': 5}
      },
      map: {
        forbidTypes: { 1: '禁言', 2: '禁用拍卖行', 3: '封号' },
        timeUnits: { 1: '秒', 2: '分钟', 3: '小时', 4: '天', 5: '永久' },
        jobTypes: { 1: '战士', 2: '射手', 3: '法师' },
        genderTypes: { 0: '女', 1: '男' },
        officeTypes: { 1: '盟主', 2: '副盟主', 3: '官员', 4: '成员', 5: '见习' }
      },
      enum: {
        timeUnits: [
          { label: '秒', value: 1 },
          { label: '分钟', value: 2 },
          { label: '小时', value: 3 },
          { label: '天', value: 4 },
          { label: '永久', value: 5 },
        ],
        forbidTypes: [
          { label: '禁言', value: 1 },
          { label: '禁用拍卖行', value: 2 },
          { label: '封号', value: 3 }
        ],
      }
    }
  }

  componentWillMount() {
    const { location } = this.props
    this.props.fetchAllianceMembers({ path: location.query })
    this.setState({
      initials: {...this.state.initials,
        products: {
          productId: location.query.productId,
          serverId: location.query.serverId
        }
      }
    })
  }

  render() {
    const { alliance, products, login } = this.props
    const options = {
      alliance,
      login,
      products: {
        list: products.options
      }
    }
    const initials = this.state.initials
    return (
      <Card style={{ marginBottom: 6 }}>
        <List
          options={options}
          initials={initials}
        />
      </Card>
    )
  }
}

Page.propTypes = {
  alliance: PropTypes.object,
  products: PropTypes.object,
  login: PropTypes.object,
  location: PropTypes.object,
  fetchAllianceMembers: PropTypes.func
}
