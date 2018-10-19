import React, { Component } from 'react'
import PropTypes from 'prop-types'
import _ from 'lodash'

import { Collapse, Button } from 'antd'
import '../../activities/components/Style.css'

const Panel = Collapse.Panel

export default class List extends Component {
  constructor(props) {
    super(props)
    this.excels = {
      functionId: '类型',
      name: '名称',
      templateId: '模板ID',
      ownCreateLog: '日志',
      // startTime: '开启时间',
      // endTime: '结束时间',
      // updateTime: '更新时间',
      // adminUserName: '操作人',
      state: '状态'
    }
    this.itemExcels = {
      activityItemId: '活动奖励id',
      name: '活动名称',
      description: '描述',
      clientValue: '客户端显示值',
      coin: '钻石数量',
      coinToken: '系统赠送钻石',
      level: '等级',
      rmb: '人民币',
      targetValue: '目标值',
      vipValue: 'vip等级'
    }
    this.logExcels = {
      id: 'id',
      adminUserName: '操作人',
      createTime: '操作时间',
      groupId: '组id',
      productId: '产品id',
      serverId: '服务器id',
      templateId: '模板id',
      success: '是否成功',
      msg: '操作提示信息'
    }
    this.activityStates = {
      0: '初始化',
      1: '预热，玩家可见，还未开始',
      2: '开启，正在进行',
      3: '活动结束，等待处理结果',
      4: '结果处理完毕',
      5: '运营人员强制下线'
    }
  }

  state = {
    isPanel: false
  }

  handlePanel = () => {
    this.setState({
      isPanel: !this.state.isPanel
    })
  }

