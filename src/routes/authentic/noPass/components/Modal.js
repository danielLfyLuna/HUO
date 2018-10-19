import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Form, Input, Button, Cascader } from 'antd'
import moment from 'moment'
import 'moment/locale/zh-cn'
moment.locale('zh-cn')

const FormItem = Form.Item


class AuthenticModal extends Component {

  handleSubmit = (e) => {
    e.preventDefault()
    this.props.form.validateFieldsAndScroll((err, value) => {
      if (!err) {
        this.props.onCreate({
          productId: value.products[0],
          serverId: value.products[1],
          ip: value.ip
        })
        this.props.handleCancel()
      }
    })
  }

  render() {
    const { form: { getFieldDecorator } } = this.props

    const ipRegEx = /^((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)$/

    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 6 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 }
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
          label='产品/服务器'
        >
          {getFieldDecorator('products', {
            rules: [{ required: true, message: '请选择产品与服务器' }]
          })(
            <Cascader
              style={{ width: '100%' }}
              options={this.props.options}
              placeholder='请选择产品/服务器(必选)'
              showSearch
              expandTrigger='hover'
              popupClassName='cascaderMenu'
            />
          )}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label='IP 地址'
        >
          {getFieldDecorator('ip', {
            validateTrigger: ['onBlur'],
            rules: [
              { required: true, message: '请输入正确的 IP 地址', pattern: ipRegEx }
            ]
          })(
            <Input placeholder='IP 地址' />
          )}
        </FormItem>
        <FormItem {...tailFormItemLayout}>
          <Button type='primary' htmlType='submit'>提交</Button>
        </FormItem>
      </Form>
    )
  }
}

AuthenticModal.propTypes = {
  options: PropTypes.array,
  form: PropTypes.object,
  onCreate: PropTypes.func,
  handleCancel: PropTypes.func
}

const Modal = Form.create()(AuthenticModal)

export default Modal
