import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Tag } from 'antd'
import _ from 'lodash'
import moment from 'moment'
import './Style.css'


// 推荐在入口文件全局设置 locale
import 'moment/locale/zh-cn'
moment.locale('zh-cn')
const CheckableTag = Tag.CheckableTag

export default class aqList extends Component {

  static propTypes = {
    // login: PropTypes.object.isRequired,
    data: PropTypes.object.isRequired
  }

  state = {
    list: []
  }

  handleChange = (v, checked) => {
    let cv = []
    if (checked) {
      cv = [...this.state.list, v]
    }
    else {
      cv = _.filter(this.state.list, i => i !== v)
    }
    this.setState({
      list: cv
    })
  }

  componentWillReceiveProps() {
    this.setState({
      list: []
    })
  }

  render() {
    const data = this.props.data.list

    return (
      <div style={{ marginTop: '16px' }}>
        {
          _.map(data, (v, i) => {
            return (
              <div key={i} style={{margin: '0 5px 5px 0', display: 'inline-block'}}>
                <CheckableTag
                  key={v}
                  checked={this.state.list.indexOf(v) > -1}
                  onChange={checked => this.handleChange(v, checked)}
                >
                  <div style={{fontSize: '16px'}}>
                    {v}
                  </div>
                </CheckableTag>
              </div>
            )
          })
        }
      </div>
    )
  }

}
