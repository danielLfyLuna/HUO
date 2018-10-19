import { Form, Button, Cascader } from 'antd'
import React, { Component } from 'react'
import PropTypes from 'prop-types'

const FormItem = Form.Item

class Modal extends Component {

  state = {
    productId: '',
    currentItem: {},
    modalType: ''
  }

  handleProductSelect = (value) => {
    this.setState({
      productNum: value
    })
  }

  handleSubmit = (e) => {
    e.preventDefault()
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        const productId = values.products[0]
        const serverId = values.products[1]
        this.props.handleSyncItem(productId, serverId)
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
        sm: { span: 14 }
      }
    }
    return (
      <Form onSubmit={this.handleSubmit}>
        <FormItem
          {...formItemLayout}
          label='选择产品/服务器'
         >
          {getFieldDecorator('products', {
            initialValue: [],
            rules: [{ required: true, message: '请选择产品与服务器(必选)' }]
          })(
            <Cascader
              options={this.props.products.options}
              showSearch
              expandTrigger='hover'
              placeholder='请选择产品与服务器(必选)'
            />
          )}
        </FormItem>
        <FormItem>
          <Button type='primary' htmlType='submit' >同步</Button>
        </FormItem>
      </Form>
    )
  }
}

Modal.propTypes = {
    form: PropTypes.object.isRequired,
    handleSyncItem: PropTypes.func.isRequired,
    products: PropTypes.object.isRequired,

}

const blackModal = Form.create()(Modal)

export default blackModal
