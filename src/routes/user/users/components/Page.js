import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import _ from 'lodash'

import Filter from './Filter'
import List from './List'
import {
  fetchUsers,
  createUser,
  updateUser,
  deleteUser,
  updateUserPass,
  updateUserRole,
  fetchRoles,
  keepPermission
} from '../../permissions/modules/Module'

const mapDispatchToProps = {
  fetchUsers,
  createUser,
  updateUser,
  deleteUser,
  updateUserPass,
  updateUserRole,
  fetchRoles,
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

  componentWillMount() {
    this.props.fetchUsers()
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
    this.props.createUser(values)
  }

  onUpdate = (values) => {
    if (values.handle === 'update') {
      this.props.updateUser(values)
    } else if (values.handle === 'pass') {
      this.props.updateUserPass(values)
    } else {
      this.props.updateUserRole(values)
    }
  }

  onDelete = (values) => {
    this.props.deleteUser(values)
  }

  onSearch = (values) => {
    if (values.handle === 'SEARCH') {
      this.props.fetchUsers()
      this.props.fetchRoles()
    }
  }

  _roleReduce = (options) => {
    return _.reduce(options, (result, option) => {
      result.push({
        label: `${option.name} (${option.id})`,
        value: String(option.id),
        key: String(option.id)
      })
      return result
    }, [])
  }

  render() {
    const { permission, login } = this.props
    const options = {
      permission,
      login,
      authorize: login.authorize,
      authRoutes: login.authRoutes,
      role: {
        list: this._roleReduce(permission.roles)
      }
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
  fetchUsers: PropTypes.func,
  createUser: PropTypes.func,
  updateUser: PropTypes.func,
  deleteUser: PropTypes.func,
  fetchRoles: PropTypes.func,
  updateUserPass: PropTypes.func,
  updateUserRole: PropTypes.func
}
