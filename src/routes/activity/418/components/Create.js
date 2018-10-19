import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router'
import { Form, Input, Cascader, Row, Col, Button, DatePicker, InputNumber, TreeSelect, Icon } from 'antd'
import _ from 'lodash'
const FormItem = Form.Item
// const { RangePicker } = DatePicker
import moment from 'moment'
import 'moment/locale/zh-cn'
moment.locale('zh-cn')

let productOpt = []
let serverOpt = []
let goodOpt = []
let initialValue = {}
let itemsId = 0
let rewardId = [0]
let services = ['activitys']


class CreateForm extends Component {
  state = {
    initials: {
      products: {
        productId: ''
      },
      conf: {
        openCondition: 1001,
        openTypes: { 1001: 'fixed', 1002: 'after' }
      },
      map: {
        goodTypes: { 0: '道具', 4: '技能', 5: '武将' }
      },
      enum: {
        openTypes: [
          { label: '固定时间 (startTime, endTime)', value: 1001 },
          { label: '开服后天数 (afterDays  lastDays)', value: 1002 }
        ]
      }
    }
  }

  componentWillMount() {
    const { activities, location, form } = this.props
    this.props.fetchProductsMap()
    this.props.fetchGoodsMap({ productId: location.query.productId })
    form.getFieldDecorator('itemsKeys', { initialValue: [] })
    form.getFieldDecorator('rewardKeys', { initialValue: [[]] })
    initialValue = this._activityReducer(activities.templates, Number(location.query.templateId))
    itemsId = 0
    rewardId = [0]
    this._fieldSet(initialValue.activityItems)
    this.setState({
      initials: {
        ...this.state.initials,
        products: {
          productId: location.query.productId
        }
      }
    })
  }

  componentWillReceiveProps(nextProps) {
    const activities = nextProps.activities
    if (activities && activities.create.failServerIds && !activities.create.failServerIds.length) {
      this.context.router.push('/sango2/activity/activities/index')
    }
  }

