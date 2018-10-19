import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Form, Input, InputNumber, Cascader, Button, Tooltip, Icon, Row, Col, Card } from 'antd'
import _ from 'lodash'
const FormItem = Form.Item

class RechargeModal extends Component {
  state = {
    currentItem: {},
    list: ''
  }

  componentWillMount() {
    const { currentItem } = this.props.onModalLoad()

    this.setState({
      currentItem: currentItem
    })
  }

  handleSubmit = e => {
    e.preventDefault()
    this.props.form.validateFieldsAndScroll((err, values) => {
      const { initials } = this.props
      if (!err) {
        let data = {}
        data.playerId = values.playerId
        data.templateId = values.templateId
        if (values.level) data.level = values.level
        data.purchaseId = values.purchases[0]
        data.count = values.count

        let posts = {
          form: data,
          path: initials.paths
        }
        this.props.onRecharge(posts)
        this.props.onSubmitting()
      }
    })
  }

  handleChange = (e) => {
    this.setState({
      list: e[0]
    })
  }

  render() {
    const { form: { getFieldDecorator }, options } = this.props
    let detail = this.state.currentItem
    let groupList = []
    _.map(options.pay.groupList, (v, i) => {
      if (String(v.rechargeId) === this.state.list) {
        groupList = v.rechargeList
      }
    })

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

    const tailFormItemLayout = {
      wrapperCol: {
        xs: { span: 24, offset: 0 },
        sm: { span: 14, offset: 6 }
      }
    }

    const itemsLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 8 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 }
      }
    }

    return (
      <Form onSubmit={this.handleSubmit}>
        <FormItem
          {...formItemLayout}
          label='玩家昵称'
        >
          {getFieldDecorator('nickname', {
            initialValue: detail.nickname || '',
            rules: [{ required: true, message: '请填写玩家昵称!' }]
          })(<Input placeholder='请填写玩家昵称' disabled />)}
        </FormItem>

        <FormItem
          {...formItemLayout}
          label='玩家 ID'
        >
          {getFieldDecorator('playerId', {
            initialValue: detail.playerId || '',
            rules: [{ required: true, message: '请填写玩家 ID!' }]
          })(
            <InputNumber
              placeholder='请填写玩家 ID'
              disabled
              style={{ width: '100%' }}
            />
          )}
        </FormItem>

        <FormItem
          {...formItemLayout}
          label={
            <span>
              <Tooltip title='模板 ID 说明：活动礼包类的充值，需要查找对应活动开启的模板 Id，非活动礼包类的充值，模板 Id 填 -1'>
                模板 ID&nbsp;<Icon type='question-circle-o' />
              </Tooltip>
            </span>
          }
        >
          {getFieldDecorator('templateId', {
            initialValue: -1,
            rules: [{ required: true, message: '请填写模板 ID!' }]
          })(<InputNumber placeholder='请填写模板 ID' style={{ width: '100%' }} />)}
        </FormItem>

        <FormItem
          {...formItemLayout}
          label='购买物品'
        >
          {getFieldDecorator('purchases', {
            rules: [{ type: 'array', required: true, message: '请选择购买物品' }]
          })(
            <Cascader
              options={options.purchases}
              showSearch
              expandTrigger='hover'
              placeholder='请选择购买物品'
              onChange={this.handleChange}
            />
          )}
        </FormItem>

        <FormItem
          {...formItemLayout}
          label={
            <span>
              <Tooltip title='物品数量说明：默认值为 1，取值范围 0 ~ 50，超出该范围则取默认值 1'>
                物品数量&nbsp;<Icon type='question-circle-o' />
              </Tooltip>
            </span>
          }
        >
          {getFieldDecorator('count', {
            initialValue: 1,
            rules: [{ required: true, message: '请填写物品数量!' }]
          })(
            <InputNumber
              min={0}
              formatter={value => (value >= 0 && value <= 50 ? value : 1)}
              placeholder='请填写物品数量'
              style={{ width: '100%' }}
            />
          )}
        </FormItem>

        <FormItem {...tailFormItemLayout}>
          <Button type='primary' htmlType='submit'>提交</Button>
        </FormItem>

        {
          groupList.length > 0 &&
          <Card style={{ marginBottom: 50 }} title='礼包内容' bordered={false} noHovering={false}>
            {
              _.map(groupList, v => {
                return (
                  <Row key={v.rechargeId} type='flex' justify='center'>
                    <Col xs={{span: 24, offset: 0}} sm={{span: 8}}>
                      <FormItem {...itemsLayout} label='物品名称'>
                        {getFieldDecorator('itemId', {
                          initialValue: [String(v.rechargeId)]
                        })(
                          <Cascader
                            options={options.purchases.list}
                            disabled
                          />
                        )}
                      </FormItem>
                    </Col>
                    <Col xs={{span: 24, offset: 0}} sm={{span: 8}}>
                      <FormItem {...itemsLayout} label='物品数量'>
                        {getFieldDecorator('itemNumber', {
                          initialValue: v.count
                        })(
                          <Input
                            disabled
                          />
                        )}
                      </FormItem>
                    </Col>
                  </Row>
                )
              })
            }
          </Card>
        }
      </Form>
    )
  }
}

RechargeModal.propTypes = {
  form: PropTypes.object,
  options: PropTypes.object,
  initials: PropTypes.object,
  onModalLoad: PropTypes.func,
  onSubmitting: PropTypes.func,
  onRecharge: PropTypes.func
}

const Modal = Form.create()(RechargeModal)

export default Modal
