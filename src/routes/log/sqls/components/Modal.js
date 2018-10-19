import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Form, Input, Button, Select, Cascader, DatePicker } from 'antd'
import _ from 'lodash'

const FormItem = Form.Item
const Option = Select.Option

class SqlsModal extends Component {

  static propTypes = {
    options: PropTypes.array.isRequired,
    form: PropTypes.object.isRequired,
    onSubmit: PropTypes.func,
    onSubmitting: PropTypes.func,
    onUpdate: PropTypes.func,
    onCreate: PropTypes.func,
    onExec: PropTypes.func,
    onExport: PropTypes.func,
    onNew: PropTypes.func,
    onModalLoad: PropTypes.func.isRequired
  }

  state = {
    source: [
      {value: 1, key: 1, label: '业务'},
      {value: 2, key: 2, label: '日志'},
      {value: 3, key: 3, label: '模板'},
      {value: 4, key: 4, label: '跨服'},
      {value: 5, key: 5, label: '本地测试'}
    ]
  }

  handleSubmit = (e) => {
    e.preventDefault()
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        if (values.modalType === 'create') {
          this.props.onSubmit(values)
          this.props.onCreate()
        }
        if (values.modalType === 'update') {
          this.props.onUpdate(values)
          this.props.onSubmitting()
        }
        if (values.modalType === 'exec') {
          this.props.onExec(values)
          this.props.onSubmitting()
        }
        if (values.modalType === 'export') {
          this.props.onExport(values)
          this.props.onSubmitting()
        }
        if (values.modalType === 'newExec') {
          this.props.onNew(values)
          this.props.onSubmitting()
        }
      }
    })
  }

  render() {
    const { getFieldDecorator } = this.props.form
    const children = []
    this.state.source.map(function(values) {
      children.push(
        <Option key={values.key} value={String(values.value)}>{values.label}</Option>
      )
    })

    let proOptions = []
    _.map(this.props.options, (v, i) => {
      proOptions.push({
        value: v.value,
        label: v.label
      })
    })

    // 修改
    const { currentItem, modalType } = this.props.onModalLoad()
    const createItem = modalType === 'create' ? {} : currentItem

    let itemArray = []
    if (modalType === 'exec' || modalType === 'export' || modalType === 'newExec') {
      if (currentItem.conditions.length === 0) { itemArray = [] }
      else { itemArray = currentItem.conditions.split(',') }
    }

    return (
      <Form onSubmit={this.handleSubmit}>
        {
          (modalType === 'exec' || modalType === 'export') &&
          <FormItem label='产品名称'>
            {getFieldDecorator('products', {
              rules: [{ required: true, message: '请选择产品与服务器(必选)' }]
            })(
              <Cascader
                style={{ width: '100%' }}
                options={this.props.options}
                placeholder='请选择产品与服务器(必选)'
                showSearch
                expandTrigger='hover'
              />
            )}
          </FormItem>
        }
        {
          (modalType === 'newExec') &&
          <FormItem label='产品名称'>
            {getFieldDecorator('productId', {
              rules: [{ required: true, message: '请选择产品(必选)' }]
            })(
              <Cascader
                style={{ width: '100%' }}
                options={proOptions}
                placeholder='请选择产品(必选)'
                showSearch
                expandTrigger='hover'
              />
            )}
          </FormItem>
        }
        {
          (modalType === 'newExec') &&
          <FormItem label='服务器名称'>
            {getFieldDecorator('serverId', {
              rules: [{ required: true, message: '请选择服务器名称(必选)' }]
            })(
              <Input placeholder='请选择服务器名称(必选)' />
            )}
          </FormItem>
        }
        {
          (modalType === 'exec' || modalType === 'newExec' || modalType === 'update' || modalType === 'export') &&
          <FormItem label='ID'>
            {getFieldDecorator('id', {
              initialValue: createItem.id
            })(
              <Input disabled />
            )}
          </FormItem>
        }
        <FormItem
          label='名称'
        >
          {getFieldDecorator('name', {
            rules: [{ required: true, message: '请输入名称' }],
            initialValue: (modalType === 'create' ? null : createItem.name)
          })(
            <Input placeholder='请输入名称' disabled={modalType !== 'create' && modalType !== 'update'} />
          )}
        </FormItem>
        <FormItem
          label='类型'
        >
          {getFieldDecorator('type', {
            rules: [{ required: true, message: '请输入类型' }],
              initialValue: (modalType === 'create' ? null : String(createItem.type))
          })(
            <Select
              placeholder='请选择类型'
              disabled={modalType !== 'create' && modalType !== 'update'}
            >
              {children}
            </Select>
          )}
        </FormItem>
        <FormItem
          label='SQL'
        >
          {getFieldDecorator('sql', {
            rules: [{ required: true, message: '请输入SQL' }],
            initialValue: (modalType === 'create' ? '' : createItem.sql)
          })(
            <Input.TextArea
              rows={6}
              placeholder='请输入SQL'
              disabled={modalType != 'create' && modalType != 'update'}
            />
          )}
        </FormItem>
        <FormItem
          label='conditions'
        >
          {getFieldDecorator('conditions', {
            rules: [{ required: false, message: '请输入conditions' }],
            initialValue: (modalType === 'create' ? '' : createItem.conditions)
          })(
            <Input.TextArea
              type='textarea' rows={6}
              placeholder='请输入conditions'
              disabled={modalType != 'create' && modalType != 'update'}
            />
          )}
        </FormItem>
        {
          itemArray.length > 0 && (modalType === 'exec' || modalType === 'export' || modalType === 'newExec') &&
          _.map(itemArray, (opt, idx) => {
              if (opt === 'startTime' || opt === 'endTime') {
                return (
                  <FormItem label={opt} key={opt}>
                    {getFieldDecorator(opt, {
                      rules: [{ required: true, message: `请选择${opt}` }]
                    })(
                      <DatePicker
                        placeholder={`请选择${opt}`}
                        showTime
                        format='YYYY-MM-DD HH:mm:ss'
                      />
                    )}
                  </FormItem>
                )
              }
              else {
                return (
                  <FormItem label={opt} key={opt}>
                    {getFieldDecorator(opt, {
                      rules: [{ required: true, message: `请输入${opt}` }]
                    })(
                      <Input placeholder={`请输入${opt}`} />
                    )}
                  </FormItem>
                )
              }
          })
        }
        <FormItem>
          {getFieldDecorator('modalType', {
            initialValue: modalType
          })(
            <Input type='hidden' />
        )}
        </FormItem>

        <FormItem>
          <Button type='primary' htmlType='submit' >提交</Button>
        </FormItem>
      </Form>
    )
  }
}

const Modal = Form.create()(SqlsModal)

export default Modal