  componentWillUnmount() {
    this.props.clearTemplateCreate()
    itemsId = 0
    rewardId = [0]
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

  handleSubmit = (e) => {
    e.preventDefault()
    const { location } = this.props
    const initials = this.state.initials
    this.props.form.validateFieldsAndScroll((err, values) => {
      let data = {}
      // data.activityItems = _.reduce(values.activityItems.filter(opt => opt), (result, option, index) => {
      //   let obj = {}
      //   obj.description = option.description
      //   obj.clientValue = option.clientValue
      //   obj.coin = option.coin
      //   obj.rewardList = _.reduce(option.rewardList.filter(opt => opt), (res, opt) => {
      //     res.push({
      //       type: opt.goods[0],
      //       templateId: opt.goods[1],
      //       num: opt.num
      //     })
      //     return res
      //   }, [])
      //   result.push(obj)
      //   return result
      // }, [])
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
      data.serverIdList = values.serverIdList
      let posts = {
        form: data,
        path: {
          productId: location.query.productId,
          serverId: location.query.serverId
        },
        service: services.join('/')
      }

      if (!err) {
        if (['template'].includes(location.query.handle)) {
          this.props.newCreateActivity(posts)
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

  handleChange = (value, selectedOptions) => {
    this.setState({
      initials: {
        ...this.state.initials,
        conf: {
          ...this.state.initials.conf,
          openCondition: value[0]
        }
      }
    })
  }

  handleProductChange = (value) => {
    this.setState({
      initials: {
        ...this.state.initials,
        products: {
          productId: value[0]
        }
      }
    })
  }


  render() {
    const { form: { getFieldDecorator, getFieldValue }, location, products, goods } = this.props
    const initials = this.state.initials
    const detail = location.query.handle === 'preview'
    const create = location.query.handle === 'template'
    const activityItems = initialValue.activityItems || []
    if (productOpt.length == 0) {
      productOpt = this._productReduce(products.options)
    }
    serverOpt = this._serverReduce(products.options, initials.products.productId)
    if (goodOpt.length === 0) {
      goodOpt = this._goodReduce(goods.options, initials.map.goodTypes)
    }

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
        xs: { span: 24 },
        sm: { span: 16 }
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

    const tail1FormItemLayout = {
      wrapperCol: {
        xs: { span: 24, offset: 0 },
        sm: { span: 17, offset: 6 }
      }
    }

    const tail2FormItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 6 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 17 }
      }
    }

    const tail3FormItemLayout = {
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 8 }
      }
    }

    const itemsKeys = getFieldValue('itemsKeys')
    const rewardKeys = getFieldValue('rewardKeys')

    const formItems = itemsKeys.map((key, index) => {
      return (
        <div key={`activityItems-${key}`}>
          <FormItem
            {...formItemLayout}
            label={`描述 #${key}`}
            key={`description-${key}`}
          >
            {getFieldDecorator(`activityItems[${key}].description`, {
              initialValue: activityItems.length && key <= activityItems.length ? activityItems[key - 1].description : null,
              rules: [{ required: true, message: '请填写描述!' }]
            })(
              <Input disabled={detail} placeholder='填写描述' style={{ width: '100%' }} />
            )}
          </FormItem>

          <FormItem
            {...formItemLayout}
            label={`价格(钻石) #${key}`}
            key={`coin-${key}`}
          >
            {getFieldDecorator(`activityItems[${key}].coin`, {
              initialValue: activityItems.length && key <= activityItems.length ? activityItems[key - 1].coin : null,
              rules: [{ required: true, message: '请填写价格!' }]
            })(
              <InputNumber
                min={0}
                formatter={this._numFormat}
                parser={this._numParse}
                disabled={detail}
                placeholder='填写价格'
                style={{ width: '100%' }}
              />
            )}
          </FormItem>

          <FormItem
            {...formItemLayout}
            label={`客户端显示价格(钻石) #${key}`}
            key={`clientValue-${key}`}
          >
            {getFieldDecorator(`activityItems[${key}].clientValue`, {
              initialValue: activityItems.length && key <= activityItems.length ? activityItems[key - 1].clientValue : null,
              rules: [{ required: true, message: '请填写客户端显示价格!' }]
            })(
              <InputNumber
                min={0}
                formatter={this._numFormat}
                parser={this._numParse}
                disabled={detail}
                placeholder='填写客户端显示价格'
                style={{ width: '100%' }}
              />
            )}
          </FormItem>
          {
            rewardKeys[key].map((k, idx) => {
              let rewardList = activityItems.length && key <= activityItems.length ? activityItems[key - 1].rewardList : []
              let reward = rewardList.length ? rewardList[k - 1] : {}
              return (
                <Row key={`rewardList-${key}-${k}`}>
                  <Col span={8} offset={2}>
                    <FormItem
                      {...(idx === 0 ? tail2FormItemLayout : tail1FormItemLayout)}
                      label={idx === 0 ? `道具列表 #${key}` : ''}
                      key={`rewardList-goods-${key}-${k}`}
                    >
                      {getFieldDecorator(`activityItems[${key}].rewardList[${k}].goods`, {
                        initialValue: rewardList.length && k <= rewardList.length ? [reward.type, reward.templateId] : [],
                        rules: [{type: 'array', required: true, message: '请选择类型/道具'}]
                      })(
                        <Cascader
                          options={goodOpt}
                          showSearch
                          disabled={detail}
                          expandTrigger='hover'
                          placeholder='请选择类型/道具'
                        />
                      )}
                    </FormItem>
                  </Col>
                  <Col span={6}>
                    <FormItem
                      {...tail3FormItemLayout}
                      key={`rewardList-num-${key}-${k}`}
                    >
                      {getFieldDecorator(`activityItems[${key}].rewardList[${k}].num`, {
                        initialValue: rewardList.length && k <= rewardList.length ? reward.num : null,
                        validateTrigger: ['onChange'],
                        rules: [
                          {required: true, message: '请填写数量!'}
                        ]
                      })(
                        <InputNumber
                          min={0}
                          formatter={this._numFormat}
                          parser={this._numParse}
                          disabled={detail}
                          placeholder='请填写数量'
                          style={{ width: '80%' }}
                        />
                      )}
                      {
                        !detail &&
                        <Icon
                          className='dynamic-delete-button'
                          type='minus-circle-o'
                          disabled={rewardKeys.length === 1}
                          onClick={() => this.handleRewardRemove(key, k)}
                        />
                      }
                    </FormItem>
                  </Col>
                </Row>
              )
            })
          }
          {
            !detail &&
            <FormItem {...tailFormItemLayout}>
              <Button type='dashed' onClick={() => this.handleRewardAdd(key)}>
                <Icon type='plus' />添加奖励
              </Button>
            </FormItem>
          }
          {
            !detail &&
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
        {
          false &&
          <FormItem
            {...formItemLayout}
            label='活动名称'
            key='templateName'
          >
            {getFieldDecorator('name', {
              initialValue: initialValue.name || null,
              rules: [{ required: true, message: '请填写活动名称!' }]
            })(
              <Input placeholder='填写活动名称' />
            )}
          </FormItem>
        }
        {
          create &&
          <FormItem
            {...formItemLayout}
            label='开启条件'
            key='openCondition'
          >
            {getFieldDecorator('openCondition.openTypes', {
              initialValue: [initials.conf.openCondition],
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
              initials.conf.openTypes[initials.conf.openCondition] === 'fixed' &&
              <FormItem
                {...formItem2Layout}
                label='开始时间'
                key='openCondition.params.startTime'
                style={{ padding: '16px 0px' }}
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
              initials.conf.openTypes[initials.conf.openCondition] === 'fixed' &&
              <FormItem
                {...formItem2Layout}
                label='结束时间'
                key='openCondition.params.endTime'
                style={{ padding: '16px 0px' }}
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
              initials.conf.openTypes[initials.conf.openCondition] === 'after' &&
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
              initials.conf.openTypes[initials.conf.openCondition] === 'after' &&
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
        }
        {
          detail &&
          formItems
        }
        {
          false &&
          <FormItem {...tailFormItemLayout}>
            <Button type='dashed' onClick={this.handleItemsAdd}>
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
            initialValue: [initialValue.productId],
            rules: [{ type: 'array', required: true, message: '请选择产品ID!' }]
          })(
            <Cascader
              options={productOpt}
              showSearch
              onChange={this.handleProductChange}
              disabled={detail}
              expandTrigger='hover'
              placeholder='选择产品 ID'
            />
          )}
        </FormItem>

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
              disabled={detail}
            />
          )}
        </FormItem>

        <FormItem {...tailFormItemLayout} key={Math.random()}>
          {
            !detail &&
            <Button type='primary' htmlType='submit' size='large' style={{ marginRight: 32 }}>提交</Button>
          }
          <Link to='/sango2/activity/activities/templates' data={this.props.activities}>
            <Button size='large'>返回</Button>
          </Link>
        </FormItem>
      </Form>
    )
  }
}

CreateForm.propTypes = {
  form: PropTypes.object,
  products: PropTypes.object,
  goods: PropTypes.object,
  location: PropTypes.object,
  activities: PropTypes.object,
  newCreateActivity: PropTypes.func,
  clearTemplateCreate: PropTypes.func,
  fetchProductsMap: PropTypes.func,
  fetchGoodsMap: PropTypes.func
}

CreateForm.contextTypes = {
  router: PropTypes.object
}

const Create = Form.create()(CreateForm)

export default Create
