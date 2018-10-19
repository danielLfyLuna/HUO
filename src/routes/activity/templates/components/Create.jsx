import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Form, Cascader, Button, DatePicker, Input, InputNumber, TreeSelect, Tooltip, Switch, Icon } from 'antd'
import moment from 'moment'

const FormItem = Form.Item

let productOpt = []
let serverOpt = []
let goodOpt = []

class CreateForm extends Component {
  state = {
    modal: {
      currentItem: {},
      modalType: ''
    },
    config: {
      openCondition: 1001,
      productId: ''
    },
    switch: 1
  }

  componentWillMount() {
    const { initials } = this.props.dataFlow
    const { currentItem, modalType } = this.props.onModalLoad()

    this.setState({
      modal: {
        currentItem,
        modalType
      },
      config: {
        ...this.state.config,
        productId: initials.paths.productId
      }
    })
  }

  handleSubmit = (e) => {
    e.preventDefault()
    const { initials } = this.props.dataFlow
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        let data = {}
        data.templateId = Number(values.templateId)
        data.functionId = Number(values.functionId)
        if (initials.conf.openTypes[values.openCondition.openTypes[0]] === 'fixed') {
          data.openCondition = {
            type: values.openCondition.openTypes[0],
            params: {
              startTime: values.openCondition.params.startTime.format('YYYY-MM-DD HH:00:00'),
              endTime: values.openCondition.params.endTime.format('YYYY-MM-DD HH:00:00')
            }
          }
        } else if (initials.conf.openTypes[values.openCondition.openTypes[0]] === 'after') {
          data.openCondition = {
            type: values.openCondition.openTypes[0],
            params: values.openCondition.params
          }
        }
        data.productId = values.products[0]
        values.serverType ? (data.serverIdList = values.serverIdList) : (data.serverIds = values.serverIds)
        let posts = {
          form: data,
          path: {
            productId: values.products[0],
            serverId: '_'
          }
        }

        if (this.state.modal.modalType === 'template') {
          this.props.onCreate(posts)
        }
        this.props.onSubmitting()
        this.props.templateVVisible()
      }
    })
  }

  _serverFormat = (products, productId) => {
    let servers = products.filter(o => o.value == productId).map(v => v.children)[0]
    if (!servers) { servers = [] }
    return Object.values(servers)
  }

  handleChange = (value, selectedOptions) => {
    this.setState({
      config: {
        ...this.state.config,
        openCondition: value[0]
      }
    })
  }

  handleProductChange = (value) => {
    this.setState({
      config: {
        ...this.state.config,
        productId: value[0]
      }
    })
  }

  onServerTypeSwitch = (checked) => {
    this.setState({
      switch: checked ? 1 : 2
    })
  }

  render() {
    const { form: { getFieldDecorator }, dataFlow: { options, initials } } = this.props
    const initialValue = this.state.modal.currentItem
    const config = this.state.config
    if (productOpt.length == 0) {
      productOpt = options.products
    }
    serverOpt = this._serverFormat(options.globals.products, config.productId)

    if (goodOpt.length === 0) {
      goodOpt = options.goods
    }

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
        sm: { span: 7 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 12 }
      }
    }

    const tailFormItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 6 }
      },
      wrapperCol: {
        xs: { span: 24, offset: 0 },
        sm: { span: 12, offset: 6 }
      }
    }

    return (
      <Form onSubmit={this.handleSubmit}>
        <FormItem
          {...formItemLayout}
          label='产品ID'
          key='productId'
        >
          {getFieldDecorator('products', {
            initialValue: [initialValue.productId],
            rules: [{ type: 'array', required: true, message: '请选择产品ID!' }]
          })(
            <Cascader
              options={productOpt}
              showSearch
              onChange={this.handleProductChange}
              expandTrigger='hover'
              placeholder='选择产品 ID'
            />
            )}
        </FormItem>


        <FormItem
          {...formItemLayout}
          label='服务器选择方式'
        >
          {getFieldDecorator('serverType', {
            initialValue: this.state.switch === 1,
            valuePropName: 'checked'
          })(
            <Switch onChange={this.onServerTypeSwitch} checkedChildren={'多选'} unCheckedChildren={'区间'} />
            )}
        </FormItem>

        {
          this.state.switch === 1 ?
            <FormItem
              {...formItemLayout}
              label='选择服务器'
              key='serverIdList'
            >
              {getFieldDecorator('serverIdList', {
                initialValue: initialValue.serverIdList || [],
                rules: [{ type: 'array', required: true, message: '请选择服务器!' }]
              })(
                <TreeSelect
                  treeData={[{
                    label: '全选',
                    value: null,
                    key: '全选',
                    children: [...serverOpt]
                  }]}
                  showSearch
                  allowClear
                  treeDefaultExpandAll
                  multiple
                  treeCheckable
                  treeNodeFilterProp='label'
                  showCheckedStrategy={TreeSelect.SHOW_ALL}
                  searchPlaceholder='请选择服务器'
                  dropdownStyle={{
                    height: '30rem',
                    overflowY: 'auto'
                  }}
                />
                )}
            </FormItem>
            :
            <FormItem
              {...formItemLayout}
              label={(
                <span>
                  选择服务器&nbsp;
                  <Tooltip
                    title={
                      <div>连续区间用 (-) 分隔. <i style={{ color: '#f11738' }}>例：app_001-app_100</i><p>多段区间用 (,) 分割. <i style={{ color: '#f11738' }}>例：app_001-app_002,app_100-app_102</i></p></div>
                    }
                  >
                    <Icon type='question-circle-o' />
                  </Tooltip>
                </span>
              )}
            >
              {getFieldDecorator('serverIds', {
                rules: [{ required: true, message: '输入区间数值!', whitespace: true }]
              })(
                <Input type='textarea' placeholder='输入区间数值' autosize={{ minRows: 3, maxRows: 8 }} />
                )}
            </FormItem>
        }
        <FormItem
          {...formItemLayout}
          label='活动类型'
          key='functionId'
        >
          {getFieldDecorator('functionId', {
            initialValue: initialValue.functionId,
            rules: [{ required: true, message: '请填写活动类型!' }]
          })(
            <InputNumber min={0} disabled placeholder='填写活动类型' style={{ width: '100%' }} />
          )}
        </FormItem>

        <FormItem
          {...formItemLayout}
          label='模板 ID'
          key='templateId'
        >
          {getFieldDecorator('templateId', {
            initialValue: initialValue.templateId,
            rules: [{ required: true, message: '请填写模板 ID!' }]
          })(
            <InputNumber min={0} disabled placeholder='填写模板 ID' style={{ width: '100%' }} />
          )}
        </FormItem>

        <FormItem
          {...formItemLayout}
          label='名称'
          key='name'
        >
          {getFieldDecorator('name', {
            initialValue: initialValue.name,
            rules: [{ required: true, message: '请填写名称!' }]
          })(
            <Input disabled placeholder='填写名称' />
          )}
        </FormItem>

        <FormItem
          {...formItemLayout}
          label='开启条件'
          key='openCondition'
        >
          {getFieldDecorator('openCondition.openTypes', {
            initialValue: [config.openCondition],
            rules: [{ type: 'array', required: true, message: '开启条件!' }]
          })(
            <Cascader
              options={initials.enum.openTypes}
              showSearch
              onChange={this.handleChange}
              expandTrigger='hover'
              placeholder='选择开启条件'
            />
          )}
          {
            initials.conf.openTypes[config.openCondition] === 'fixed' &&
            <FormItem
              {...formItem2Layout}
              label='开始时间'
              key='openCondition.params.startTime'
              style={{ paddingTop: '16px' }}
            >
              {getFieldDecorator('openCondition.params.startTime', {
                rules: [{ required: true, message: '开启条件 开始时间!' }]
              })(
                <DatePicker
                  showTime={{ defaultValue: moment('05:00:00', 'HH:00:00') }}
                  format='YYYY-MM-DD HH:00:00'
                  placeholder='开始时间'
                  style={{ width: '100%' }}
                />
              )}
            </FormItem>
          }
          {
            initials.conf.openTypes[config.openCondition] === 'fixed' &&
            <FormItem
              {...formItem2Layout}
              label='结束时间'
              key='openCondition.params.endTime'
              style={{ paddingTop: '32px' }}
            >
              {getFieldDecorator('openCondition.params.endTime', {
                rules: [{ required: true, message: '开启条件 结束时间!' }]
              })(
                <DatePicker
                  showTime={{ defaultValue: moment('05:00:00', 'HH:00:00') }}
                  format='YYYY-MM-DD HH:00:00'
                  placeholder='结束时间'
                  style={{ width: '100%' }}
                />
              )}
            </FormItem>
          }
          {
            initials.conf.openTypes[config.openCondition] === 'after' &&
            <FormItem
              {...formItem2Layout}
              label='{X}天后开启'
              key='openCondition.params.afterDays'
              style={{ padding: '16px 0px' }}
            >
              {getFieldDecorator('openCondition.params.afterDays', {
                rules: [{ required: true, message: '可见条件 {X}天后开启!' }]
              })(
                <InputNumber min={0} placeholder='填写{X}天后开启' style={{ width: '100%' }} />
              )}
            </FormItem>
          }
          {
            initials.conf.openTypes[config.openCondition] === 'after' &&
            <FormItem
              {...formItem2Layout}
              label='持续天数'
              key='openCondition.params.lastDays'
              style={{ padding: '16px 0px' }}
            >
              {getFieldDecorator('openCondition.params.lastDays', {
                rules: [{ required: true, message: '可见条件 持续天数!' }]
              })(
                <InputNumber min={0} placeholder='填写持续天数' style={{ width: '100%' }} />
              )}
            </FormItem>
          }
        </FormItem>

        <FormItem {...tailFormItemLayout} key={Math.random()}>
          <Button type='primary' htmlType='submit' size='large' style={{ marginRight: 32 }}>提交</Button>
        </FormItem>
      </Form>
    )
  }
}

CreateForm.propTypes = {
  form: PropTypes.object,
  dataFlow: PropTypes.object,
  onCreate: PropTypes.func,
  onModalLoad: PropTypes.func,
  onSubmitting: PropTypes.func,
  templateVVisible: PropTypes.func
}

CreateForm.contextTypes = {
  router: PropTypes.object
}

const Create = Form.create()(CreateForm)

export default Create
