import React, {Component} from 'react'
import _ from 'lodash'
import PropTypes from 'prop-types'
import { Form, Input, Button, Select, TreeSelect, Icon, InputNumber } from 'antd'
const FormItem = Form.Item
const Option = Select.Option
const { TextArea } = Input
class NoticesUpdateModal extends Component {

  static propTypes = {
    form: PropTypes.object.isRequired,
    item: PropTypes.object.isRequired,
    // login: PropTypes.object.isRequired,
    options: PropTypes.array,
    onSubmitting: PropTypes.func.isRequired,
    itemsActionCreator: PropTypes.func.isRequired,
    onUpdate: PropTypes.func.isRequired,
    updateUpdateNotice: PropTypes.func.isRequired,
    addUpdateNotice: PropTypes.func.isRequired,
    onModalLoad: PropTypes.func.isRequired
  }

  state = {
    productId: '',
    currentItem: {},
    modalType: ''
  }

  products = []

  initialKey = []
  initialValue = []
  initialObj = {}
  uuid = this.initialKey.length

  handelItemRemove = (k) => {
    const { form } = this.props
    // can use data-binding to get
    const keys = form.getFieldValue('keys')
    // We need at least one passenger
    if (keys.length === 0) {
      return
    }

    // can use data-binding to set
    form.setFieldsValue({
      keys: keys.filter(key => key !== k)
    })
  }

  handleItemAdd = () => {
    this.uuid++
    const { form } = this.props
    // 获取一个输入控件的值
    const keys = form.getFieldValue('keys')
    const nextKeys = keys.concat(this.uuid)
    // can use data-binding to set
    // important! 设置一组输入控件的值
    form.setFieldsValue({
      keys: nextKeys
    })
  }

  componentWillMount() {
    const { currentItem, modalType } = this.props.onModalLoad()
    const options = this.props.options
    _.map(options, (value, index) => {
      this.products.push(
        <Option key={value.value} value={value.value}>{value.label}</Option>
      )
    })
    this.setState({
      productId: currentItem ? currentItem.productId : options[0].value,
      currentItem: modalType === 'create' ? {} : currentItem,
      modalType: modalType
    })
    currentItem.productId && this.props.itemsActionCreator(currentItem.productId)
  }

  handleReset = () => {
    this.props.form.resetFields()
  }

  handleProductSelect = (productId) => {
    this.props.itemsActionCreator(productId)
    this.setState({
      productId: productId
    })
  }

