import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Form, Input, InputNumber, Cascader, Button, Tooltip, Icon } from 'antd'

const FormItem = Form.Item


class RechargeModal extends Component {
  state = {
    currentItem: {}
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
      if (!err) {
        let data = {
          path: {
            productId: this.props.initials.paths.productId,
            serverId: this.props.initials.paths.serverId
          },
          form: {
            playerId: values.playerId,
            purchaseId: values.purchases[0],
            count: values.count
          }
        }
        this.props.onSendMonthCard(data)
        this.props.onSubmitting()
      }
    })
  }

  render() {
    const { form: { getFieldDecorator }, options } = this.props
    let detail = this.state.currentItem

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

    return (
      <Form onSubmit={this.handleSubmit}>
        <FormItem
          {...formItemLayout}
          label='玩家昵称'
        >
          {getFieldDecorator('nickname', {
            initialValue: detail.nickname ? detail.nickname : '',
            rules: [{ required: true, message: '请填写玩家昵称!' }]
          })(<Input placeholder='请填写玩家昵称' disabled />)}
        </FormItem>

        <FormItem
          {...formItemLayout}
          label='玩家 ID'
          >
          {getFieldDecorator('playerId', {
            initialValue: detail.playerId ? detail.playerId : '',
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
          label='购买物品'
          >
          {getFieldDecorator('purchases', {
            rules: [{ type: 'array', required: true, message: '请选择购买物品' }],
            initialValue: ['2001002']
          })(
            <Cascader
              options={options.purchases}
              disabled
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
              disabled
              min={0}
              formatter={value => (value >= 0 && value <= 50 ? value : 1)}
              placeholder='请填写物品数量'
              style={{ width: '100%' }}
            />
          )}
        </FormItem>

        <FormItem {...tailFormItemLayout}>
          <Button type='primary' htmlType='submit'>
            提交
          </Button>
        </FormItem>
      </Form>
    )
  }
}

RechargeModal.propTypes = {
  form: PropTypes.object,
  options: PropTypes.object,
  initials: PropTypes.object,
  onModalLoad: PropTypes.func,
  onSendMonthCard: PropTypes.func,
  onSubmitting: PropTypes.func
}

const Modal = Form.create()(RechargeModal)

export default Modal
