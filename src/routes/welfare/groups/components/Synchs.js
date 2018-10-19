import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Form, Button, Cascader } from 'antd'

const FormItem = Form.Item

class SyncForm extends Component {
  state = {
    currentItem: {},
    modalType: ''
  }

  componentWillMount() {
    this.props.onSearch({handle: 'PRODUCTS'})
    const { currentItem, modalType } = this.props.onModalLoad()

    this.setState({
      currentItem,
      modalType
    })
  }

  handleSubmit = (e) => {
    e.preventDefault()
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {

        let posts = {
          path: {
            productId: values.products[0],
            serverId: values.products[1]
          },
          handle: this.state.modalType.toUpperCase()
        }

        this.props.onSearch(posts)
        this.props.onSubmitting()
      }
    })
  }

  render() {
    const { getFieldDecorator } = this.props.form
    const { globals } = this.props.options

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
          label='产品服/务器'
        >
          {getFieldDecorator('products', {
            initialValue: [],
            rules: [{ type: 'array', required: true, message: '请选择产品服/务器!' }]
          })(
            <Cascader
              options={globals.products}
              showSearch
              expandTrigger='hover'
              placeholder='请选择产品服/务器'
            />
          )}
        </FormItem>

        <FormItem {...tailFormItemLayout}>
          <Button type='primary' htmlType='submit'>同步</Button>
        </FormItem>
      </Form>
    )
  }
}

SyncForm.propTypes = {
  form: PropTypes.object,
  options: PropTypes.object,
  onSearch: PropTypes.func,
  onSubmitting: PropTypes.func,
  onModalLoad: PropTypes.func
}

const SyncForms = Form.create()(SyncForm)

export default SyncForms
