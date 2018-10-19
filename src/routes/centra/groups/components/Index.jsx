import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'

import Filter from './Filter'
import List from './List'
import { fetchGroups, createGroup, updateGroup, deleteGroup } from '../modules/Module'

const mapDispatchtoProps = {
  fetchGroups,
  createGroup,
  updateGroup,
  deleteGroup
}

const mapStateToProps = (state) => ({
  group: state.group,
  login: state.islogin
})

@connect(mapStateToProps, mapDispatchtoProps)
export default class Groups extends Component {

  state = {
    initials: {
      map: {
        verifyTypes: { 0: '不验证', 1: '验证' }
      },
      enum: {
        verifyTypes: [
          { label: '不验证', value: 0 },
          { label: '验证', value: 1 }
        ]
      }
    }
  }

  componentWillMount() {
    this.props.fetchGroups()
  }

  onSearch = () => {
    this.props.fetchGroups()
  }

  onDelete = (fields) => {
    this.props.deleteGroup(fields)
  }

  onCreate = (fields) => {
    this.props.createGroup(fields)
  }

  onUpdate = (fields) => {
    this.props.updateGroup(fields)
  }

  render() {
    const { group, login } = this.props
    const options = {
      group,
      login
    }
    const initials = this.state.initials

    return (
      <Fragment>
        <Filter
          options={options}
          initials={initials}
          onSearch={this.onSearch}
          onCreate={this.onCreate}
        />
        <List
          options={options}
          initials={initials}
          onUpdate={this.onUpdate}
          onDelete={this.onDelete}
         />
      </Fragment>
    )
  }
}

Groups.propTypes = {
  login: PropTypes.object,
  group: PropTypes.object,
  updateGroup: PropTypes.func,
  createGroup: PropTypes.func,
  deleteGroup: PropTypes.func,
  fetchGroups: PropTypes.func
}
