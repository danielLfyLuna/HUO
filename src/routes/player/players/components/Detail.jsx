import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'
// import _ from 'lodash'
// import R from 'ramda'
import moment from 'moment'
import { Form, Input } from 'antd'

const FormItem = Form.Item

class DetailForms extends Component {

  state = {
    currentItem: {},
    modalType: ''
  }

  componentWillMount() {
    const { currentItem, modalType } = this.props.onModalLoad()

    this.setState({
      currentItem: currentItem,
      modalType: modalType
    })
  }

  render() {
    const { getFieldDecorator } = this.props.form

    const detail = this.state.currentItem

    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 6 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 12 }
      }
    }

    return (
      <Fragment>
        <Form>
          <FormItem
            {...formItemLayout}
            label='玩家 ID'
          >
            {getFieldDecorator('playerId', {
              initialValue: detail.playerId,
            })(
              <Input disabled />
            )}
          </FormItem>

          <FormItem
            {...formItemLayout}
            label='玩家昵称'
          >
            {getFieldDecorator('nickname', {
              initialValue: detail.nickname,
            })(
              <Input disabled />
            )}
          </FormItem>

          <FormItem
            {...formItemLayout}
            label='平台 ID'
          >
            {getFieldDecorator('platformId', {
              initialValue: detail.platformId,
            })(
              <Input disabled />
            )}
          </FormItem>

          <FormItem
            {...formItemLayout}
            label='渠道 ID'
          >
            {getFieldDecorator('channelUid', {
              initialValue: detail.channelUid,
            })(
              <Input disabled />
            )}
          </FormItem>

          <FormItem
            {...formItemLayout}
            label='头像'
          >
            {getFieldDecorator('headImageUrl', {
              initialValue: detail.headImageUrl,
            })(
              <Input disabled />
            )}
          </FormItem>

          <FormItem
            {...formItemLayout}
            label='等级'
          >
            {getFieldDecorator('level', {
              initialValue: detail.level,
            })(
              <Input disabled />
            )}
          </FormItem>

          <FormItem
            {...formItemLayout}
            label='性别'
          >
            {getFieldDecorator('gender', {
              initialValue: detail.gender,
            })(
              <Input disabled />
            )}
          </FormItem>

          <FormItem
            {...formItemLayout}
            label='职业'
          >
            {getFieldDecorator('job', {
              initialValue: detail.job,
            })(
              <Input disabled />
            )}
          </FormItem>

          <FormItem
            {...formItemLayout}
            label='战力'
          >
            {getFieldDecorator('fightCapacity', {
              initialValue: detail.fightCapacity,
            })(
              <Input disabled />
            )}
          </FormItem>

          <FormItem
            {...formItemLayout}
            label='流通元宝'
          >
            {getFieldDecorator('coin', {
              initialValue: detail.coin,
            })(
              <Input disabled />
            )}
          </FormItem>

          <FormItem
            {...formItemLayout}
            label='元宝'
          >
            {getFieldDecorator('coinToken', {
              initialValue: detail.coinToken,
            })(
              <Input disabled />
            )}
          </FormItem>

          <FormItem
            {...formItemLayout}
            label='黄金'
          >
            {getFieldDecorator('gold', {
              initialValue: detail.gold,
            })(
              <Input disabled />
            )}
          </FormItem>

          <FormItem
            {...formItemLayout}
            label='皇宫宝藏积分'
          >
            {getFieldDecorator('lotteryScore', {
              initialValue: detail.lotteryScore,
            })(
              <Input disabled />
            )}
          </FormItem>

          <FormItem
            {...formItemLayout}
            label='技能兑换石'
          >
            {getFieldDecorator('skillStone', {
              initialValue: detail.skillStone,
            })(
              <Input disabled />
            )}
          </FormItem>

          <FormItem
            {...formItemLayout}
            label='经验'
          >
            {getFieldDecorator('curExp', {
              initialValue: detail.curExp,
            })(
              <Input disabled />
            )}
          </FormItem>

          <FormItem
            {...formItemLayout}
            label='VIP 等级'
          >
            {getFieldDecorator('vipLevel', {
              initialValue: detail.vipLevel,
            })(
              <Input disabled />
            )}
          </FormItem>

          <FormItem
            {...formItemLayout}
            label='联盟'
          >
            {getFieldDecorator('alliance', {
              initialValue: detail.alliance,
            })(
              <Input disabled />
            )}
          </FormItem>

          <FormItem
            {...formItemLayout}
            label='联盟坐标'
          >
            {getFieldDecorator('alliancePos', {
              initialValue: detail.alliancePos,
            })(
              <Input disabled />
            )}
          </FormItem>

          <FormItem
            {...formItemLayout}
            label='个人主城'
          >
            {getFieldDecorator('personalPos', {
              initialValue: detail.personalPos,
            })(
              <Input disabled />
            )}
          </FormItem>

          <FormItem
            {...formItemLayout}
            label='体力'
          >
            {getFieldDecorator('energy', {
              initialValue: detail.energy,
            })(
              <Input disabled />
            )}
          </FormItem>

          <FormItem
            {...formItemLayout}
            label='月卡到期时间'
          >
            {getFieldDecorator('monthCardEndTime', {
              initialValue: detail.monthCardEndTime == 0 ? detail.monthCardEndTime : moment(detail.monthCardEndTime).format('YYYY-MM-DD HH:mm:ss'),
            })(
              <Input disabled />
            )}
          </FormItem>

          <FormItem
            {...formItemLayout}
            label='周卡到期时间'
          >
            {getFieldDecorator('weekCardEndTime', {
              initialValue: detail.weekCardEndTime == 0 ? detail.weekCardEndTime : moment(detail.weekCardEndTime).format('YYYY-MM-DD HH:mm:ss'),
            })(
              <Input disabled />
            )}
          </FormItem>

          <FormItem
            {...formItemLayout}
            label='创建时间'
          >
            {getFieldDecorator('createDate', {
              initialValue: moment(detail.createDate).format('YYYY-MM-DD HH:mm:ss'),
            })(
              <Input disabled />
            )}
          </FormItem>

          <FormItem
            {...formItemLayout}
            label='最近登录'
          >
            {getFieldDecorator('lastLoginDate', {
              initialValue: moment(detail.lastLoginDate).format('YYYY-MM-DD HH:mm:ss'),
            })(
              <Input disabled />
            )}
          </FormItem>

          <FormItem
            {...formItemLayout}
            label='占领城池'
          >
            {getFieldDecorator('occupyCity', {
              initialValue: detail.occupyCity,
            })(
              <Input disabled />
            )}
          </FormItem>

          <FormItem
            {...formItemLayout}
            label='禁言信息'
          >
            {getFieldDecorator('forbieData', {
              initialValue: detail.forbieData,
            })(
              <Input disabled />
            )}
          </FormItem>

          <FormItem
            {...formItemLayout}
            label='将领信息'
          >
            {getFieldDecorator('soldiers', {
              initialValue: detail.soldiers,
            })(
              <Input disabled />
            )}
          </FormItem>

          <FormItem
            {...formItemLayout}
            label='充值信息'
          >
            {getFieldDecorator('payinfo', {
              initialValue: detail.payinfo,
            })(
              <Input disabled />
            )}
          </FormItem>

          <FormItem
            {...formItemLayout}
            label='登录状态'
          >
            {getFieldDecorator('online', {
              initialValue: detail.online,
            })(
              <Input disabled />
            )}
          </FormItem>
        </Form>
      </Fragment>

    )
  }
}

DetailForms.propTypes = {
  form: PropTypes.object,
  // options: PropTypes.object,
  // initials: PropTypes.object,
  onModalLoad: PropTypes.func,
}

const Details = Form.create()(DetailForms)

export default Details
