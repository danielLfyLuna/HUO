import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Form, Input, InputNumber, Cascader, Button } from 'antd'
const FormItem = Form.Item
const { TextArea } = Input

class ForbidModal extends Component {
  state = {
    modal: {
      currentItem: {}
    }
  }

  componentWillMount() {
    const { currentItem } = this.props.onModalLoad()

    this.setState({
      currentItem: currentItem
    })
  }

  handleSubmit = (e) => {
    e.preventDefault()
    this.props.form.validateFieldsAndScroll((err, values) => {
      const { options, initials } = this.props
      if (!err) {
        let data = {}
        data.playerId = values.playerId
        data.reason = values.reason
        data.intervalUnit = values.intervalUnits[0]
        if (data.intervalUnit !== initials.conf.timeUnits.lasting) {
          data.interval = values.interval
        }
        data.forbidType = values.forbidTypes[0]
        data.manager = options.login.admin.userName

        let posts = {
          form: data,
          path: initials.products
        }

        this.props.onForbid(posts)
        this.props.onSubmitting()
      }
    })
  }

  render() {
    const { form: { getFieldDecorator }, initials } = this.props

    let detail = this.state.currentItem
    console.log(this.state)
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 8 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 12 }
      }
    }

    const tailFormItemLayout = {
      wrapperCol: {
        xs: { span: 24, offset: 0 },
        sm: { span: 14, offset: 8 }
      }
    }

    return (
      <Form onSubmit={this.handleSubmit}>
        <FormItem
          {...formItemLayout}
          label='玩家 ID'
        >
          {getFieldDecorator('playerId', {
            initialValue: detail.playerId || '',
            rules: [{ required: true, message: '请填写玩家 ID!' }]
          })(
            <InputNumber placeholder='请填写玩家 ID' disabled style={{ width: '100%' }} />
          )}
        </FormItem>

        <FormItem
          {...formItemLayout}
          label='禁言原因'
        >
          {getFieldDecorator('reason', {
            rules: [{ required: true, message: '请填写禁言原因!', whitespace: true }]
          })(
            <TextArea placeholder='请填写禁言原因' />
          )}
        </FormItem>

        <FormItem
          {...formItemLayout}
          label='禁言时长'
        >
          {getFieldDecorator('interval', {
            rules: [{ required: false, message: '请填写禁言时长!' }]
          })(
            <InputNumber min={0} placeholder='请填写禁言时长' style={{ width: '100%' }} />
          )}
        </FormItem>

        <FormItem
          {...formItemLayout}
          label='时间单位'
        >
          {getFieldDecorator('intervalUnits', {
            rules: [{ type: 'array', required: true, message: '请选择时间单位' }]
          })(
            <Cascader
              options={initials.enum.timeUnits}
              showSearch
              expandTrigger='hover'
              placeholder='请选择时间单位'
            />
          )}
        </FormItem>

        <FormItem
          {...formItemLayout}
          label='禁言类型'
        >
          {getFieldDecorator('forbidTypes', {
            rules: [{ type: 'array', required: true, message: '请选择禁言类型' }]
          })(
            <Cascader
              options={initials.enum.forbidTypes}
              showSearch
              expandTrigger='hover'
              placeholder='请选择禁言类型'
            />
          )}
        </FormItem>

        <FormItem {...tailFormItemLayout}>
          <Button type='primary' htmlType='submit'>提交</Button>
        </FormItem>
      </Form>
    )
  }
}

ForbidModal.propTypes = {
  form: PropTypes.object,
  options: PropTypes.object,
  initials: PropTypes.object,
  onModalLoad: PropTypes.func,
  onSubmitting: PropTypes.func,
  onForbid: PropTypes.func
}

const Modal = Form.create()(ForbidModal)

export default Modal
