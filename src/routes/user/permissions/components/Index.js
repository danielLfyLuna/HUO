import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'

import Filter from './Filter'
import List from './List'
import { fetchPermissions, keepPermission } from '../modules/Module'

const mapDispatchToProps = {
  fetchPermissions,
  keepPermission
}

const mapStateToProps = (state) => ({
  permission: state.permission,
  login: state.islogin
})

@connect(mapStateToProps, mapDispatchToProps)
export default class Permissions extends Component {
  state = {
    fields: {},
    initials: {
      conf: {
        renderState: true,
        locale: false
      },
      map: {},
      enum: {}
    }
  }

  componentWillMount() {
    this.props.fetchPermissions()
  }

  onSearch = (values) => {
    if (values.handle === 'SEARCH') {
      this.props.fetchPermissions()
    }
  }

  render() {
    const { permission, login } = this.props
    const options = {
      permission,
      login,
      authorize: login.authorize,
      authRoutes: login.authRoutes
    }
    const initials = this.state.initials

    return (
      <Fragment>
        <Fragment>
          <Filter
            options={options}
            initials={initials}
            onSearch={this.onSearch}
          />
          <List
            options={options}
            initials={initials}
          />
        </Fragment>
      </Fragment>
    )
  }
}

Permissions.propTypes = {
  permission: PropTypes.object,
  login: PropTypes.object,
  fetchPermissions: PropTypes.func
}
