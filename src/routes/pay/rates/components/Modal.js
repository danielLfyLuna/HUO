import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Form, InputNumber, Button } from 'antd'
const FormItem = Form.Item

class RateModal extends Component {

  handleSubmit = (e) => {
    e.preventDefault()
    this.props.form.validateFieldsAndScroll((err, values) => {
      const { initials } = this.props
      console.log(initials)
      if (!err) {
        let data = {}
        data.amount = values.amount
        data.rate = values.rate
        let posts = {
          form: data,
          path: initials.products
        }

        this.props.onCreate(posts)
        this.props.onSubmitting()
      }
    })
  }

  render() {
    const { form: { getFieldDecorator } } = this.props

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
          label='金额'
        >
          {getFieldDecorator('amount', {
            rules: [{ required: true, message: '请填写金额!' }]
          })(
            <InputNumber placeholder='请填写金额' style={{ width: '100%' }} />
          )}
        </FormItem>

        <FormItem
          {...formItemLayout}
          label='倍率'
        >
          {getFieldDecorator('rate', {
            rules: [{ required: true, message: '请填写倍率!' }]
          })(
            <InputNumber placeholder='请填写倍率' style={{ width: '100%' }} />
          )}
        </FormItem>

        <FormItem {...tailFormItemLayout}>
          <Button type='primary' htmlType='submit'>提交</Button>
        </FormItem>
      </Form>
    )
  }
}

RateModal.propTypes = {
  form: PropTypes.object,
  initials: PropTypes.object,
  onSubmitting: PropTypes.func,
  onCreate: PropTypes.func
}

const Modal = Form.create()(RateModal)

export default Modal
