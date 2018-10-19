import { Form, Input, Button, Cascader, DatePicker } from 'antd'
import React, { Component } from 'react'
import moment from 'moment'
import PropTypes from 'prop-types'

const FormItem = Form.Item


class CreateModal extends Component {

  componentWillMount() {
    const { currentItem, modalType } = this.props.onModalLoad()

    this.setState({
      productId: currentItem ? currentItem.productId : this.props.options[0].value,
      currentItem: modalType === 'create' ? {} : currentItem,
      modalType: modalType
    })
  }

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
        values.time = moment(values.time).format('YYYY-MM-DD HH:mm:ss')
        values.product = values.product[0]
        this.props.onCreate(values)
        this.props.onSubmitting()
      }
    })
  }
  render() {

    const { form: { getFieldDecorator }, options } = this.props
    const check = this.state.modalType !== 'create'
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
        <FormItem {...formItemLayout} label='产品'>
          {getFieldDecorator('product', {
            initialValue: '',
            rules: [{ required: true, message: '请选择产品!' }]
          })(
            <Cascader
              options={options}
              showSearch
              expandTrigger='hover'
              disabled={check}
              placeholder='选择产品'
            />
          )}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label='服务器(区间)'>
          {getFieldDecorator('serversRegular', {
            initialValue: '',
            rules: [{ required: true, message: '请添写服务器!' }]
          })(
            <Input placeholder='app_001,app_002,app_101-app_200' />
          )}
        </FormItem>

        <FormItem
          {...formItemLayout}
          label='开始时间'
        >
          {getFieldDecorator('time')(
            <DatePicker
              showTime={{ format: 'YYYY-MM-DD HH:mm:ss' }}
              format='YYYY-MM-DD HH:mm:ss'
              placeholder='请选择开服时间'
            />
          )}
        </FormItem>

        <FormItem>
          <Button type='primary' htmlType='submit' >提交</Button>
        </FormItem>
      </Form>
    )
  }
}

CreateModal.propTypes = {
    form: PropTypes.object,
    options: PropTypes.array,
    onModalLoad: PropTypes.func,
    onCreate: PropTypes.func,
    onSubmitting: PropTypes.func
}

const Modal = Form.create()(CreateModal)

export default Modal
