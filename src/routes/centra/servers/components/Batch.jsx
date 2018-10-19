import React, { Component } from 'react'
import PropTypes from 'prop-types'
import _ from 'lodash'
import { Form, Cascader, Button, TreeSelect } from 'antd'
const FormItem = Form.Item

class BatchModal extends Component {

  handleSubmit = (e) => {
    e.preventDefault()
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        this.props.onSwitch({
          path: {
            productId: this.props.initials.path.productId
          },
          form: {
            operation: values.operation[0],
            serverList: values.serverList
          }
        })
        this.props.onSubmitting()
      }
    })
  }

  _serverReduce = (options, productId) => {
    return _.reduce(options, (result, option) => {
      if (option.value === productId) {
        result = _.reduce(option.children, (res, opt) => {
          res.push({ value: opt.value, label: opt.label })
          return res
        }, [])
      }
      return result
    }, [])
  }

  render() {
    const { form: { getFieldDecorator }, options, initials } = this.props

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
        xs: { span: 24, offset: 0 },
        sm: { span: 14, offset: 6 }
      }
    }

    return (
      <Form onSubmit={this.handleSubmit}>
        <FormItem
          {...formItemLayout}
          label='选择服务器'
          key='serverList'
        >
          {getFieldDecorator('serverList', {
            rules: [{ type: 'array', required: true, message: '请选择服务器!' }]
          })(
            <TreeSelect
              treeData={options.servers}
              showSearch
              allowClear
              treeDefaultExpandAll={false}
              multiple
              treeCheckable
              treeNodeFilterProp='label'
              showCheckedStrategy={TreeSelect.SHOW_CHILD}
              searchPlaceholder='请选择服务器'
            />
          )}
        </FormItem>

        <FormItem {...formItemLayout} label='操作'>
          {getFieldDecorator('operation', {
            rules: [{ type: 'array', required: false, message: '请选择操作!' }]
          })(
            <Cascader
              options={initials.enum.status}
              showSearch
              expandTrigger='hover'
              placeholder='选择将要进行的操作'
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

BatchModal.propTypes = {
  form: PropTypes.object,
  options: PropTypes.object,
  initials: PropTypes.object,
  onSwitch: PropTypes.func,
  onSubmitting: PropTypes.func
}

const Batch = Form.create()(BatchModal)

export default Batch
