import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import Filter from './Filter'
import List from './List'
import {
  fetchAuthentics,
  addAuthentic,
  delAuthentic
} from './../modules/Module'

const mapDispatchtoProps = {
  fetchAuthentics,
  addAuthentic,
  delAuthentic
}

const mapStateToProps = (state) => ({
  authentic: state.authentic,
  login: state.islogin
})
// connect 会把State和dispatch转换成props传递给子组件
@connect(mapStateToProps, mapDispatchtoProps)

export default class Authentics extends Component {

  onGet = () => {
    this.props.fetchAuthentics()
  }

  onCreate = (values) => {
    this.props.addAuthentic(values)
  }

  onDelete = (values) => {
    this.props.delAuthentic(values)
  }

  render() {
    const { authentic, login } = this.props
    const options = {
      authentic,
      login,
      authorize: login.authorize
    }

    return (
      <div>
        <div style={{ marginBottom: 6 }}>
          <Filter
            options={options}
            onCreate={this.onCreate}
            onGet={this.onGet}
          />
          <List
            options={options}
            onDelete={this.onDelete}
          />
        </div>
      </div>
    )
  }
}

Authentics.propTypes = {
  authentic: PropTypes.object,
  login: PropTypes.object,
  fetchAuthentics: PropTypes.func,
  addAuthentic: PropTypes.func,
  delAuthentic: PropTypes.func
}
