import React, {Component} from 'react'
import PropTypes from 'prop-types'

import { Form, Input, Cascader, Button } from 'antd'

const FormItem = Form.Item


class AddForm extends Component {

  static propTypes = {
    options: PropTypes.array,
    form: PropTypes.object,
    handleCancel: PropTypes.func,
    onAdd: PropTypes.func
  }

  handleSubmit = (e) => {
    e.preventDefault()
    this.props.form.validateFieldsAndScroll((err, fieldValues) => {
      if (!err) {
        let value = {
          productId: fieldValues.products[0],
          serverId: fieldValues.products[1],
          obj: fieldValues.sensitiveObj
        }
        this.props.onAdd(value)
        this.props.handleCancel()
      }
    })
  }

  handleReset = () => {
    this.props.form.resetFields()
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
          label='产品/服务器'
        >
          {getFieldDecorator('products', {
            rules: [{ required: true, message: '请选择产品/服务器' }]
          })(
            <Cascader
              showSearch
              options={this.props.options}
              placeholder='请选择产品/服务器'
              expandTrigger='hover'
            />
          )}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label='内容'
        >
          {getFieldDecorator('sensitiveObj', {
            rules: [{ required: true, message: '请填写内容' }]
          })(
            <Input.TextArea placeholder='内容' autosize={{ minRows: 2, maxRows: 10 }} />
          )}
        </FormItem>

        <FormItem {...tailFormItemLayout}>
          <Button type='primary' htmlType='submit' >提交</Button>
          <Button type='default' onClick={this.handleReset} style={{marginLeft: '10px'}}>重置</Button>
        </FormItem>

      </Form>
    )
  }
}

const Add = Form.create()(AddForm)

export default Add
