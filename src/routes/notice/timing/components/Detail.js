import React, { Component } from 'react'
import PropTypes from 'prop-types'
import _ from 'lodash'


export default class NoticesTimingModal extends Component {

  static propTypes = {
    details: PropTypes.object
  }

  state = {
    data: {
      title: '标题',
      content: '内容',
      type: '公告类型',
      circleType: '循环类型',
      count: '执行次数/总次数',
      open: '状态',
      interval: '时间间隔',
      lastExecTime: '最近一次执行时间',
      createTime: '创建时间',
      endTime: '结束时间',
      productId: '产品ID',
      serverIds: '服务器ID'
    },
    list: {
      type: {
        1: '定时公告',
        100: '跑马灯公告'
      },
      circleType: {
        1: '无限循环',
        2: '限定次数',
        3: '限定时间'
      },
      intervalUnit: {
        1: '秒',
        2: '分钟',
        3: '小时',
        4: '天',
        5: '永久'
      }
    }
  }

  render() {
    const styleTitle = {
      background: '#f7f7f7',
      fontWeight: 800,
      width: '130px',
      textAlign: 'right',
      wordBreak: 'break-all',
      padding: '6px 16px 6px 0',
      display: 'inline-block'
    }
    const styleContent = {
      wordBreak: 'break-all',
      padding: '6px 16px',
      display: 'inline-block'
    }
    let arr = []
    _.map(this.props.details, (v, i) => {
      if (i === 'type') {
        arr.push(
          <li key={i} style={{ borderBottom: '1px solid #e9e9e9', borderLeft: '1px solid #e9e9e9' }}>
            <span style={styleTitle}>{this.state.data[i]}</span>
            <span style={styleContent}>{this.state.list.type[v]}</span>
          </li>
        )
        return
      }
      if (i === 'circleType') {
        arr.push(
          <li key={i} style={{ borderBottom: '1px solid #e9e9e9', borderLeft: '1px solid #e9e9e9' }}>
            <span style={styleTitle}>{this.state.data[i]}</span>
            <span style={styleContent}>{this.state.list.circleType[v]}</span>
          </li>
        )
        return
      }
      if (i === 'interval') {
        arr.push(
          <li key={i} style={{ borderBottom: '1px solid #e9e9e9', borderLeft: '1px solid #e9e9e9' }}>
            <span style={styleTitle}>{this.state.data[i]}</span>
            <span style={styleContent}>{`${v}${this.state.list.intervalUnit[this.props.details.intervalUnit]}`}</span>
          </li>
        )
        return
      }
      if (i === 'open') {
        arr.push(
          <li key={i} style={{ borderBottom: '1px solid #e9e9e9', borderLeft: '1px solid #e9e9e9' }}>
            <span style={styleTitle}>{this.state.data[i]}</span>
            <span style={styleContent}>{v ? '开启' : '停止'}</span>
          </li>
        )
        return
      }

      if (this.state.data[i]) {
        arr.push(
          <li key={i} style={{ borderBottom: '1px solid #e9e9e9', borderLeft: '1px solid #e9e9e9' }}>
            <span style={styleTitle}>{this.state.data[i]}</span>
            <span style={styleContent}>{v}</span>
          </li>
        )
      }
    })

    return (
      <div style={{margin: '0 30px'}}>
        <ul
          style={{
            listStyleType: 'none',
            borderBottom: '1px solid #e9e9e9',
            borderTop: '1px solid #e9e9e9',
            borderRight: '1px solid #e9e9e9',
            paddingLeft: 0
          }}
        >
          {arr}
        </ul>
      </div>
    )
  }
}
