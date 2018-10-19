import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'

import Filter from './Filter'
import List from './List'
import { fetchProductsMap } from '../../../../base/modules/Products'
import {
  fetchPlayers,
  clearHeadImage,
  kickoutPlayer,
  receivePlayers,
  skipNovice,
  skipNovices,
  modifyNickname,
} from '../modules/Module'

const mapDispatchtoProps = {
  fetchPlayers,
  clearHeadImage,
  kickoutPlayer,
  receivePlayers,
  skipNovice,
  skipNovices,
  modifyNickname,
  fetchProductsMap
}

const mapStateToProps = (state) => ({
  login: state.islogin,
  player: state.player,
  products: state.products.options,
})

@connect(mapStateToProps, mapDispatchtoProps)
export default class Players extends Component {

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
      platformId: {
        value: ''
      },
    },
    initials: {
      params: {},
      conf: {},
      map: {
        gender: { 0: '女', 1: '男' },
        job: { 1: '战士', 2: '射手', 3: '法师' },
        online: { 0: '离线', 1: '在线' }
      },
      enum: {}
    }
  }

  // 初始化
  componentWillMount() {
    this.props.fetchProductsMap()
  }

  // 销毁
  componentWillUnmount() {
  }

  // 双向数据绑定
  onChange = (changedFields) => {
    this.setState({
      fields: { ...this.state.fields, ...changedFields }
    })
  }

  // 搜索提交
  onSearch = (data) => {
    if (data.handle === 'SEARCH') {
      this.props.fetchPlayers(data)
    }
  }

  onStop = (data) => {
    this.props.clearHeadImage(data)
  }

  onSkip = (data) => {
    if (data.handle === 'BATCH') {
      this.props.skipNovices(data)
    } else {
      this.props.skipNovice(data)
    }
  }

  onUpdate = (data) => {
    if (data.handle === 'NAME') {
      this.props.modifyNickname(data)
    }
  }

  onKick = (data) => {
    this.props.kickoutPlayer(data)
  }

  render() {
    const { login, player, products } = this.props
    let options = {
      login,
      player,
      products
    }
    let initials = this.state.initials
    return (
      <Fragment>
        <Filter
          options={options}
          initials={initials}
          {...this.state.fields}
          onChange={this.onChange}
          onSearch={this.onSearch}
          onSkip={this.onSkip}
        />
        <List
          options={options}
          initials={initials}
          params={this.state.fields}
          onStop={this.onStop}
          onSkip={this.onSkip}
          onKick={this.onKick}
          onUpdate={this.onUpdate}
        />
      </Fragment>
    )
  }

}

Players.propTypes = {
  login: PropTypes.object,
  player: PropTypes.object,
  products: PropTypes.object,
  fetchPlayers: PropTypes.func,
  clearHeadImage: PropTypes.func,
  kickoutPlayer: PropTypes.func,
  skipNovice: PropTypes.func,
  skipNovices: PropTypes.func,
  modifyNickname: PropTypes.func,
  fetchProductsMap: PropTypes.func,
}
