import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Form, Input, Button } from 'antd'
const FormItem = Form.Item
import moment from 'moment'
import 'moment/locale/zh-cn'
moment.locale('zh-cn')

class AuthenticModal extends Component {

  componentWillMount() {
  }

  handleSubmit = (e) => {
    e.preventDefault()
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        let posts = {
          form: {
            ip: values.ip
          }
        }

        this.props.onCreate(posts)
        this.props.onSubmitting()
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
          label='IP 地址'
        >
          {getFieldDecorator('ip', {
            validateTrigger: ['onBlur'],
            rules: [
              { required: true, message: '请输入正确的 IP 地址', pattern: ipRegEx }
            ]
          })(
            <Input placeholder='请输入 IP 地址' />
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
  form: PropTypes.object,
  onCreate: PropTypes.func,
  onSubmitting: PropTypes.func
}

const Modal = Form.create()(AuthenticModal)

export default Modal
