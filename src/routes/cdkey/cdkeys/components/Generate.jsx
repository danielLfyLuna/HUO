import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Form, Input, InputNumber, Cascader, Button } from 'antd'
const FormItem = Form.Item

class GenerateModal extends Component {
  state = {
    currentItem: {},
    modalType: ''
  }

  componentWillMount() {
    const { currentItem, modalType } = this.props.onModalLoad()

    this.setState({
      currentItem: currentItem,
      modalType: modalType
    })
  }

  handleSubmit = (e) => {
    e.preventDefault()
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        const data = {
          productId: values.products[0],
          activityId: values.activityId,
          creator: values.creator,
          channel: values.channels[0],
          number: values.number
        }

        const posts = {
          form: data,
          path: {
            productId: data.productId,
            activityId: data.activityId
          }
        }

        this.props.onGenerate(posts)
        this.props.onSubmitting()
      }
    })
  }

  _numFormat = (value) => `${value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`
  _numParse = (value) => value.toString().replace(/\$\s?|(,*)/g, '')

  render() {
    const { dataFlow: { options }, form: { getFieldDecorator } } = this.props

    const detail = this.state.currentItem
    const check = this.state.modalType === 'generate'

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
          label='产品'
        >
          {getFieldDecorator('products', {
            initialValue: detail.productId ? [`${detail.productId}`] : [],
            rules: [{ type: 'array', required: true, message: '请选择产品' }]
          })(
            <Cascader
              options={options.productIds}
              showSearch
              expandTrigger='hover'
              placeholder='请选择产品'
              disabled={check}
            />
          )}
        </FormItem>

        <FormItem
          {...formItemLayout}
          label='礼包 ID'
        >
          {getFieldDecorator('activityId', {
            initialValue: detail.activityId || '',
            rules: [{ required: true, message: '请填写礼包 ID!' }]
          })(
            <Input placeholder='请填写礼包 ID' disabled={check} />
          )}
        </FormItem>

        <FormItem
          {...formItemLayout}
          label='礼包名称'
        >
          {getFieldDecorator('title', {
            initialValue: detail.title || '',
            rules: [{ required: true, message: '请填写礼包名称!' }]
          })(
            <Input placeholder='请填写礼包名称' disabled={check} />
          )}
        </FormItem>

        <FormItem
          {...formItemLayout}
          label='创建者'
        >
          {getFieldDecorator('creator', {
            initialValue: detail.creator || options.login.admin.userName,
            rules: [{ required: true, message: '请填写创建者!' }]
          })(
            <Input placeholder='请填写创建者' disabled={check} />
          )}
        </FormItem>

        <FormItem
          {...formItemLayout}
          label='渠道'
        >
          {getFieldDecorator('channels', {
            rules: [{ type: 'array', required: true, message: '请选择渠道!' }]
          })(
            <Cascader
              options={options.channels}
              showSearch
              expandTrigger='hover'
              placeholder='请选择渠道'
            />
          )}
        </FormItem>

        <FormItem
          {...formItemLayout}
          label='数量'
        >
          {getFieldDecorator('number', {
            rules: [{ required: true, message: '请填写数量!' }]
          })(
            <InputNumber
              min={0}
              formatter={this._numFormat}
              parser={this._numParse}
              placeholder='请填写数量'
              style={{ width: '100%' }}
            />
          )}
        </FormItem>

        <FormItem {...tailFormItemLayout}>
          <Button type='primary' htmlType='submit'>提交</Button>
        </FormItem>
      </Form>
    )
  }
}

GenerateModal.propTypes = {
  form: PropTypes.object,
  dataFlow: PropTypes.object,
  onModalLoad: PropTypes.func,
  onSubmitting: PropTypes.func,
  onGenerate: PropTypes.func
}

const Generate = Form.create()(GenerateModal)

export default Generate
