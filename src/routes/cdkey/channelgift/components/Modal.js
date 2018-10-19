import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Form, Input, Button, Cascader } from 'antd'
const FormItem = Form.Item

class CDkeysModal extends Component {

  state = {
    productId: '',
    currentItem: {}
  }

  products = []

  handleReset = () => {
    this.props.form.resetFields()
  }

  handleSubmit = (e) => {
    e.preventDefault()
    this.props.form.validateFieldsAndScroll((err, values) => {
      let items = {
        path: {},
        form: {}
      }
      items.form = {
        channelCdkey: values.channelCdkey,
        channel: values.channel,
        cdkey: values.cdkey
      }
      items.path.productId = values.products[0]
      if (!err) {
        this.props.onCreate(items)
        this.props.onSubmitting()
      }
    })
  }


  render() {
    const { getFieldDecorator } = this.props.form

    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 6 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 14 }
      }
    }

    const tailFormItemLayout = {
      wrapperCol: {
        xs: {
          span: 24,
          offset: 0
        },
        sm: {
          span: 14,
          offset: 6
        }
      }
    }

    return (
      <Form onSubmit={this.handleSubmit}>
        <FormItem
          {...formItemLayout}
          label='渠道礼包码'
          >
          {getFieldDecorator('channelCdkey', {
            rules: [{ required: true, message: '请填写渠道礼包码' }]
          })(
            <Input />
          )}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label='渠道'
        >
          {getFieldDecorator('channel', {
            rules: [{ required: true, message: '请填写渠道' }]
          })(
            <Input />
          )}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label='CDkey'
        >
          {getFieldDecorator('cdkey', {
            rules: [{ required: true, message: '请填写CDkey!' }]
          })(
            <Input />
          )}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label='选择产品'
        >
          {getFieldDecorator('products', {
            rules: [{ required: true, message: '请选择产品(必选)' }]
          })(
            <Cascader
              options={this.props.proOptions}
              placeholder='请选择产品(必选)'
            />
          )}
        </FormItem>
        <FormItem {...tailFormItemLayout}>
          <Button type='primary' htmlType='submit' style={{ marginRight: 16 }}>提交</Button>
          <Button type='ghost' htmlType='button' onClick={this.handleReset}>重置</Button>
        </FormItem>
      </Form>
    )
  }
}

CDkeysModal.propTypes = {
  proOptions: PropTypes.array,
  form: PropTypes.object,
  onCreate: PropTypes.func,
  onSubmitting: PropTypes.func
}

const Modal = Form.create()(CDkeysModal)

export default Modal
