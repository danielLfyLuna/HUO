import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Form, Input, Button, Cascader, TreeSelect, DatePicker, Switch, Tooltip, Icon } from 'antd'
import moment from 'moment'
import _ from 'lodash'

const FormItem = Form.Item
const RangePicker = DatePicker.RangePicker

class LogProducesModal extends Component {

  static propTypes = {
    options: PropTypes.array.isRequired,
    form: PropTypes.object.isRequired,
    item: PropTypes.object.isRequired,
    produce: PropTypes.object.isRequired,
    fetchGoodsMap: PropTypes.func.isRequired,
    produceSources: PropTypes.func.isRequired,
    onCreate: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
    onRender: PropTypes.func.isRequired
  }

  state = {
     indeterminate: true,
     checkAll: false,
     productId: '',
     cellType: '',
     serverPort: '',
     serverTypeSwitch: 1,
     productIds: []
  }

  componentWillMount() {
    this.props.onRender({ renderState: false })
    this.props.produceSources()
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
    this.props.fetchGoodsMap({productId: value[0]})
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
      // if (values.produceSources.length === 0) { values.produceSources = '' }
      if (!err) {
        let items = {}
        items = {
          itemIdList: [],
          playerId: values.playerId,
          nickname: values.nickname,
          startTime: values['range-time-picker'][0].format('YYYY-MM-DD HH:mm:ss'),
          endTime: values['range-time-picker'][1].format('YYYY-MM-DD HH:mm:ss'),
          productId: values.productId[0]
        }
        if (values.produceSources.length > 0) {
          items.produceSources = values.produceSources
        }
        // items.itemId = values.itemId.length > 0 ? values.itemId[0] : ''
        if (values.itemId0.length > 0) {
          items.itemIdList = items.itemIdList.concat(values.itemId0)
        }
        if (values.itemId4.length > 0) {
          items.itemIdList = items.itemIdList.concat(values.itemId4)
        }
        if (values.itemId5.length > 0) {
          items.itemIdList = items.itemIdList.concat(values.itemId5)
        }

        if (values.serverIdList) {
          items.serverIdList = values.serverIdList
        }
        if (values.serverIds) {
          items.serverIds = values.serverIds
        }
        this.props.onSubmit({
          form: items
        })
        this.props.onCreate()
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
    let produceValue = []
    for (let key in this.props.produce.produceSources) {
      produceValue.push({key: key, value: String(this.props.produce.produceSources[key]), label: `${key}(${this.props.produce.produceSources[key]})`})
    }

    const rangeConfig = {
      rules: [{ type: 'array', required: true, message: '请选择起止时间' }],
      initialValue: [moment(new Date(), 'YYYY-MM-DD HH:mm:ss'), moment()]
    }

    // 道具 下拉
    let items0 = []
    let items4 = []
    let items5 = []
    if (this.props.item.options[0]) {
      _.map(this.props.item.options[0], (value, key) => {
          items0.push(
            {value: key, key: 'item0' + key, label: `${value}(${key})`}
          )
      })
    }
    if (this.props.item.options[4]) {
      _.map(this.props.item.options[4], (value, key) => {
          items4.push(
            {value: key, key: 'item4' + key, label: `${value}(${key})`}
          )
      })
    }
    if (this.props.item.options[5]) {
      _.map(this.props.item.options[5], (value, key) => {
          items5.push(
            {value: key, key: 'item5' + key, label: `${value}(${key})`}
          )
      })
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
            // initialValue: this.state.serverTypeSwitch === 1
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
          {getFieldDecorator('range-time-picker', rangeConfig)(
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
        <FormItem label='道具ID'>
          { getFieldDecorator('itemId0', {
            rules: [{ required: false, message: '请选择道具' }],
            initialValue: []
          })(
            <TreeSelect
              treeData={[{
                label: '全选',
                value: null,
                key: '全选',
                children: items0
              }]}
              showSearch
              allowClear
              treeDefaultExpandAll
              multiple
              treeCheckable
              treeNodeFilterProp='label'
              showCheckedStrategy={TreeSelect.SHOW_CHILD}
              searchPlaceholder='道具列表'
              dropdownStyle={{height: 300}}
            />
          )}
        </FormItem>
        <FormItem label='技能ID'>
          { getFieldDecorator('itemId4', {
            rules: [{ required: false, message: '请选择技能' }],
            initialValue: []
          })(
            <TreeSelect
              treeData={[{
                label: '全选',
                value: null,
                key: '全选',
                children: items4
              }]}
              showSearch
              allowClear
              treeDefaultExpandAll
              multiple
              treeCheckable
              treeNodeFilterProp='label'
              showCheckedStrategy={TreeSelect.SHOW_CHILD}
              searchPlaceholder='技能列表'
              dropdownStyle={{height: 300}}
            />
          )}
        </FormItem>
        <FormItem label='武将ID'>
          { getFieldDecorator('itemId5', {
            rules: [{ required: false, message: '请选择武将' }],
            initialValue: []
          })(
            <TreeSelect
              treeData={[{
                label: '全选',
                value: null,
                key: '全选',
                children: items5
              }]}
              showSearch
              allowClear
              treeDefaultExpandAll
              multiple
              treeCheckable
              treeNodeFilterProp='label'
              showCheckedStrategy={TreeSelect.SHOW_CHILD}
              searchPlaceholder='武将列表'
              dropdownStyle={{height: 300}}
            />
          )}
        </FormItem>
        <FormItem
          label='生产来源'
        >
          {getFieldDecorator('produceSources', {
            initialValue: [],
            rules: [
              { required: false, message: '请输入生产来源' }
            ]
          })(
            <TreeSelect
              treeData={[{
                label: '全选',
                value: null,
                key: '全选',
                children: [...produceValue]
              }]}
              showSearch
              allowClear
              treeDefaultExpandAll
              multiple
              treeCheckable
              treeNodeFilterProp='label'
              showCheckedStrategy={TreeSelect.SHOW_CHILD}
              searchPlaceholder='请选择生产来源'
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