  handleSubmit = (e) => {
    e.preventDefault()
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        if (this.state.modalType === 'create') {
          this.props.addUpdateNotice(values)
        } else {
          this.props.updateUpdateNotice(values)// 真实触发 Module action PUT 请求
          this.props.onUpdate(values)// 更新表格动效
        }
        this.props.onSubmitting()
      }
    })
  }


  render() {
    const { getFieldDecorator, getFieldValue } = this.props.form
    const disabled = this.state.modalType !== 'create'

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
        xs: {
          span: 24,
          offset: 0
        },
        sm: {
          span: 14,
          offset: 6
        }
      }
    }

    // 服务下拉
    let productsIndex = 0
    let id = this.state.productId || 0
    _.map(this.props.options, (value, index) => {
      if (_.toNumber(id) === _.toNumber(value.value)) {
        productsIndex = index
      }
    })

    let servers = []
    let treeData = []
    _.map(this.props.options[productsIndex].children, (value, index) => {
      servers.push(
        <Option key={value.value} value={value.value}>{value.label}</Option>
      )
      treeData.push({
        label: value.label,
        value: value.value,
        key: index
      })
    })

    // 道具下拉
    let items = []
    _.map(this.props.item.data, (value, key) => {
      items.push(
        <Option key={key} value={key}>{key + '(' + value + ')'}</Option>
      )
    })

    // 用于和表单进行双向绑定
    // 创建keys 的 names
    this.state.currentItem.rewards && this.state.currentItem.rewards.map((k, index) => {
      if (!this.initialKey.includes(index)) {
        this.initialKey.push(index)
        this.initialValue.push(k)
        this.uuid++
      }
    })

    getFieldDecorator('keys', { initialValue: this.initialKey.length > 0 ? this.initialKey : [] })
    const keys = getFieldValue('keys')
    const formItems = keys.map((k, index) => {
      return (
        <FormItem
          {...(index === 0 ? formItemLayout : tailFormItemLayout)}
          label={index === 0 ? '道具列表' : ''}
          required={false}
          key={k}
        >
          {getFieldDecorator(`item-${k}`, {
            initialValue: this.initialValue.length > 0 && this.initialValue[k] ? this.initialValue[k].itemId : '请选择道具',
            validateTrigger: ['onChange', 'onBlur'],
            rules: [{
              required: true,
              message: '请选择道具'
            }]
          })(
            <Select
              showSearch
              filterOption={(input, option) => option.props.value.toLowerCase().indexOf(input.toLowerCase()) >= 0}
              placeholder='道具列表'
              notFoundContent='无道具,请选择产品'
              style={{ width: '40%', marginRight: 8 }}>
              {items}
            </Select>
          )}
          {getFieldDecorator(`number-${k}`, {
            initialValue: this.initialValue.length > 0 && this.initialValue[k] ? this.initialValue[k].num : 1,
            validateTrigger: ['onChange', 'onBlur'],
            rules: [{
              required: true,
              message: '请填写道具数量'
            }]
          })(
            <InputNumber placeholder='数量' style={{ width: '20%', marginRight: 8 }} />
          )}
          <Icon
            className='dynamic-delete-button'
            type='minus-circle-o'
            disabled={keys.length === 1}
            onClick={() => this.handelItemRemove(k)}
          />
        </FormItem>
      )
    })

    return (
      <Form onSubmit={this.handleSubmit}>
        {getFieldDecorator('id', {
          initialValue: this.state.currentItem.id
        })(
          <Input type='hidden' />
        )}
        <FormItem label='版本号'>
          {getFieldDecorator('appversion', {
            initialValue: this.state.currentItem.appversion,
            rules: [
              { required: true, pattern: /\d{1,2}.\d{1,2}.\d{1,3}$/i, message: '请填写有效版本号! 例:1.1.1' }
            ]
          })(
            <Input disabled={disabled} />
          )}
        </FormItem>
        {/* {
          this.state.modalType === 'update' &&
          <FormItem label='状态'>
            {getFieldDecorator('open', {
              initialValue: this.state.currentItem.open
            })(
              <Switch checkedChildren={'开'} unCheckedChildren={'关'} defaultChecked={!!this.state.currentItem.open} />
            )}
          </FormItem>
        } */}
        <FormItem label='内容'>
          {getFieldDecorator('content', {
            initialValue: this.state.currentItem.content,
            rules: [{ required: true, message: '请填写公告内容!' }]
          })(
            <TextArea type='textarea' rows={5} />
          )}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label='选择产品'
        >
          {getFieldDecorator('productId', {
            initialValue: this.state.productId,
            rules: [
              { required: true, message: '请选择产品' }
            ]
          })(
            <Select onChange={this.handleProductSelect}>
              {this.products}
            </Select>
          )}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label='选择服务器'
          hasFeedback
        >
          {getFieldDecorator('serverIds', {
            initialValue: this.state.currentItem.serverIds,
            rules: [{ required: true, message: '请选择服务器!' }]
          })(
            <TreeSelect
              treeData={[{
                label: '全选',
                value: null,
                key: '全选',
                children: [...treeData]
              }]}
              showSearch
              allowClear
              treeDefaultExpandAll
              multiple
              treeCheckable
              treeNodeFilterProp='label'
              showCheckedStrategy={TreeSelect.SHOW_CHILD}
              searchPlaceholder='请选择服务器'
            />
          )}
        </FormItem>
        {formItems}
        <FormItem {...tailFormItemLayout}>
          <Button type='dashed' onClick={this.handleItemAdd} style={{ width: '60%' }}>
            <Icon type='plus' /> 添加道具
          </Button>
        </FormItem>
        <FormItem {...tailFormItemLayout}>
          <Button type='primary' htmlType='submit' >提交</Button>
          <Button type='ghost' htmlType='button' onClick={this.handleReset}>重置</Button>
        </FormItem>
      </Form>
    )
  }
}

const Modal = Form.create()(NoticesUpdateModal)

export default Modal
