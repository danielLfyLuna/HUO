import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Form, Input, Cascader, Button } from 'antd'
import _ from 'lodash'

const FormItem = Form.Item


class ForbidModal extends Component {

  static propTypes = {
    form: PropTypes.object,
    options: PropTypes.array,
    handleCancel: PropTypes.func,
    onAdd: PropTypes.func
  }
  
  state = {

  }

  handleSubmit = (e) => {
    e.preventDefault()
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        this.props.onAdd({
          productId: values.productId[0],
          userId: values.userId
        })
        this.props.handleCancel()
      }
    })
  }

  render() {
    const { form: { getFieldDecorator }, options } = this.props

    let productOpt = []
    _.map(options, (val, idx) => {
      productOpt.push({
        value: val.value,
        label: val.label
      })
    })

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
          label='产品ID'
        >
          {getFieldDecorator('productId', {
            rules: [{ required: true, message: '请选择产品' }]
          })(
            <Cascader
              options={productOpt}
              showSearch
              placeholder='请选择产品'
              expandTrigger='hover'
            />
          )}
        </FormItem>

        <FormItem
          {...formItemLayout}
          label='玩家平台ID'
        >
          {getFieldDecorator('userId', {
            rules: [{ required: true, message: '请填写玩家平台ID' }]
          })(
            <Input placeholder='请填写玩家平台ID' />
          )}
        </FormItem>

        <FormItem {...tailFormItemLayout}>
          <Button type='primary' htmlType='submit'>提交</Button>
        </FormItem>
      </Form>
    )
  }
}

const Modal = Form.create()(ForbidModal)

export default Modal
