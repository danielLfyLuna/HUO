import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router'
import { Form, Input, Cascader, Button, InputNumber, TreeSelect, Icon, Switch, Col } from 'antd'
import _ from 'lodash'
const FormItem = Form.Item
import moment from 'moment'
import 'moment/locale/zh-cn'
moment.locale('zh-cn')

let productOpt = []
let serverOpt = []
let itemOPt = []
let record = {}
let itemsId = 0
let rewardId = [0]

class UpdateForm extends Component {
  state = {
    initials: {
      map: {
        goodTypes: { 0: '道具', 4: '技能', 5: '武将' }
      }
    }
  }

  componentWillMount() {
    const { activities, location, form } = this.props
    this.props.fetchProductsMap()
    this.props.fetchGoodsMap({productId: location.query.productId})
    record = this._activityReducer(activities.list, Number(location.query.templateId))
    form.getFieldDecorator('itemsKeys', { initialValue: [] })
    form.getFieldDecorator('rewardKeys', { initialValue: [[]] })
    itemsId = 0
    rewardId = [0]
    this._fieldSet(record.activityItems)
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

  _goodReduce = (options, types) => {
    let goods = []
    _.reduce(options, (result, option, index) => {
      let gds = []
      _.reduce(option, (res, opt, idx) => {
        res.push({ value: Number(idx), label: `${opt} (${idx})` })
        return res
      }, gds)
      result.push({ value: Number(index), label: `${types[index]} (${index})`, children: gds })
      return result
    }, goods)
    return goods
  }

  _numFormat = (value) => `${value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`
  _numParse = (value) => value.toString().replace(/\$\s?|(,*)/g, '')

  handleProductSelect = (product) => {
    serverOpt = this._serverReduce(this.props.products.options, product[0])
    this.props.fetchGoodsMap({productId: product[0]})
  }

  handleSubmit = (e) => {
    e.preventDefault()
    this.props.form.validateFieldsAndScroll((err, values) => {
      let detail = this._activityReducer(this.props.activities.list, Number(this.props.location.query.templateId))
      let data = {}
      data.activityItems = _.reduce(values.activityItems.filter(opt => opt), (result, option, index) => {
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
        obj.rewardList = _.reduce(option.rewardList.filter(opt => opt), (res, opt) => {
          res.push({
            num: opt.num,
            type: opt.item.length ? opt.item[0] : opt.type,
            templateId: opt.item.length ? opt.item[1] : opt.templateId
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
        params: values.openCondition.params
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

  handleItemsAdd = () => {
    itemsId++
    rewardId[itemsId] = 0
    const { form } = this.props
    const itemsKeys = form.getFieldValue('itemsKeys')
    const rewardKeys = form.getFieldValue('rewardKeys')
    const nextKeys = itemsKeys.concat(itemsId)
    rewardKeys.push([])
    form.setFieldsValue({
      itemsKeys: nextKeys,
      rewardKeys: rewardKeys
    })
  }

  handleItemsRemove = (k) => {
    const { form } = this.props
    const itemsKeys = form.getFieldValue('itemsKeys')
    if (itemsKeys.length === 1) {
      return
    }
    form.setFieldsValue({
      itemsKeys: itemsKeys.filter(key => key !== k)
    })
  }

  handleRewardRemove = (key, k) => {
    const { form } = this.props
    const rewardKeys = form.getFieldValue('rewardKeys')
    if (rewardKeys[key].length === 1) {
      return
    }
    rewardKeys[key] = rewardKeys[key].filter(ky => ky !== k)
    form.setFieldsValue({
      rewardKeys: rewardKeys
    })
  }

  handleRewardAdd = (k) => {
    rewardId[k]++
    const { form } = this.props
    const rewardKeys = form.getFieldValue('rewardKeys')
    rewardKeys[k].push(rewardId[k])
    form.setFieldsValue({
      rewardKeys: rewardKeys
    })
  }

  _fieldSet = (activityItems) => {
    const { form } = this.props
    const itemsKeys = form.getFieldValue('itemsKeys')
    const rewardKeys = form.getFieldValue('rewardKeys')
    if (activityItems && !itemsKeys.length) {
      activityItems.map((option, index) => {
        itemsId++
        rewardId[itemsId] = 0
        rewardKeys.push([])
        if (option.rewardList) {
          option.rewardList.map((opt, idx) => {
            rewardId[itemsId]++
            rewardKeys[itemsId].push(rewardId[itemsId])
          })
        }
        itemsKeys.push(itemsId)
        form.setFieldsValue({
          itemsKeys: itemsKeys,
          rewardKeys: rewardKeys
        })
      })
    }
  }


  render() {
    const { form: { getFieldDecorator, getFieldValue }, location, products, goods } = this.props
    const check = location.query.handle === 'detail'
    const activityItems = record.activityItems || []

    const initials = this.state.initials
    if (productOpt.length == 0) {
      productOpt = this._productReduce(products.options)
    }
    if (serverOpt.length == 0) {
      serverOpt = this._serverReduce(products.options, record.productId)
    }
    itemOPt = this._goodReduce(goods.options, initials.map.goodTypes)

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

    const itemsKeys = getFieldValue('itemsKeys')
    const rewardKeys = getFieldValue('rewardKeys')

    const formItems = itemsKeys.map((key, index) => {
      return (
        <div key={`activityItems-${key}`}>
          <FormItem
            {...formItemLayout}
            label={`礼包 ID #${key}`}
            key={`activityItemId-${key}`}
          >
            {getFieldDecorator(`activityItems[${key}].activityItemId`, {
              initialValue: activityItems.length && key <= activityItems.length ? activityItems[key - 1].activityItemId : '',
              rules: [{ required: true, message: '请填写礼包 ID!' }]
            })(
              <Input disabled placeholder='填写礼包 ID' style={{ width: '100%' }} />
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label={`描述 #${key}`}
            key={`description-${key}`}
          >
            {getFieldDecorator(`activityItems[${key}].description`, {
              initialValue: activityItems.length && key <= activityItems.length ? activityItems[key - 1].description : null,
              rules: [{ required: true, message: '请填写描述!' }]
            })(
              <Input disabled={check} placeholder='填写描述' style={{ width: '100%' }} />
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label={`客户端显示价格(钻石) #${key}`}
            key={`clientValue-${key}`}
          >
            {getFieldDecorator(`activityItems[${key}].clientValue`, {
              initialValue: activityItems.length && key <= activityItems.length ? activityItems[key - 1].clientValue : null,
              rules: [{ required: true, message: '请填写客户端显示值!' }]
            })(
              <InputNumber
                min={0}
                formatter={this._numFormat}
                parser={this._numParse}
                disabled={check}
                placeholder='填写客户端显示值'
                style={{ width: '100%' }}
              />
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label={`价格(钻石) #${key}`}
            key={`coin-${key}`}
          >
            {getFieldDecorator(`activityItems[${key}].coin`, {
              initialValue: activityItems.length && key <= activityItems.length ? activityItems[key - 1].coin : null,
              rules: [{ required: true, message: '请填写钻石数!' }]
            })(
              <InputNumber
                min={0}
                formatter={this._numFormat}
                parser={this._numParse}
                disabled={check}
                placeholder='填写钻石数'
                style={{ width: '100%' }}
              />
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label={`系统钻石 #${key}`}
            key={`coinToken-${key}`}
          >
            {getFieldDecorator(`activityItems[${key}].coinToken`, {
              initialValue: activityItems.length && key <= activityItems.length ? activityItems[key - 1].coinToken : null,
              rules: [{ required: true, message: '系统钻石' }]
            })(
              <InputNumber min={0} disabled placeholder='填写系统钻石数量' style={{ width: '100%' }} />
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label={`人民币 #${key}`}
            key={`rmb-${key}`}
          >
            {getFieldDecorator(`activityItems[${key}].rmb`, {
              initialValue: activityItems.length && key <= activityItems.length ? activityItems[key - 1].rmb : null,
              rules: [{ required: true, message: '人民币' }]
            })(
              <InputNumber min={0} disabled placeholder='填写人民币' style={{ width: '100%' }} />
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label={`VIP 成长值 #${key}`}
            key={`vipValue-${key}`}
          >
            {getFieldDecorator(`activityItems[${key}].vipValue`, {
              initialValue: activityItems.length && key <= activityItems.length ? activityItems[key - 1].vipValue : null,
              rules: [{ required: true, message: 'VIP 成长值' }]
            })(
              <InputNumber min={0} disabled placeholder='填写 VIP 成长值' style={{ width: '100%' }} />
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label={`目标值 #${key}`}
            key={`targetValue-${key}`}
          >
            {getFieldDecorator(`activityItems[${key}].targetValue`, {
              initialValue: activityItems.length && key <= activityItems.length ? activityItems[key - 1].targetValue : null,
              rules: [{ required: true, message: '目标值' }]
            })(
              <InputNumber min={0} disabled placeholder='填写目标值' style={{ width: '100%' }} />
            )}
          </FormItem>
          {
            rewardKeys[key].map((k, idx) => {
              let rewardList = activityItems.length && key <= activityItems.length ? activityItems[key - 1].rewardList : []
              let reward = rewardList.length ? rewardList[k - 1] : {}
              return (
                <FormItem
                  {...(idx === 0 ? tail2FormItemLayout : tail2FormItemLayout)}
                  label={idx === 0 ? `道具列表 #${key}` : ' '}
                  key={`rewardList-${key}-${k}`}
                  colon={idx === 0}
                  required={false}
                >
                  <Col span={12} style={{ marginRight: 8 }}>
                    <FormItem
                      key={`rewardList-item-${key}-${k}`}
                    >
                      {getFieldDecorator(`activityItems[${key}].rewardList[${k}].item`, {
                        initialValue: rewardList.length && k <= rewardList.length ? [reward.type, reward.templateId] : [],
                        rules: [{ type: 'array', required: true, message: '请选择道具!' }]
                      })(
                        <Cascader
                          options={itemOPt}
                          showSearch
                          expandTrigger='hover'
                          disabled={check}
                          placeholder='选择道具'
                        />
                      )}
                    </FormItem>
                  </Col>
                  <Col span={4}>
                    <FormItem
                      key={`rewardList-num-${key}-${k}`}
                    >
                      {getFieldDecorator(`activityItems[${key}].rewardList[${k}].num`, {
                        initialValue: rewardList.length && k <= rewardList.length ? reward.num : null,
                        rules: [{ required: true, message: '请填写数量!' }]
                      })(
                        <InputNumber
                          min={0}
                          formatter={this._numFormat}
                          parser={this._numParse}
                          disabled={check}
                          placeholder='填写数量'
                          style={{ width: '80%', marginRight: 8 }}
                        />
                      )}
                      {
                        !check &&
                        <Icon
                          className='dynamic-delete-button'
                          type='minus-circle-o'
                          disabled={rewardKeys.length === 1}
                          onClick={() => this.handleRewardRemove(key, k)}
                        />
                      }
                    </FormItem>
                  </Col>
                </FormItem>
              )
            })
          }
          {
            !check &&
            <FormItem {...tailFormItemLayout}>
              <Button type='dashed' onClick={() => this.handleRewardAdd(key)} disabled={check}>
                <Icon type='plus' />添加奖励
              </Button>
            </FormItem>
          }
          {
            !check &&
            <FormItem {...tailFormItemLayout}>
              <Button
                type='dashed'
                disabled={itemsKeys.length === 1}
                onClick={() => this.handleItemsRemove(key)}
              >
                <Icon className='dynamic-delete-button' type='minus-circle-o' />删除礼包
              </Button>
            </FormItem>
          }
        </div>
      )
    })

    return (
      <Form onSubmit={this.handleSubmit}>
        <FormItem
          {...formItemLayout}
          label='活动类型'
          key='functionId'
        >
          {getFieldDecorator('functionId', {
            initialValue: record.functionId,
            rules: [{ required: true, message: '请填写活动类型!' }]
          })(
            <InputNumber min={0} disabled placeholder='填写活动类型' style={{ width: '100%' }} />
          )}
        </FormItem>

        <FormItem
          {...formItemLayout}
          label='活动 ID'
          key='templateId'
        >
          {getFieldDecorator('templateId', {
            initialValue: record.templateId,
            rules: [{ required: true, message: '请填写活动 ID!' }]
          })(
            <InputNumber min={0} disabled placeholder='填写活动 ID' style={{ width: '100%' }} />
          )}
        </FormItem>

        <FormItem
          {...formItemLayout}
          label='活动名称'
          key='templateName'
        >
          {getFieldDecorator('name', {
            initialValue: record.name,
            rules: [{ required: true, message: '请填写活动名称!' }]
          })(
            <Input disabled={check} placeholder='填写活动名称' />
          )}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label='开启条件'
          key='openCondition'
        >
          <FormItem
            {...formItem2Layout}
            label='描述'
            key='openCondition.desc'
          >
            {getFieldDecorator('openCondition.desc', {
              initialValue: record.openCondition.desc,
              rules: [{ required: true, message: '开启条件 描述!' }]
            })(
              <Input disabled placeholder='填写描述' />
            )}
          </FormItem>
          <div>&nbsp;</div>
          <FormItem
            {...formItem2Layout}
            label='类型'
            key='openCondition.type'
          >
            {getFieldDecorator('openCondition.type', {
              initialValue: record.openCondition.type,
              rules: [{ required: true, message: '开启条件 类型!' }]
            })(
              <Input disabled placeholder='填写类型' />
            )}
          </FormItem>
          <div>&nbsp;</div>
          <FormItem
            {...formItem2Layout}
            label='{X}天后开启'
            key='openCondition.params.afterDays'
          >
            {getFieldDecorator('openCondition.params.afterDays', {
              initialValue: record.openCondition.params.afterDays,
              rules: [{ required: true, message: '可见条件 {X}天后开启!' }]
            })(
              <InputNumber disabled={check} placeholder='填写{X}天后开启' style={{ width: '100%' }} />
            )}
          </FormItem>
          <div>&nbsp;</div>
          <FormItem
            {...formItem2Layout}
            label='持续天数'
            key='openCondition.params.lastDays'
          >
            {getFieldDecorator('openCondition.params.lastDays', {
              initialValue: record.openCondition.params.lastDays,
              rules: [{ required: true, message: '可见条件 持续天数!' }]
            })(
              <InputNumber disabled={check} placeholder='填写持续天数' style={{ width: '100%' }} />
            )}
          </FormItem>
        </FormItem>
        <FormItem
          {...formItemLayout}
          label='清理业务数据'
          key='clearServiceData'
        >
          {getFieldDecorator('clearServiceData', {
            initialValue: record.clearServiceData,
            rules: [{ type: 'boolean', required: true, message: '清除服务数据!' }]
          })(
            <Switch checkedChildren={'是'} unCheckedChildren={'否'} defaultChecked={record.clearServiceData} disabled={check} />
          )}
        </FormItem>
        {
          formItems
        }
        {
          !check &&
          <FormItem {...tailFormItemLayout}>
            <Button type='dashed' onClick={this.handleItemsAdd} disabled>
              <Icon type='plus' />添加礼包
            </Button>
          </FormItem>
        }
        <FormItem
          {...formItemLayout}
          label='产品ID'
          key='productId'
        >
          {getFieldDecorator('products', {
            initialValue: [`${record.productId}`],
            rules: [{ type: 'array', required: true, message: '请选择产品 ID!' }],
            onChange: this.handleProductSelect
          })(
            <Cascader options={productOpt} showSearch disabled placeholder='选择产品 ID' />
          )}
        </FormItem>

        <FormItem
          {...formItemLayout}
          label='选择服务器'
          key='serverIdList'
        >
          {getFieldDecorator('serverIdList', {
            initialValue: record.serverIdList,
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
              searchPlaceholder='选择服务器'
              disabled={check}
            />
          )}
        </FormItem>
        <FormItem {...tailFormItemLayout} key={Math.random()}>
          {
            location.query.handle === 'update' &&
            <Button type='primary' htmlType='submit' size='large' style={{ marginRight: 32 }}>提交</Button>
          }
          <Link to='/sango2/activity/activities/index'>
            <Button size='large'>返回</Button>
          </Link>
        </FormItem>

      </Form>
    )
  }
}

UpdateForm.propTypes = {
  form: PropTypes.object,
  products: PropTypes.object,
  goods: PropTypes.object,
  location: PropTypes.object,
  activities: PropTypes.object,
  updateActivity: PropTypes.func,
  fetchProductsMap: PropTypes.func,
  fetchGoodsMap: PropTypes.func
}

const Update = Form.create()(UpdateForm)

export default Update
