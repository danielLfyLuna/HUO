import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Form, Input, Button } from 'antd'
const FormItem = Form.Item

class RepairModal extends Component {

  handleSubmit = (e) => {
    e.preventDefault()
    this.props.form.validateFieldsAndScroll((err, values) => {
      const { initials } = this.props
      if (!err) {
        const data = {
          orderId: values.orderId
        }
        const posts = {
          form: data,
          path: initials.products
        }

        this.props.onRepair(posts)
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
          label='订单 ID'
        >
          {getFieldDecorator('orderId', {
            rules: [{ required: true, message: '请填写订单 ID!' }]
          })(
            <Input placeholder='请填写订单 ID' />
          )}
        </FormItem>

        <FormItem {...tailFormItemLayout}>
          <Button type='primary' htmlType='submit'>提交</Button>
        </FormItem>
      </Form>
    )
  }
}

RepairModal.propTypes = {
  form: PropTypes.object,
  initials: PropTypes.object,
  onSubmitting: PropTypes.func,
  onRepair: PropTypes.func
}

const Modal = Form.create()(RepairModal)

export default Modal