  render() {
    const { data, goods } = this.props
    const excels = this.excels
    const itemExcels = this.itemExcels
    const logExcels = this.logExcels
    const activityStates = this.activityStates

    let arr = []
    let itemArrs = []
    let logArrs = []
    let panelList = []

    const styleTitle = {
      background: '#f7f7f7',
      fontWeight: 800,
      width: '110px',
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

    _.forEach(data, function(value, key, collection) {
      if (value === null) {
        return
      }
      if (!excels[key]) {
        return
      }
      if (key === 'openCondition') {
        arr.push(
          <li key={key} style={{ borderBottom: '1px solid #e9e9e9', borderLeft: '1px solid #e9e9e9' }}>
            <span style={styleTitle}>开启条件</span>
            <span style={styleContent}>
              {value.desc}&nbsp;&nbsp;&nbsp;
              {
                value.type === 1001 ?
                  (<span>
                    <span style={{color: '#F81919'}}>开始时间:&nbsp;</span>{value.params.startTime === '-1' ? '永久' : value.params.startTime}&nbsp;&nbsp;&nbsp;
                    <span style={{color: '#F81919'}}>结束时间:&nbsp;</span>{value.params.endTime === '-1' ? '永久' : value.params.endTime}
                  </span>)
                : value.type === 1002 ?
                  (<span>
                    开服<span style={{color: '#F81919'}}>&nbsp;{value.params.afterDays}&nbsp;</span>天后,&nbsp;&nbsp;&nbsp;
                    持续<span style={{color: '#F81919'}}>&nbsp;{value.params.lastDays === '-1' ? '永久' : `${value.params.lastDays} 天`}&nbsp;</span>
                  </span>)
                : JSON.stringify(value.params)
              }
            </span>
          </li>
        )
        return
      }
      if (key === 'visibleCondition') {
        arr.push(
          <li key={key} style={{ borderBottom: '1px solid #e9e9e9', borderLeft: '1px solid #e9e9e9' }}>
            <span style={styleTitle}>可见条件</span>
            <span style={styleContent}>
              {value.desc}&nbsp;&nbsp;&nbsp;
              {
                value.type === 10002 ?
                  (<span>
                    玩家创建后<span style={{color: '#F81919'}}>&nbsp;{value.params.afterDays === '-1' ? '永久' : `${value.params.afterDays}天开启`}&nbsp;</span>,&nbsp;&nbsp;
                    持续<span style={{color: '#F81919'}}>&nbsp;{value.params.lastDays === '-1' ? '永久' : `${value.params.lastDays} 天`}&nbsp;</span>
                  </span>)
                : value.type === 10004 ?
                  <span><span style={{color: '#F81919'}}>持续天数:&nbsp;</span>{value.params.lastDays}</span>
                : JSON.stringify(value.params)
              }
            </span>
          </li>
        )
        return
      }

      if (key === 'state') {
        arr.push(
          <li key={key} style={{ borderBottom: '1px solid #e9e9e9', borderLeft: '1px solid #e9e9e9' }}>
            <span style={styleTitle}>{excels[key]}</span>
            <span style={styleContent}>{activityStates[value]}</span>
          </li>
        )
        return
      }
      if (key === 'ownCreateLog') {
        arr.push(
          <li key={key} style={{ borderBottom: '1px solid #e9e9e9', borderLeft: '1px solid #e9e9e9' }}>
            <span style={styleTitle}>操作人</span>
            <span style={styleContent}>{value.adminUserName}</span>
          </li>
        )
        return
      }
      arr.push(
        <li key={key} style={{ borderBottom: '1px solid #e9e9e9', borderLeft: '1px solid #e9e9e9' }}>
          <span style={styleTitle}>{excels[key]}</span>
          <span style={styleContent}>{value}</span>
        </li>
      )
    })

    if (data.activityItems) {
      _.forEach(data.activityItems, (v, key) => {
        let itemArr = []
        _.forEach(v, (val, k, col) => {
          if (!itemExcels[k]) {
            return
          }
          itemArr.push(
            <li key={`item-${key}-${k}`} style={{ borderBottom: '1px solid #e9e9e9', borderLeft: '1px solid #e9e9e9' }}>
              <span style={styleTitle}>{itemExcels[k]}</span>
              <span style={styleContent}>{val}</span>
            </li>
          )
        })
        if (v.rewardList) {
          _.forEach(v.rewardList, (val, k) => {
            itemArr.push(
              <li key={`item-reward${key}-${k}`} style={{ borderBottom: '1px solid #e9e9e9', borderLeft: '1px solid #e9e9e9' }}>
                <div style={{width: '50%', display: 'inline-block'}}>
                  <span style={{...styleTitle, background: '#88CFFF'}}>道具名称</span>
                  <span style={styleContent}>{goods ? (goods[val.type][val.templateId] ? goods[val.type][val.templateId] : `找不到该道具(id:${val.templateId})`) : '道具列表获取失败'}</span>
                </div>
                <div style={{width: '50%', display: 'inline-block'}}>
                  <span style={{...styleTitle, background: '#88CFFF'}}>道具数量</span>
                  <span style={styleContent}>{val.num}</span>
                </div>
              </li>
            )
          })
        }
        itemArrs.push(itemArr)
        panelList.push(`itemCol-${key}`)
      })
    }

    if (data.batchCreateLogs) {
      _.forEach(data.batchCreateLogs, (v, key) => {
        let itemArr = []
        _.forEach(v, (val, k, col) => {
          if (!logExcels[k]) {
            return
          }
          if (k == 'success') {
            itemArr.push(
              <li key={`log-${key}-${k}`} style={{ borderBottom: '1px solid #e9e9e9', borderLeft: '1px solid #e9e9e9' }}>
                <span style={styleTitle}>{logExcels[k]}</span>
                <span style={styleContent}>{val ? '是' : '否'}</span>
              </li>
            )
            return
          }
          itemArr.push(
            <li key={`log-${key}-${k}`} style={{ borderBottom: '1px solid #e9e9e9', borderLeft: '1px solid #e9e9e9' }}>
              <span style={styleTitle}>{logExcels[k]}</span>
              <span style={styleContent}>{val}</span>
            </li>
          )
        })
        logArrs.push(itemArr)
      })
    }

    return (
      <div className='box-large' style={{ padding: '20px 40px' }}>
        <Collapse defaultActiveKey={['introduction', 'content']}>
          <Panel key='introduction' header='活动详情'>
            <ul
              className='box-list'
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
          </Panel>
          <Panel key='content' header='礼包详情'>
            <div className='panelBtn'><Button onClick={this.handlePanel}>{this.state.isPanel ? '解除锁定' : '全部展开'}</Button></div>
            <Collapse
              bordered={false}
              {...(this.state.isPanel && {activeKey: panelList})}
            >
              {
                _.map(itemArrs, (v, k) => {
                  return (
                    <Panel key={`itemCol-${k}`} header={`礼包${k + 1}`}>
                      <ul
                        className='box-list'
                        style={{
                          listStyleType: 'none',
                          borderBottom: '1px solid #e9e9e9',
                          borderTop: '1px solid #e9e9e9',
                          borderRight: '1px solid #e9e9e9',
                          paddingLeft: 0
                        }}
                      >
                        {v}
                      </ul>
                    </Panel>
                  )
                })
              }
            </Collapse>
          </Panel>
          <Panel key='log' header='活动模板日志数据'>
            <Collapse
              bordered={false}
            >
              {
                _.map(logArrs, (v, k) => {
                  return (
                    <Panel key={`itemCol-${k}`} header={`活动模板日志数据${k + 1}`}>
                      <ul
                        className='box-list'
                        style={{
                          listStyleType: 'none',
                          borderBottom: '1px solid #e9e9e9',
                          borderTop: '1px solid #e9e9e9',
                          borderRight: '1px solid #e9e9e9',
                          paddingLeft: 0
                        }}
                      >
                        {v}
                      </ul>
                    </Panel>
                  )
                })
              }
            </Collapse>
          </Panel>
        </Collapse>
      </div>
    )
  }
}

List.propTypes = {
  goods: PropTypes.object,
  data: PropTypes.object
}
