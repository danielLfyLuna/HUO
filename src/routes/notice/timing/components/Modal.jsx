import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Form, Input, Button, Select, TreeSelect, DatePicker, InputNumber } from 'antd'
import _ from 'lodash'
import moment from 'moment'

const FormItem = Form.Item
const Option = Select.Option
const RangePicker = DatePicker.RangePicker

class NoticesTimingModal extends Component {

  static propTypes = {
    options: PropTypes.array,
    form: PropTypes.object,
    onSubmitting: PropTypes.func,
    onCreate: PropTypes.func
  }

  state = {
    productId: 0,
    circulationType: 1,
    enum: {
      noticeTypes: [
        { label: '定时公告', value: 1 },
        { label: '跑马灯公告', value: 100 }
      ],
      circleTypes: [
        { label: '无限循环', value: 1 },
        { label: '限定次数', value: 2 },
        { label: '限定时间', value: 3 }
      ],
      timeUnits: [
        { label: '秒', value: 1 },
        { label: '分钟', value: 2 },
        { label: '小时', value: 3 },
        { label: '天', value: 4 },
        { label: '永久', value: 5 }
      ]
    }
  }

  constructor(props) {
    super(props)
    this.products = []
    this.noticeTypes = []
    this.circleTypes = []
    this.timeUnits = []
  }

  componentWillMount() {
    _.map(this.props.options, (value, index) => {
      this.products.push(
        <Option key={value.value} value={value.value}>{value.label}</Option>
      )
    })
    _.map(this.state.enum.noticeTypes, (value, index) => {
      this.noticeTypes.push(
        <Option key={value.value} value={value.value}>{value.label}</Option>
      )
    })
    _.map(this.state.enum.circleTypes, (value, index) => {
      this.circleTypes.push(
        <Option key={value.value} value={value.value}>{value.label}</Option>
      )
    })
    _.map(this.state.enum.timeUnits, (value, index) => {
      this.timeUnits.push(
        <Option key={value.value} value={value.value}>{value.label}</Option>
      )
    })
  }

  handleReset = () => {
    this.props.form.resetFields()
  }

  handleProductSelect = (value) => {
    this.setState({
      productId: value
    })
  }

  handleCirculationSelect = (value) => {
    this.setState({
      circulationType: value
    })
  }

  handleSubmit = (e) => {
    e.preventDefault()
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        let data = {
          title: values.title,
          type: values.type,
          circleType: values.circleType,
          count: values.count,
          state: values.state,
          interval: values.interval,
          intervalUnit: values.intervalUnit,
          content: values.content,
          productId: values.productId,
          serverIdList: values.serverIdList
        }
        if (values.time) {
          data.beginTime = values.time[0].format('YYYY-MM-DD HH:mm:ss')
          data.endTime = values.time[1].format('YYYY-MM-DD HH:mm:ss')
        }
        if (values.maxCount) {
          data.maxCount = values.maxCount
        }
        this.props.onCreate({
          productId: values.productId,
          data: data
        })
        this.props.onSubmitting()
      }
    })
  }


  render() {
    const { getFieldDecorator } = this.props.form

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

    return (
      <Form onSubmit={this.handleSubmit}>
        <FormItem
          {...formItemLayout}
          label='标题'
        >
          {getFieldDecorator('title', {
            rules: [{ required: true, message: '请填写公告标题!' }]
          })(
            <Input />
          )}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label='公告类型'
        >
          {getFieldDecorator('type', {
            rules: [
              { required: true, message: '请选择产品' }
            ]
          })(
            <Select>
              {this.noticeTypes}
            </Select>
          )}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label='循环模式'
        >
          {getFieldDecorator('circleType', {
            initialValue: 1,
            rules: [
              { required: true, message: '请选择循环模式' }
            ]
          })(
            <Select onChange={this.handleCirculationSelect}>
              {this.circleTypes}
            </Select>
          )}
        </FormItem>

        {
          this.state.circulationType == 3 &&
          <FormItem
            {...formItemLayout}
            label='起止时间'
          >
            {getFieldDecorator('time', {
              rules: [{ type: 'array', required: true, message: '请选择起止时间' }],
              initialValue: [moment('00:00:00', 'HH:mm:ss'), moment('00:00:00', 'HH:mm:ss').subtract({days: -1})]
            })(
              <RangePicker showTime format='YYYY-MM-DD HH:mm:ss' />
            )}
          </FormItem>
        }

        {
          this.state.circulationType == 2 &&
          <FormItem
            {...formItemLayout}
            label='循环次数'
          >
            {getFieldDecorator('maxCount', {
              initialValue: 1,
              rules: [{ required: true, message: '请选择循环次数' }]
            })(
              <InputNumber min={0} />
            )}
          </FormItem>
        }

        <FormItem
          {...formItemLayout}
          label='循环间隔'
        >
          {getFieldDecorator('interval', {
            initialValue: 1,
            rules: [{ required: true, message: '请选择循环间隔' }]
          })(
            <InputNumber min={0} />
          )}
        </FormItem>

        <FormItem
          {...formItemLayout}
          label='时间单位'
        >
          {getFieldDecorator('intervalUnit', {
            rules: [
              { required: true, message: '请选择时间单位' }
            ]
          })(
            <Select>
              {this.timeUnits}
            </Select>
          )}
        </FormItem>

        <FormItem
          {...formItemLayout}
          label='内容'
        >
          {getFieldDecorator('content', {
            rules: [{ required: true, message: '请填写公告内容!' }]
          })(
            <Input type='textarea' rows={10} />
          )}
        </FormItem>

        <FormItem
          {...formItemLayout}
          label='选择产品'
        >
          {getFieldDecorator('productId', {
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
          {getFieldDecorator('serverIdList', {
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
        <FormItem {...tailFormItemLayout}>
          <Button type='primary' htmlType='submit' style={{ marginRight: '8px' }}>提交</Button>
          <Button type='ghost' htmlType='button' onClick={this.handleReset}>重置</Button>
        </FormItem>
      </Form>
    )
  }
}

const Modal = Form.create()(NoticesTimingModal)

export default Modal
