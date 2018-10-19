import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Form, Input, Cascader, Button, DatePicker, InputNumber, TreeSelect, Icon, Switch } from 'antd'
import _ from 'lodash'
const FormItem = Form.Item
const { RangePicker } = DatePicker
import moment from 'moment'
import 'moment/locale/zh-cn'
moment.locale('zh-cn')

let productOpt = []
let serverOpt = []
let itemOPt = []
let rewardList = []
// let uuid = 0

let itemTypes = [
  { label: '道具', value: 0 },
  { label: '技能', value: 4 },
  { label: '武将', value: 5 }
]

class UpdateForm extends Component {

  componentWillMount() {
    this.props.fetchProductsMap()
    this.props.itemsActionCreator([this.props.location.query.productId])
  }

  _activityReducer = (options, templateId) => {
    return _.reduce(options, (result, option) => {
      if (option.templateId === templateId) {
        result = option
      }
      return result
    }, {})
  }

  _productReduce = (options) => {
    return _.reduce(options, (result, option) => {
      result.push({ value: option.value, label: option.label })
      return result
    }, [])
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

  _itemReduce = (options) => {
    return _.reduce(options, (result, option, key) => {
      result.push({ value: key, label: `${option}(${key})` })
      return result
    }, [])
  }

  _numFormat = (value) => `${value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`
  _numParse = (value) => value.toString().replace(/\$\s?|(,*)/g, '')

  handleProductSelect = (product) => {
    serverOpt = this._serverReduce(this.props.products.options, product[0])
    this.props.itemsActionCreator(product)
  }

  handleSubmit = (e) => {
    e.preventDefault()
    this.props.form.validateFieldsAndScroll((err, values) => {
      let detail = this._activityReducer(this.props.activities.list, Number(this.props.location.query.templateId))
      let data = {}
      data.activityItems = _.reduce(values.activityItems, (result, option, index) => {
        let obj = {}
        obj.activityItemId = option.activityItemId
        obj.description = option.description
        obj.clientValue = option.clientValue
        obj.coin = option.coin
        obj.coinToken = option.coinToken
        obj.rmb = option.rmb
        obj.vipValue = option.vipValue
        obj.targetValue = option.targetValue
        obj.completeConditionIds = detail.activityItems[index].completeConditionIds
        obj.rewardList = _.reduce(option.rewardList, (res, opt) => {
          res.push({
            num: opt.num,
            templateId: opt.templateId.length ? Number(opt.templateId[0]) : opt.templateId
          })
          return res
        }, [])
        result.push(obj)
        return result
      }, [])
      data.functionId = values.functionId
      data.templateId = values.templateId
      data.name = values.name
      data.openCondition = {
        desc: values.openCondition.desc,
        type: values.openCondition.type,
        params: {
          startTime: values.openCondition.params ? values.openCondition.params['time-picker'][0].format('YYYY-MM-DD HH:mm:ss') : detail.openCondition.params.startTime,
          endTime: values.openCondition.params ? values.openCondition.params['time-picker'][1].format('YYYY-MM-DD HH:mm:ss') : detail.openCondition.params.endTime
        }
      }
      data.visibleCondition = {
        desc: values.visibleCondition.desc,
        type: values.visibleCondition.type,
        params: values.visibleCondition.params
      }
      data.clearServiceData = values.clearServiceData
      data.productId = values.products[0]
      data.serverIdList = values.serverIdList
      data.serverId = this.props.location.query.serverId

      if (!err) {
        if (this.props.location.query.handle === 'update') {
          this.props.updateActivity(data)
        }
      }
    })
  }

  uuid = 0

  handleItemRemove(k) {
    const { form } = this.props
    const keys = form.getFieldValue('keys')
    if (keys.length === 1) {
      return
    }

    form.setFieldsValue({
      keys: keys.filter(key => key !== k)
    })
  }

  handleItemAdd = () => {
    this.uuid++
    const { form } = this.props
    const keys = form.getFieldValue('keys')
    const nextKeys = keys.concat(this.uuid)
    form.setFieldsValue({
      keys: nextKeys
    })
  }


  render() {
    const { form: { getFieldDecorator, getFieldValue }, location, activities, products, items } = this.props
    const check = location.query.handle === 'detail'
    const detail = this._activityReducer(activities.list, Number(location.query.templateId))
    const activityItems = detail.activityItems || []
    if (productOpt.length == 0) {
      productOpt = this._productReduce(products.options)
    }
    if (serverOpt.length == 0) {
      serverOpt = this._serverReduce(products.options, detail.productId)
    }
    itemOPt = this._itemReduce(items)

    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 4 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 8 }
      }
    }

    const formItem2Layout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 6 }
      },
      wrapperCol: {
        xs: { span: 24, offset: 0 },
        sm: { span: 16, offset: 0 }
      }
    }

    const tailFormItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 4 }
      },
      wrapperCol: {
        xs: { span: 24, offset: 0 },
        sm: { span: 12, offset: 4 }
      }
    }

    const tail2FormItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 4 }
      },
      wrapperCol: {
        xs: { span: 24, offset: 0 },
        sm: { span: 12, offset: 0 }
      }
    }

    getFieldDecorator('keys', { initialValue: [] })
    const keys = getFieldValue('keys')
    const formItems = keys.map((k, index) => {
      return (
        <FormItem
          {...(index === 0 ? tail2FormItemLayout : tailFormItemLayout)}
          label={index === 0 ? '道具列表' : ''}
          required={false}
          key={k}
        >
          {getFieldDecorator(`item-${k}`, {
            validateTrigger: ['onChange', 'onBlur'],
            rules: [{
              required: true,
              whitespace: true,
              message: '请选择'
            }]
          })(
            <Cascader options={itemOPt} style={{ width: '20%', marginRight: 8 }} />
          )}
          {getFieldDecorator(`type-${k}`, {
            validateTrigger: ['onChange', 'onBlur'],
            rules: [{
              required: true,
              message: '请选择类型'
            }]
          })(
            <Cascader options={itemTypes} style={{ width: '20%', marginRight: 8 }} />
          )}
          {getFieldDecorator(`number-${k}`, {
            validateTrigger: ['onChange', 'onBlur'],
            rules: [{
              required: true,
              message: '请填写道具数量'
            }]
          })(
            <InputNumber
              min={0}
              formatter={this._numFormat}
              parser={this._numParse}
              placeholder='数量'
              style={{ width: '10%', marginRight: 8 }}
            />
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

    const formActivityItems = activityItems.map((option, index) => {
      rewardList = option.rewardList || []
      return (
        <div>
          <FormItem
            {...formItemLayout}
            label={`礼包 ID #${index + 1}`}
            key={index + 1}
          >
            {getFieldDecorator(`activityItems[${index}].activityItemId`, {
              initialValue: option.activityItemId,
              rules: [{ required: true, message: '礼包 ID' }]
            })(
              <Input disabled style={{ width: '100%' }} />
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label={`描述 #${index + 1}`}
            key={index + 2}
          >
            {getFieldDecorator(`activityItems[${index}].description`, {
              initialValue: option.description,
              rules: [{ required: true, message: '描述' }]
            })(
              <Input disabled={check} style={{ width: '100%' }} />
            )}
          </FormItem>
          {
            option.preActivityItemId > 0 &&
            <FormItem
              {...formItemLayout}
              label={`前一个礼包 ID #${index + 1}`}
              key={index + 3}
              >
                {getFieldDecorator(`activityItems[${index}].preActivityItemId`, {
                  initialValue: option.preActivityItemId,
                  rules: [{ required: true, message: '前一个礼包 ID' }]
                })(
                  <InputNumber disabled style={{ width: '100%' }} />
                )}
              </FormItem>
          }
          <FormItem
            {...formItemLayout}
            label={`客户端显示值 #${index + 1}`}
            key={index + 4}
          >
            {getFieldDecorator(`activityItems[${index}].clientValue`, {
              initialValue: option.clientValue,
              rules: [{ required: true, message: '客户端显示值' }]
            })(
              <InputNumber
                min={0}
                formatter={this._numFormat}
                parser={this._numParse}
                disabled={check}
                style={{ width: '100%' }}
              />
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label={`钻石 #${index + 1}`}
            key={index + 5}
          >
            {getFieldDecorator(`activityItems[${index}].coin`, {
              initialValue: option.coin,
              rules: [{ required: true, message: '钻石' }]
            })(
              <InputNumber
                min={0}
                formatter={this._numFormat}
                parser={this._numParse}
                disabled={check}
                style={{ width: '100%' }}
              />
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label={`系统钻石 #${index + 1}`}
            key={index + 6}
          >
            {getFieldDecorator(`activityItems[${index}].coinToken`, {
              initialValue: option.coinToken,
              rules: [{ required: true, message: '系统钻石' }]
            })(
              <InputNumber
                min={0}
                formatter={this._numFormat}
                parser={this._numParse}
                disabled={check}
                style={{ width: '100%' }}
              />
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label={`人民币 #${index + 1}`}
            key={index + 7}
          >
            {getFieldDecorator(`activityItems[${index}].rmb`, {
              initialValue: option.rmb,
              rules: [{ required: true, message: '人民币' }]
            })(
              <InputNumber
                min={0}
                formatter={this._numFormat}
                parser={this._numParse}
                disabled={check}
                style={{ width: '100%' }}
              />
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label={`VIP 成长值 #${index + 1}`}
            key={index + 8}
          >
            {getFieldDecorator(`activityItems[${index}].vipValue`, {
              initialValue: option.vipValue,
              rules: [{ required: true, message: 'VIP 成长值' }]
            })(
              <InputNumber
                min={0}
                formatter={this._numFormat}
                parser={this._numParse}
                disabled={check}
                style={{ width: '100%' }}
              />
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label={`目标值 #${index + 1}`}
            key={index + 9}
          >
            {getFieldDecorator(`activityItems[${index}].targetValue`, {
              initialValue: option.targetValue,
              rules: [{ required: true, message: '目标值' }]
            })(
              <InputNumber
                min={0}
                formatter={this._numFormat}
                parser={this._numParse}
                disabled
                style={{ width: '100%' }}
              />
            )}
          </FormItem>
          {
            rewardList.map((opt, idx) => {
              return (
                <div>
                  <FormItem
                    {...(idx === 0 ? tail2FormItemLayout : tailFormItemLayout)}
                    label={idx === 0 ? '道具列表' : ''}
                    required={false}
                    key={idx + 1000}
                  >
                    {getFieldDecorator(`activityItems[${index}].rewardList[${idx}].templateId`, {
                      initialValue: [`${opt.templateId}`],
                      rules: [{
                        required: true,
                        message: '请选择道具'
                      }]
                    })(
                      <Cascader options={itemOPt} showSearch disabled={check} style={{ width: '30%', marginRight: 8 }} />
                    )}
                    {/* {getFieldDecorator(`activityItems[${index}].rewardList[${idx}].type`, {
                      initialValue: [opt.type],
                      rules: [{
                        required: true,
                        message: '请选择类型'
                      }]
                    })(
                      <Cascader options={itemTypes} style={{ width: '20%', marginRight: 8 }} />
                    )} */}
                    {getFieldDecorator(`activityItems[${index}].rewardList[${idx}].num`, {
                      initialValue: opt.num,
                      rules: [{
                        required: true,
                        message: '请填写数量'
                      }]
                    })(
                      <InputNumber
                        min={0}
                        formatter={this._numFormat}
                        parser={this._numParse}
                        placeholder='数量'
                        disabled={check}
                        style={{ width: '20%', marginRight: 8 }}
                      />
                    )}
                    {/* <Icon
                      className='dynamic-delete-button'
                      type='minus-circle-o'
                      disabled={rewardList.length === 1}
                      onClick={() => this.handelItemRemove(idx + 1000)}
                    /> */}
                  </FormItem>
                </div>
              )
            })
          }
          {
            formItems
          }
          {/* <FormItem {...tailFormItemLayout}>
            <Button type='dashed' onClick={this.handleItemAdd}>
              <Icon type='plus' />添加道具
            </Button>
          </FormItem> */}
        </div>
      )
    })



    return (
      <Form onSubmit={this.handleSubmit}>
        <FormItem
          {...formItemLayout}
          label='活动类型'
        >
          {getFieldDecorator('functionId', {
            initialValue: detail.functionId,
            rules: [{ required: true, message: '活动类型' }]
          })(
            <InputNumber disabled style={{ width: '100%' }} />
          )}
        </FormItem>

        <FormItem
          {...formItemLayout}
          label='活动 ID'
        >
          {getFieldDecorator('templateId', {
            initialValue: detail.templateId,
            rules: [{ required: true, message: '活动 ID!' }]
          })(
            <InputNumber disabled style={{ width: '100%' }} />
          )}
        </FormItem>

        <FormItem
          {...formItemLayout}
          label='活动名称'
        >
          {getFieldDecorator('name', {
            initialValue: detail.name,
            rules: [{ required: true, message: '活动名称' }]
          })(
            <Input disabled={check} />
          )}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label='开启条件'
        >
          <FormItem
            {...formItem2Layout}
            label='描述'
          >
            {getFieldDecorator('openCondition.desc', {
              initialValue: detail.openCondition.desc,
              rules: [{ required: true, message: '开启条件 描述!' }]
            })(
              <Input disabled />
            )}
          </FormItem>
          <div>&nbsp;</div>
          <FormItem
            {...formItem2Layout}
            label='类型'
          >
            {getFieldDecorator('openCondition.type', {
              initialValue: detail.openCondition.type,
              rules: [{ required: true, message: '开启条件 类型!' }]
            })(
              <Input disabled />
            )}
          </FormItem>
          <div>&nbsp;</div>
          {
            detail.openCondition.params.startTime !== '-1' && detail.openCondition.params.endTime !== '-1' &&
            <FormItem
              {...formItem2Layout}
              label='开始&结束'
            >
              {getFieldDecorator('openCondition.params.time-picker', {
                initialValue: [
                  moment(detail.openCondition.params.startTime),
                  moment(detail.openCondition.params.endTime)
                ],
                rules: [{ required: true, message: '开启条件 时间!' }]
              })(
                <RangePicker showTime format='YYYY-MM-DD HH:mm:ss' disabled={check} />
              )}
            </FormItem>
          }
        </FormItem>
        <FormItem
          {...formItemLayout}
          label='可见条件'
        >
          <FormItem
            {...formItem2Layout}
            label='描述'
          >
            {getFieldDecorator('visibleCondition.desc', {
              initialValue: detail.visibleCondition.desc,
              rules: [{ required: true, message: '可见条件 描述!' }]
            })(
              <Input disabled />
            )}
          </FormItem>
          <div>&nbsp;</div>
          <FormItem
            {...formItem2Layout}
            label='类型'
          >
            {getFieldDecorator('visibleCondition.type', {
              initialValue: detail.visibleCondition.type,
              rules: [{ required: true, message: '可见条件 类型!' }]
            })(
              <InputNumber disabled style={{ width: '100%' }} />
            )}
          </FormItem>
          <div>&nbsp;</div>
          <FormItem
            {...formItem2Layout}
            label='{X}天后开启'
          >
            {getFieldDecorator('visibleCondition.params.afterDays', {
              initialValue: detail.visibleCondition.params.afterDays,
              rules: [{ required: true, message: '可见条件 {X}天后开启!' }]
            })(
              <InputNumber disabled={check} style={{ width: '100%' }} />
            )}
          </FormItem>
          <div>&nbsp;</div>
          <FormItem
            {...formItem2Layout}
            label='持续天数'
          >
            {getFieldDecorator('visibleCondition.params.lastDays', {
              initialValue: detail.visibleCondition.params.lastDays,
              rules: [{ required: true, message: '可见条件 持续天数!' }]
            })(
              <InputNumber disabled={check} style={{ width: '100%' }} />
            )}
          </FormItem>
        </FormItem>
        <FormItem
          {...formItemLayout}
          label='清理业务数据'
        >
          {getFieldDecorator('clearServiceData', {
            initialValue: detail.clearServiceData,
            rules: [{ type: 'boolean', required: true, message: '清除服务数据!' }]
          })(
            <Switch checkedChildren defaultChecked={detail.clearServiceData} disabled={check} />
          )}
        </FormItem>
        {
          formActivityItems
        }
        <FormItem
          {...formItemLayout}
          label='产品ID'
        >
          {getFieldDecorator('products', {
            initialValue: [`${detail.productId}`],
            rules: [{ type: 'array', required: true, message: '请选择产品ID!', whitespace: true }],
            onChange: this.handleProductSelect
          })(
            <Cascader options={productOpt} showSearch disabled />
          )}
        </FormItem>

        <FormItem
          {...formItemLayout}
          label='选择服务器'
        >
          {getFieldDecorator('serverIdList', {
            initialValue: detail.serverIdList,
            rules: [{ required: true, message: '请选择服务器!' }]
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
              disabled={check}
            />
          )}
        </FormItem>
        {
          location.query.handle === 'update' &&
          <FormItem {...tailFormItemLayout}>
            <Button type='primary' htmlType='submit' size='large'>提交</Button>
          </FormItem>
        }
      </Form>
    )
  }
}

UpdateForm.propTypes = {
  form: PropTypes.object,
  products: PropTypes.object,
  items: PropTypes.object,
  location: PropTypes.object,
  activities: PropTypes.object,
  updateActivity: PropTypes.func,
  fetchProductsMap: PropTypes.func,
  itemsActionCreator: PropTypes.func
}

const Update = Form.create()(UpdateForm)

export default Update
