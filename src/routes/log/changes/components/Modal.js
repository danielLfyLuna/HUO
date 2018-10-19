import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Form, Input, Button, Cascader, TreeSelect, DatePicker, Switch, Tooltip, Icon } from 'antd'
import moment from 'moment'
import _ from 'lodash'

const FormItem = Form.Item
const RangePicker = DatePicker.RangePicker

class LogProducesModal extends Component {

  static propTypes = {
    form: PropTypes.object.isRequired,
    options: PropTypes.array.isRequired,
    source: PropTypes.object.isRequired,
    handleCancel: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
    onRender: PropTypes.func.isRequired
  }

  state = {
     serverTypeSwitch: 1,
     productIds: []
  }

  componentWillMount() {
    this.props.onRender({ renderState: false })
  }

  componentWillUnmount() {
    this.props.onRender({ renderState: true })
    this.setState({
      productIds: []
    })
  }

  // 从产品下拉框获取服务器下拉框选项
  onChange = (value) => {
    this.setState({
      productIds: value
    })
  }

  // 开关
  onServerTypeSwitch = (checked) => {
    this.setState({
      serverTypeSwitch: checked ? 1 : 0
    })
  }

  handleSubmit = (e) => {
    e.preventDefault()
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        let items = {}
        items = {
          productId: values.productId[0],
          playerId: values.playerId,
          nickname: values.nickname,
          startTime: values.times[0].format('YYYY-MM-DD HH:mm:ss'),
          endTime: values.times[1].format('YYYY-MM-DD HH:mm:ss')
        }
        if (values.datachangeSources.length > 0) {
          items.datachangeSources = values.datachangeSources
        }
        if (values.serverIdList && values.serverIdList.length > 0) {
          items.serverIdList = values.serverIdList
        }
        if (values.serverIds) {
          items.serverIds = values.serverIds
        }
        this.props.onSubmit({
          form: items
        })
        this.props.handleCancel()
      }
    })
  }

  handleReset = () => {
    this.props.form.resetFields()
  }

  render() {
    const {getFieldDecorator} = this.props.form

    // 产品 服务 下拉
    let proOptions = []
    _.map(this.props.options, (val, index) => {
      proOptions.push({label: val.label, value: val.value})
    })

    let serOptions = []
    _.map(this.props.options, (val, index) => {
      if (val.value == this.state.productIds[0]) {
        _.map(val.children, (v, index) => {
          serOptions.push({label: v.label, value: v.value})
        })
      }
    })

    // 处理下拉列表数据
    let sourceValue = []
    _.map(this.props.source, (val, idx) => {
      sourceValue.push({
        value: String(val),
        label: `${idx}(${val})`
      })
    })

    const rangeConfig = {
      rules: [{ type: 'array', required: true, message: '请选择起止时间' }],
      initialValue: [moment(new Date(), 'YYYY-MM-DD HH:mm:ss'), moment()]
    }

    return (
      <Form onSubmit={this.handleSubmit}>
        <FormItem label='产品名称'>
          {getFieldDecorator('productId', {
            rules: [{ required: true, message: '请选择产品(必选)' }]
          })(
            <Cascader
              style={{ width: '100%' }}
              options={proOptions}
              placeholder='请选择产品(必选)'
              onChange={this.onChange}
              showSearch
              expandTrigger='hover'
            />
          )}
        </FormItem>
        <FormItem
          label='目标服务器选择方式'
        >
          {getFieldDecorator('serverType', {
          })(
            <Switch defaultChecked={this.state.serverTypeSwitch === 1} onChange={this.onServerTypeSwitch} checkedChildren={'多选'} unCheckedChildren={'区间'} />
          )}
        </FormItem>
        {
          this.state.serverTypeSwitch === 1 ?
            <FormItem label='服务器名称'>
              { getFieldDecorator('serverIdList', {
                rules: [{ required: true, message: '请选择服务器(必选)' }]
              })(
                <TreeSelect
                  treeData={[{
                    label: '全选',
                    value: null,
                    key: '全选',
                    children: [...serOptions]
                  }]}
                  showSearch
                  allowClear
                  treeDefaultExpandAll
                  multiple
                  treeCheckable
                  treeNodeFilterProp='label'
                  style={{ maxHeight: 100, overflow: 'auto' }}
                  dropdownStyle={{ maxHeight: 300, overflow: 'auto', width: '60%' }}
                  showCheckedStrategy={TreeSelect.SHOW_CHILD}
                  searchPlaceholder='请选择服务器(必选)'
                />
              )}
            </FormItem> :
            <FormItem
              label={(
                <span>
                  服务器名称&nbsp;&nbsp;&nbsp;
                  <Tooltip
                    title='连续区间用 英文下(-) 过渡, 间断区间用 英文下(,) 分隔. 例：app_001-app_002,app_100-app_102'
                    placement='right'
                  >
                    <Icon type='question-circle-o' />
                  </Tooltip>
                </span>
              )}
            >
              { getFieldDecorator('serverIds', {
                rules: [{ required: true, message: '请填写服务器(必选)' }]
              })(
                <Input
                  placeholder='请填写服务器(必选)'
                />
              )}
            </FormItem>
        }
        <FormItem label='时间'>
          {getFieldDecorator('times', rangeConfig)(
            <RangePicker showTime format='YYYY-MM-DD HH:mm:ss' />
          )}
        </FormItem>
        <FormItem label='玩家昵称'>
          {getFieldDecorator('nickname', {
            rules: [{ required: false, message: '请输入玩家昵称' }],
            initialValue: ''
          })(
            <Input placeholder='玩家昵称' />
          )}
        </FormItem>
        <FormItem label='玩家ID'>
          {getFieldDecorator('playerId', {
            rules: [{ required: false, message: '请输入玩家ID' }],
            initialValue: ''
          })(
            <Input placeholder='玩家ID' />
          )}
        </FormItem>
        <FormItem
          label='变化源'
        >
          {getFieldDecorator('datachangeSources', {
            initialValue: [],
            rules: [
              { required: false, message: '请输入变化源' }
            ]
          })(
            <TreeSelect
              treeData={[{
                label: '全选',
                value: null,
                key: '全选',
                children: [...sourceValue]
              }]}
              showSearch
              allowClear
              treeDefaultExpandAll
              multiple
              treeCheckable
              treeNodeFilterProp='label'
              showCheckedStrategy={TreeSelect.SHOW_CHILD}
              searchPlaceholder='请选择变化源'
              dropdownStyle={{height: 300}}
            />
          )}
        </FormItem>
        <FormItem>
          <Button type='primary' htmlType='submit' >提交</Button>
          <Button type='ghost' htmlType='button' onClick={this.handleReset} style={{marginLeft: '8px'}}>重置</Button>
        </FormItem>
      </Form>
    )
  }
}
const Modal = Form.create()(LogProducesModal)

export default Modal
