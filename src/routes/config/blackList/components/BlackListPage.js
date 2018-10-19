import React, {Component} from 'react'
import PropTypes from 'prop-types'
import List from './List'
import { Divider } from 'antd'

export default class BlackListPage extends Component {


    render() {
      return (
        <div>
          <Divider type='vertical' />
          <List
            data={this.props.blacklist}
          />
        </div>
      )
    }

  // 初始化
  componentWillMount() {
    const {fetchGet} = this.props
    fetchGet()
  }
  componentDidMount() {
    // console.log('componentDidMount--')
  }

  // 进行中
  // previous
  componentWillReceiveProps(nextProps, nextState) {
    // console.log('componentWillReceiveProps--', nextProps.sync.fetching)
  }
  shouldComponentUpdate(nextProps, nextState) {
    // console.log('shouldComponentUpdate--', nextProps.sync.fetching)
    return true
  }
  componentWillUpdate(nextProps, nextState) {
    // console.log('componentWillUpdate--', nextProps.sync.fetching)
  }

  // 销毁
  componentWillUnmount() {
    // console.log('componentWillUnmount--')
  }
}

BlackListPage.propTypes = {
  blacklist: PropTypes.object,
  fetchGet: PropTypes.func.isRequired
}
