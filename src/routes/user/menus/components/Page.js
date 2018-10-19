import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import _ from 'lodash'

import Filter from './Filter'
import List from './List'
import {
  fetchMenus,
  createMenu,
  updateMenu,
  deleteMenu,
  fetchPermissions,
  updateMenuRoute,
  updateMenuPermit,
  keepPermission
} from '../../permissions/modules/Module'

const mapDispatchToProps = {
  fetchMenus,
  createMenu,
  updateMenu,
  deleteMenu,
  fetchPermissions,
  updateMenuRoute,
  updateMenuPermit,
  keepPermission
}

const mapStateToProps = (state) => ({
  permission: state.permission,
  login: state.islogin
})

@connect(mapStateToProps, mapDispatchToProps)
export default class Page extends Component {
  state = {
    fields: {},
    initials: {
      params: {},
      conf: {
        renderState: true,
        locale: false
      },
      map: {},
      enum: {}
    }
  }

  _uriReduce = (options) => {
    let first = []
    _.reduce(options, (result, option, index) => {
      let second = []
      _.reduce(option.subPermission, (res, opt, inx) => {
        res.push({label: `${opt.name} (${opt.id})`, value: `${opt.id}`, key: `${opt.id}`})
        return res
      }, second)
      result.push({label: `${option.name} (${option.id})`, value: `${option.id}`, key: `${option.id}`, children: second})
      return result
    }, first)
    return first
  }

  componentWillMount() {
    this.props.fetchMenus()
    this.props.fetchPermissions()
  }

  onRender = (nextInitials) => {
    this.state.initials.conf.renderState = nextInitials.renderState
  }

  // 双向数据绑定
  onChange = (fieldsValue) => {
    this.setState({
      fields: { ...this.state.fields, ...fieldsValue }
    })
  }

  onCreate = (values) => {
    this.props.createMenu(values)
  }

  onUpdate = (values) => {
    if (values.handle === 'update') {
      this.props.updateMenu(values)
    } else if (values.handle === 'route') {
      this.props.updateMenuRoute(values)
    } else if (values.handle === 'uri') {
      this.props.updateMenuPermit(values)
    }
  }

  onDelete = (values) => {
    this.props.deleteMenu(values)
  }

  onSearch = (values) => {
    if (values.handle === 'SEARCH') {
      this.props.fetchMenus()
      this.props.fetchPermissions()
    }
  }

  render() {
    const { permission, login } = this.props
    const options = {
      permission,
      login,
      uri: {
        list: this._uriReduce(permission.permissions)
      },
      authorize: login.authorize,
      authRoutes: login.authRoutes
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
          onCreate={this.onCreate}
        />
        <List
          options={options}
          initials={initials}
          onUpdate={this.onUpdate}
          onCreate={this.onCreate}
          onDelete={this.onDelete}
          onRender={this.onRender}
        />
      </Fragment>
    )
  }
}

Page.propTypes = {
  permission: PropTypes.object,
  login: PropTypes.object,
  fetchMenus: PropTypes.func,
  createMenu: PropTypes.func,
  updateMenu: PropTypes.func,
  deleteMenu: PropTypes.func,
  fetchPermissions: PropTypes.func,
  updateMenuRoute: PropTypes.func,
  updateMenuPermit: PropTypes.func
}
