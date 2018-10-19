import React, {Component} from 'react'
import PropTypes from 'prop-types'
import { Form } from 'antd'
import List from './List'

export class SyncPage extends Component {

  static propTypes = {
    channel: PropTypes.object,
    fetchChannels: PropTypes.func.isRequired
  }


  render() {
    return (
      <div>
        <div style={{ marginBottom: 6 }}>
          <List
            data={this.props.channel}
           />
        </div>
      </div>
    )
  }

  // 初始化
  componentWillMount() {
    this.props.fetchChannels()
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

const Sync = Form.create()(SyncPage)

export default Sync
