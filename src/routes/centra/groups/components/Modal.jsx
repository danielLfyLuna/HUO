import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Form, Input, Cascader, Button } from 'antd'
const FormItem = Form.Item


class GroupModal extends Component {

  state = {
    currentItem: {},
    modalType: ''
  }

  componentWillMount() {
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
        let data = {
          group: values.group,
          name: values.name,
          verify: values.verify[0]
        }
        if (values.modalType === 'create') {
          this.props.onCreate({
            form: data
          })
        } else {
          this.props.onUpdate({
            form: data
          })
        }
        this.props.onSubmitting()
      }
    })
  }

  render() {
    const { form: { getFieldDecorator }, initials } = this.props
    const { currentItem, modalType } = this.state
    const check = modalType !== 'create'
    const detail = modalType === 'create' ? {} : currentItem

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
        <FormItem
          {...formItemLayout}
          label='分组'
        >
          {getFieldDecorator('group', {
            initialValue: detail.group,
            rules: [{ required: true, message: '请填写分组!' }]
          })(
            <Input disabled={check} placeholder='填写分组' />
          )}
        </FormItem>

        <FormItem
          {...formItemLayout}
          label='名称'
        >
          {getFieldDecorator('name', {
            initialValue: detail.name,
            rules: [{ required: true, message: '请填写名称!' }]
          })(
            <Input placeholder='填写名称' />
          )}
        </FormItem>

        <FormItem
          {...formItemLayout}
          label='是否验证'
        >
          {getFieldDecorator('verify', {
            initialValue: detail.verify ? [detail.verify] : [0],
            rules: [{ type: 'array', required: true, message: '请选择是否验证客户端!' }]
          })(
            <Cascader
              options={initials.enum.verifyTypes}
              showSearch
              expandTrigger='hover'
              placeholder='选择是否验证客户端'
            />
          )}
        </FormItem>

        <FormItem>
          {getFieldDecorator('modalType', {
            initialValue: modalType
          })(
            <Input type='hidden' />
        )}
        </FormItem>

        <FormItem {...tailFormItemLayout}>
          <Button type='primary' htmlType='submit' >提交</Button>
        </FormItem>
      </Form>
    )
  }
}

GroupModal.propTypes = {
  form: PropTypes.object,
  initials: PropTypes.object,
  onCreate: PropTypes.func,
  onUpdate: PropTypes.func,
  onSubmitting: PropTypes.func,
  onModalLoad: PropTypes.func
}

const Modal = Form.create()(GroupModal)

export default Modal
