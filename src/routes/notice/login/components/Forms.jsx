import React, { Component } from 'react'
import PropTypes from 'prop-types'
import _ from 'lodash'
import { Form, Input, InputNumber, Cascader, Select, Button, Icon, TreeSelect, Tooltip, Switch } from 'antd'

const FormItem = Form.Item
const TextArea = Input.TextArea
const Option = Select.Option


class LoginForms extends Component {
  state = {
    currentItem: {},
    productId: '',
    modalType: '',
    select: true
  }

  componentWillMount() {
    const { currentItem, modalType } = this.props.onModalLoad()

    this.setState({
      currentItem,
      modalType
    })
    if (modalType === 'update') {
      this.setState({
        select: false,
        productId: currentItem.productId
      })
    }
  }

  handleProductSelect = (products) => {
    if (products.length) {
      this.setState({
        select: false,
        productId: products
      })
    } else {
      this.setState({
        select: true,
        productId: products
      })
    }
  }

  handleSubmit = (e) => {
    e.preventDefault()
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        let data = {
          productId: values.products[0],
          open: values.status ? 1 : 0,
          noticeLabels: values.noticeLabels
        }
        if (values.channels.length) {
          data = {
            ...data,
            channels: values.channels.join(',')
          }
        }
        if (values.id) {
          data = {
            ...data,
            id: values.id
          }
        }

        data.serverIds = values.serverIds
        if (_.indexOf(values.serverIds, 'all') >= 0) data.serverIds = ['all']
        data.serverIds = data.serverIds.join(',')

        const posts = {
          form: data,
          path: {
            noticeId: data.id
          }
        }

        if (this.state.modalType === 'update') {
          this.props.onUpdate(posts)
        } else {
          this.props.onCreate(posts)
        }
        this.props.onSubmitting()
      }
    })
  }

  handleNoticeAdd = () => {
    const { form } = this.props
    const noticeKeys = form.getFieldValue('noticeKeys')
    const nextKeys = noticeKeys.concat(noticeKeys.length)
    form.setFieldsValue({
      noticeKeys: nextKeys
    })
  }

  handleNoticeRemove = (k) => {
    const { form } = this.props
    const noticeKeys = form.getFieldValue('noticeKeys')
    if (noticeKeys.length === 1) {
      return
    }
    form.setFieldsValue({
      noticeKeys: noticeKeys.filter(key => key !== k).map((v, i) => i)
    })
    const currentItem = this.state.currentItem
    if (currentItem.noticeLabels) {
      const noticeLabels = currentItem.noticeLabels.filter((v, i) => k != i)
      this.setState({
        currentItem: {
          ...this.state.currentItem,
          noticeLabels: [...noticeLabels]
        }
      })
    }
  }

  _numFormat = (value) => `${value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`
  _numParse = (value) => value.toString().replace(/\$\s?|(,*)/g, '')

  render() {
    const { form: {
      getFieldDecorator,
      getFieldValue
    }, dataFlow: {
      options
    } } = this.props

    const treeChannels = [{
      label: '全选',
      value: null,
      key: 'all',
      children: [...options.channels]
    }]

    const detail = this.state.currentItem
    const check = this.state.modalType === 'update'

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

    const formItem2Layout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 4 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 20 }
      }
    }

    const tailFormItemLayout = {
      wrapperCol: {
        xs: { span: 24, offset: 0 },
        sm: { span: 14, offset: 6 }
      }
    }

    let serverIds = []
    _.map(options.globals.products, (v, i) => {
      if (v.value === this.state.productId[0]) {
        if (v.children && v.children.length) {
          _.map(v.children, (val, inx) => {
            serverIds.unshift(<Option key={val.value} value={val.value}>{val.label}</Option>)
          })
          serverIds.unshift(<Option key='all' value='all'>全选</Option>)
        }
      }
    })

    const iniKeys = detail.noticeLabels
                    ? detail.noticeLabels.map((v, i) => i)
                    : [0]
    getFieldDecorator('noticeKeys', { initialValue: [...iniKeys] })
    const noticeKeys = getFieldValue('noticeKeys')

    const formsNotices = noticeKeys.map((key, index) => {
      return (
        <FormItem
          {...formItemLayout}
          label={`公告内容 #${key + 1}`}
          key={`noticeLabels-${key}`}
        >
          <FormItem
            {...formItem2Layout}
            label='标签'
            key={`noticeLabels-label-${key}`}
          >
            {getFieldDecorator(`noticeLabels[${key}].label`, {
              initialValue: detail.noticeLabels && key < detail.noticeLabels.length ? detail.noticeLabels[key].label : '',
              rules: [{type: 'string', required: true, message: '请输入标签'}]
            })(
              <Input placeholder='请输入标签' />
            )}
          </FormItem>

          <FormItem
            {...formItem2Layout}
            label='标题'
            key={`noticeLabels-title-${key}`}
          >
            {getFieldDecorator(`noticeLabels[${key}].title`, {
              initialValue: detail.noticeLabels && key < detail.noticeLabels.length ? detail.noticeLabels[key].title : '',
              rules: [{type: 'string', required: true, message: '请输入标题'}]
            })(
              <Input placeholder='请输入标题' />
            )}
          </FormItem>

          <FormItem
            {...formItem2Layout}
            label='内容'
            key={`noticeLabels-context-${key}`}
          >
            {getFieldDecorator(`noticeLabels[${key}].context`, {
              initialValue: detail.noticeLabels && key < detail.noticeLabels.length ? detail.noticeLabels[key].context : '',
              rules: [{type: 'string', required: true, message: '请输入内容'}]
            })(
              <TextArea placeholder='请输入内容' />
            )}
          </FormItem>
          {
            check &&
            <FormItem
              {...formItem2Layout}
              label='级别'
              key={`noticeLabels-index-${key}`}
            >
              {getFieldDecorator(`noticeLabels[${key}].index`, {
                initialValue: detail.noticeLabels && key < detail.noticeLabels.length ? detail.noticeLabels[key].index : 0,
                rules: [{type: 'number', required: true, message: '请输入级别'}]
              })(
                <InputNumber min={0} placeholder='请输入级别' />
              )}
            </FormItem>
          }
          <Icon
            className='dynamic-delete-button'
            type='minus-circle-o'
            disabled={noticeKeys.length === 1}
            onClick={() => this.handleNoticeRemove(key)}
          />
        </FormItem>
      )
    })

    return (
      <Form onSubmit={this.handleSubmit}>
        <FormItem
          {...formItemLayout}
          label='产品'
        >
          {getFieldDecorator('products', {
            initialValue: detail.productId ? [detail.productId] : [],
            rules: [{ type: 'array', required: true, message: '请选择产品' }],
            onChange: this.handleProductSelect
          })(
            <Cascader
              options={options.products}
              showSearch
              expandTrigger='hover'
              placeholder='请选择产品'
            />
          )}
        </FormItem>

        <FormItem label='服务器(多选)' {...formItemLayout}>
          {getFieldDecorator('serverIds', {
            rules: [{ type: 'array', required: true, message: '请选择服务器!' }],
            initialValue: detail.serverIds ? detail.serverIds : [],
          })(
            <Select
              allowClear
              mode='multiple'
              style={{ width: '100%' }}
              placeholder='请选择服务器'
              notFoundContent='服务器列表为空'
              optionFilterProp='children'
              filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
            >
              {serverIds}
            </Select>
          )}
        </FormItem>

        <FormItem
          {...formItemLayout}
          label='渠道(可选)'
        >
          {getFieldDecorator('channels', {
            initialValue: detail.channels ? detail.channels.split(',') : [],
            rules: [{ type: 'array', required: false, message: '请填写公告渠道!' }]
          })(
            <TreeSelect
              treeData={treeChannels}
              showSearch
              allowClear
              treeDefaultExpandAll={false}
              multiple
              treeCheckable
              treeNodeFilterProp='label'
              showCheckedStrategy={TreeSelect.SHOW_CHILD}
              searchPlaceholder='空选默认为所有渠道(可选)'
            />
          )}
        </FormItem>

        <FormItem
          {...formItemLayout}
          label={
            <span style={{display: 'inline'}}>
              开关
              <Tooltip title='新建公告默认关闭状态，如需修改请在新建之后进入首页修改'>
                <Icon type='question-circle-o' />
              </Tooltip>
            </span>}
        >
          {getFieldDecorator('status', {
            initialValue: detail.open || false,
            rules: [{ type: 'boolean', required: false, message: '请填写开关!' }]
          })(
            <Switch
              checkedChildren={'开启'}
              unCheckedChildren={'关闭'}
              defaultChecked={detail.open || false}
              disabled
            />
          )}
        </FormItem>
        {
          check &&
          <FormItem
            {...formItemLayout}
            label='公告 ID'
          >
            {getFieldDecorator('id', {
              initialValue: detail.id,
              rules: [{type: 'string', required: true, message: '请输入公告 ID'}]
            })(
              <Input placeholder='请输入公告 ID' disabled />
            )}
          </FormItem>
        }
        {
          formsNotices
        }
        <FormItem {...tailFormItemLayout}>
          <Button type='dashed' onClick={this.handleNoticeAdd}>
            <Icon type='plus' />添加公告
          </Button>
        </FormItem>

        <FormItem {...tailFormItemLayout}>
          <Button type='primary' htmlType='submit'>提交</Button>
        </FormItem>
      </Form>
    )
  }
}

LoginForms.propTypes = {
  form: PropTypes.object,
  dataFlow: PropTypes.object,
  onModalLoad: PropTypes.func,
  onSubmitting: PropTypes.func,
  onUpdate: PropTypes.func,
  onCreate: PropTypes.func,
}

const Modal = Form.create()(LoginForms)

export default Modal
