import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Form, Cascader, Button } from 'antd'
const FormItem = Form.Item

class CreateModal extends Component {

  componentWillMount() {
    this.props.onRender({ renderState: false })
  }

  componentWillUnmount() {
    this.props.onRender({ renderState: true })
  }

  handleSubmit = (e) => {
    e.preventDefault()
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {

        this.context.router.push({
          pathname: `/sango2/activity/activities/${values.functionIds[0]}`,
          query: {
            handle: 'create',
            productId: values.productIds[0],
            serverId: values.productIds[1],
            functionId: values.functionIds[0]
          }
        })
        this.props.onSubmitting()
      }
    })
  }


  render() {
    const { getFieldDecorator } = this.props.form
    const { options, initials } = this.props

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
          label='产品/服务器'
        >
          {getFieldDecorator('productIds', {
            initialValue: [],
            rules: [{ type: 'array', required: true, message: '请选择产品/服务器！' }]
          })(
            <Cascader options={options.products.list} showSearch expandTrigger='hover' placeholder='请选择产品/服务器' />
          )}
        </FormItem>

        <FormItem
          {...formItemLayout}
          label='活动类型'
        >
          {getFieldDecorator('functionIds', {
            initialValue: [],
            rules: [{ type: 'array', required: true, message: '请选择活动类型!' }]
          })(
            <Cascader
              options={initials.enum.functionIds}
              showSearch expandTrigger='hover'
              placeholder='请选择活动类型'
            />
          )}
        </FormItem>

        <FormItem {...tailFormItemLayout}>
          <Button type='primary' htmlType='submit' >添加活动</Button>
        </FormItem>
      </Form>
    )
  }
}

CreateModal.propTypes = {
  options: PropTypes.object,
  initials: PropTypes.object,
  form: PropTypes.object,
  onRender: PropTypes.func,
  onSubmitting: PropTypes.func
}

CreateModal.contextTypes = {
  router: PropTypes.object
}

const Create = Form.create()(CreateModal)

export default Create
