import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Form, Input, Cascader, Button } from 'antd'
const FormItem = Form.Item

let versionTypes = [
  { label: '软更新(没有硬更新版本)', value: 1 },
  { label: '软更新(但有硬更新版本)', value: 2 },
  { label: '硬更新', value: 3 },
  { label: '审核版本（非正式更新用', value: 4 }
]

let versionStatus = [
      { label: '正式', value: 1 },
      { label: '测试', value: 2 }
    ]

class VersionModal extends Component {
  state = {
    productId: '',
    cellType: '',
    serverPort: '',
    currentItem: {},
    modalType: ''
  }

  componentWillMount() {
    const { currentItem, modalType } = this.props.onModalLoad()

    this.setState({
      productId: currentItem ? currentItem.productId : '',
      currentItem: modalType === 'create' ? {} : currentItem,
      modalType: modalType
    })
  }

  handleSubmit = (e) => {
    e.preventDefault()
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        if (this.state.modalType === 'create') {
          this.props.onCreate(values)
        } else {
          this.props.onUpdate(values)
        }
        this.props.onSubmitting()
      }
    })
  }

  render() {
    const { form: { getFieldDecorator }, options, initials } = this.props
    const check = this.state.modalType !== 'create'
    const item = this.state.currentItem

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
        sm: { span: 14, offset: 6 }
      }
    }

    return (
      <Form onSubmit={this.handleSubmit}>
        <FormItem {...formItemLayout} label='产品*'>
          {getFieldDecorator('products', {
            initialValue: item.productId ? [`${item.productId}`] : [`${initials.productId}`],
            rules: [{ type: 'array', required: true, message: '请选择产品!' }]
          })(
            <Cascader
              options={options.products}
              showSearch
              expandTrigger='hover'
              disabled={check}
              placeholder='选择产品'
            />
          )}
        </FormItem>

        <FormItem {...formItemLayout} label='分组'>
          {getFieldDecorator('groups', {
            initialValue: item.group ? [item.group] : [],
            rules: [{ type: 'array', required: false, message: '请选择分组!' }]
          })(
            <Cascader
              options={options.groups}
              showSearch
              expandTrigger='hover'
              placeholder='选择分组'
            />
          )}
        </FormItem>

        <FormItem {...formItemLayout} label='版本* (格式 1.1.1)'>
          {getFieldDecorator('version', {
            initialValue: item.version,
            rules: [{
              required: true,
              message: '请填写版本!',
              whitespace: true,
              pattern: /\d{1,2}.\d{1,2}.\d{1,3}$/i
            }]
          })(
            <Input disabled={check} placeholder='填写版本' />
          )}
        </FormItem>

        <FormItem {...formItemLayout} label='版本类型*'>
          {getFieldDecorator('type', {
            initialValue: item.type ? [item.type] : [],
            rules: [{ type: 'array', required: true, message: '请选择版本类型!' }]
          })(
            <Cascader
              options={versionTypes}
              showSearch
              expandTrigger='hover'
              placeholder='选择版本类型'
            />
          )}
        </FormItem>

        <FormItem {...formItemLayout} label='版本状态*'>
          {getFieldDecorator('status', {
            initialValue: item.status ? [item.status] : [],
            rules: [{ type: 'array', required: true, message: '请选择版本状态!' }]
          })(
            <Cascader
              options={versionStatus}
              showSearch
              expandTrigger='hover'
              placeholder='选择版本状态'
            />
          )}
        </FormItem>

        <FormItem {...formItemLayout} label='资源URL*'>
          {getFieldDecorator('resourceUrl', {
            initialValue: item.resourceUrl,
            rules: [{ required: true, message: '请填资源URL!', whitespace: true }]
          })(
            <Input placeholder='填资源URL' />
          )}
        </FormItem>

        <FormItem {...formItemLayout} label='应用URL*'>
          {getFieldDecorator('appUrl', {
            initialValue: item.appUrl,
            rules: [{ required: true, message: '请填写应用URL!', whitespace: true }]
          })(
            <Input placeholder='填写应用URL' />
          )}
        </FormItem>

        <FormItem {...formItemLayout} label='描述*'>
          {getFieldDecorator('description', {
            initialValue: item.description,
            rules: [{ required: true, message: '请填写描述!', whitespace: true }]
          })(
            <Input.TextArea autosize placeholder='填写描述' />
          )}
        </FormItem>

        <FormItem {...tailFormItemLayout}>
          <Button type='primary' htmlType='submit' >提交</Button>
        </FormItem>
      </Form>
    )
  }
}

VersionModal.propTypes = {
  form: PropTypes.object,
  options: PropTypes.object,
  initials: PropTypes.object,
  onModalLoad: PropTypes.func,
  onCreate: PropTypes.func,
  onUpdate: PropTypes.func,
  onSubmitting: PropTypes.func
}

const Modal = Form.create()(VersionModal)

export default Modal
