import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Form, Input, Button, TreeSelect, Cascader, DatePicker } from 'antd'

const FormItem = Form.Item

class LogActionsModal extends Component {

  static propTypes = {
    form: PropTypes.object,
    options: PropTypes.object,
    onExport: PropTypes.func,
    onSubmitting: PropTypes.func,
  }

  omponentWillMount() {
  }

  componentWillUnmount() {
  }

  handleSubmit = (e) => {
    e.preventDefault()
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        const posts = {
          form: {
            productId: values.products[0],
            serverIds: values.products[1],
            startTime: values.startTime.format('YYYY-MM-DD'),
            nickname: values.nickname,
            playerId: values.playerId || '',
            produceSources: values.produceSources || [],
            operationType: values.operationType || [],
            consumeSources: values.consumeSources || [],
          }
        }

        this.props.onExport(posts)
        this.props.onSubmitting()
      }
    })
  }

  render() {
    const { getFieldDecorator } = this.props.form
    const { options } = this.props

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
          label='产品名称'
        >
          { getFieldDecorator('products', {
            rules: [{ type: 'array', required: true, message: '请选择产品与服务器(必选)' }]
          })(
            <Cascader
              options={options.globals.products}
              showSearch
              expandTrigger='hover'
              placeholder='请选择产品与服务器(必选)'
            />
          )}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label='开始时间'
        >
          {getFieldDecorator('startTime', {
            rules: [{ type: 'object', required: true, message: '请选择时间' }]
          })(
            <DatePicker
              format='YYYY-MM-DD'
              style={{ width: '100%' }}
            />
          )}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label='玩家昵称'
        >
          { getFieldDecorator('nickname', {
            rules: [{ required: true, message: '请输入玩家昵称' }]
          })(
            <Input placeholder='玩家昵称' />
          )}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label='玩家ID'
        >
          { getFieldDecorator('playerId', {
            rules: [{ required: false, message: '请输入玩家ID' }],
          })(
            <Input placeholder='玩家ID' />
          )}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label='生产来源'
        >
          { getFieldDecorator('produceSources', {
            rules: [{ type: 'array', required: false, message: '请输入生产来源' }],
          })(
            <TreeSelect
              treeData={[{
                label: '全选',
                value: null,
                key: '全选',
                children: [...options.sources.produce]
              }]}
              showSearch
              allowClear
              treeDefaultExpandAll
              multiple
              treeCheckable
              treeNodeFilterProp='label'
              showCheckedStrategy={TreeSelect.SHOW_ALL}
              searchPlaceholder='请选择生产来源'
            />
          )}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label='操作来源'
        >
          { getFieldDecorator('operationType', {
            rules: [{ type: 'array', required: false, message: '请输入操作来源' }],
          })(
            <TreeSelect
              treeData={[{
                label: '全选',
                value: null,
                key: '全选',
                children: [...options.sources.operate]
              }]}
              showSearch
              allowClear
              treeDefaultExpandAll
              multiple
              treeCheckable
              treeNodeFilterProp='label'
              showCheckedStrategy={TreeSelect.SHOW_ALL}
              searchPlaceholder='请选择操作来源'
            />
          )}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label='消耗来源'
        >
          { getFieldDecorator('consumeSources', {
            rules: [{ type: 'array', required: false, message: '请输入消耗来源' }],
          })(
            <TreeSelect
              treeData={[{
                label: '全选',
                value: null,
                key: '全选',
                children: [...options.sources.consume]
              }]}
              showSearch
              allowClear
              treeDefaultExpandAll
              multiple
              treeCheckable
              treeNodeFilterProp='label'
              showCheckedStrategy={TreeSelect.SHOW_ALL}
              searchPlaceholder='请选择消耗来源'
            />
          )}
        </FormItem>
        <FormItem {...tailFormItemLayout}>
          <Button type='primary' htmlType='submit' >提交</Button>
        </FormItem>
      </Form>
    )
  }
}

const ExportModal = Form.create()(LogActionsModal)

export default ExportModal
