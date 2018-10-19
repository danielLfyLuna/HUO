import React, { Component } from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import { Form, Input, InputNumber, Cascader, Row, Col, Button, DatePicker, Icon } from 'antd'

const FormItem = Form.Item
const { RangePicker } = DatePicker

class CDKeyModal extends Component {
  state = {
    currentItem: {},
    modalType: '',
    select: true
  }

  componentWillMount() {
    const { currentItem, modalType } = this.props.onModalLoad()
    const { conf: { itemTypes } } = this.props.dataFlow.initials

    this.setState({
      currentItem: currentItem,
      modalType: modalType
    })
    if (modalType === 'update' || modalType === 'copy') {
      this.props.onSearch({
        path: {
          productId: currentItem.productId,
          itemType: itemTypes.item
        },
        handle: 'ITEMS'
      })

      this.setState({
        select: false
      })
    }
  }

  handleProductSelect = (products) => {
    const { conf: { itemTypes } } = this.props.dataFlow.initials
    if (products.length) {
      this.props.onSearch({
        path: {
          productId: products[0],
          itemType: itemTypes.item
        },
        handle: 'ITEMS'
      })
      this.setState({
        select: false
      })
    } else {
      this.setState({
        select: true
      })
    }
  }

  handleSubmit = (e) => {
    e.preventDefault()
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        let data = {
          productId: values.products[0],
          title: values.title,
          type: values.types[0],
          beginDate: values.times[0].format('YYYY-MM-DD HH:mm:ss'),
          endDate: values.times[1].format('YYYY-MM-DD HH:mm:ss'),
          activityRewards: values.activityRewards.map(v => ({
            itemId: v.itemId[0],
            count: Number(v.count)
          }))
        }
        if (values.activityId) {
          data = {
            ...data,
            activityId: values.activityId
          }
        }

        const posts = {
          form: data,
          path: {
            productId: data.productId
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

  handleRewardAdd = () => {
    const { form } = this.props
    const rewardKeys = form.getFieldValue('rewardKeys')
    const nextKeys = rewardKeys.concat(rewardKeys.length)
    form.setFieldsValue({
      rewardKeys: nextKeys
    })
  }

  handleRewardRemove = (k) => {
    const { form } = this.props
    const rewardKeys = form.getFieldValue('rewardKeys')
    if (rewardKeys.length === 1) {
      return
    }
    form.setFieldsValue({
      rewardKeys: rewardKeys.filter(key => key !== k).map((v, i) => i)
    })
    const currentItem = this.state.currentItem
    if (currentItem.activityRewards) {
      const activityRewards = currentItem.activityRewards.filter((v, i) => k != i)
      this.setState({
        currentItem: {
          ...this.state.currentItem,
          activityRewards: [...activityRewards]
        }
      })
    }
  }

  _itemFormat = (items) => Object.entries(items).map(val => ({
    label: `${val[1]}(${val[0]})`, value: Number(val[0])
  }))

  _numFormat = (value) => `${value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`
  _numParse = (value) => value.toString().replace(/\$\s?|(,*)/g, '')

  render() {
    const { getFieldDecorator, getFieldValue } = this.props.form
    const { options, initials } = this.props.dataFlow

    let itemOPt = []
    if (!itemOPt.length) {
      itemOPt = this._itemFormat(options.globals.items)
    }

    const detail = this.state.currentItem
    const check = this.state.modalType === 'update'

    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 8 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 12 }
      }
    }

    const tailFormItemLayout = {
      wrapperCol: {
        xs: { span: 24, offset: 0 },
        sm: { span: 14, offset: 8 }
      }
    }

    const tail1FormItemLayout = {
      wrapperCol: {
        xs: { span: 24, offset: 0 },
        sm: { span: 15, offset: 8 }
      }
    }

    const tail2FormItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 8 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 15 }
      }
    }

    const tail3FormItemLayout = {
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 15 }
      }
    }

    const iniKeys = detail.activityRewards
                    ? detail.activityRewards.map((v, i) => i)
                    : [0]
    getFieldDecorator('rewardKeys', { initialValue: [...iniKeys] })
    const rewardKeys = getFieldValue('rewardKeys')

    const formRewards = rewardKeys.map((key, index) => {
      return (
        <Row key={`activityRewards-${key}`}>
          <Col span={12} offset={4}>
            <FormItem
              {...(index === 0 ? tail2FormItemLayout : tail1FormItemLayout)}
              label={index === 0 ? '道具列表' : ''}
              key={`activityRewards-itemId-${key}`}
            >
              {getFieldDecorator(`activityRewards[${key}].itemId`, {
                initialValue: detail.activityRewards && key < detail.activityRewards.length ? [detail.activityRewards[key].itemId] : [],
                rules: [{type: 'array', required: true, message: '请选择道具'}]
              })(
                <Cascader
                  options={itemOPt}
                  expandTrigger='hover'
                  showSearch
                  placeholder='请选择道具'
                  disabled={this.state.select}
                />
              )}
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem
              {...tail3FormItemLayout}
              key={`activityRewards-count-${key}`}
            >
              {getFieldDecorator(`activityRewards[${key}].count`, {
                initialValue: detail.activityRewards && key < detail.activityRewards.length ? detail.activityRewards[key].count : null,
                validateTrigger: ['onChange', 'onBlur'],
                rules: [
                  {required: true, message: '请填写数量'},
                  {pattern: /^\d+$/, message: '数量必须为整数'}
                ]
              })(
                <InputNumber
                  min={0}
                  placeholder='请填写数量'
                  disabled={this.state.select}
                  style={{ width: '70%' }}
                />
              )}
              <Icon
                className='dynamic-delete-button'
                type='minus-circle-o'
                disabled={rewardKeys.length === 1}
                onClick={() => this.handleRewardRemove(key)}
              />
            </FormItem>
          </Col>
        </Row>
      )
    })

    return (
      <Form onSubmit={this.handleSubmit}>
        <FormItem
          {...formItemLayout}
          label='产品'
        >
          {getFieldDecorator('products', {
            initialValue: detail.productId ? [`${detail.productId}`] : [],
            rules: [{ type: 'array', required: true, message: '请选择产品' }],
            onChange: this.handleProductSelect
          })(
            <Cascader
              options={options.productIds}
              showSearch
              expandTrigger='hover'
              placeholder='请选择产品'
              disabled={check}
            />
          )}
        </FormItem>
        {
          check &&
          <FormItem
            {...formItemLayout}
            label='礼包 ID'
          >
            {getFieldDecorator('activityId', {
              initialValue: detail.activityId || '',
              rules: [{ required: true, message: '请填写礼包 ID!' }]
            })(
              <Input placeholder='请填写礼包 ID' disabled={check} />
            )}
          </FormItem>
        }
        <FormItem
          {...formItemLayout}
          label='礼包名称'
        >
          {getFieldDecorator('title', {
            initialValue: detail.title || '',
            rules: [{ required: true, message: '请填写礼包名称!' }]
          })(
            <Input placeholder='请填写礼包名称' />
          )}
        </FormItem>

        <FormItem
          {...formItemLayout}
          label='兑换码类型'
        >
          {getFieldDecorator('types', {
            initialValue: detail.type ? [detail.type] : [],
            rules: [{ type: 'array', required: true, message: '请选择兑换码类型' }]
          })(
            <Cascader
              options={initials.enum.cdkeyTypes}
              showSearch
              expandTrigger='hover'
              placeholder='请选择兑换码类型'
              disabled={check}
            />
          )}
        </FormItem>

        <FormItem
          {...formItemLayout}
          label='开始时间 & 结束时间'
        >
          {getFieldDecorator('times', {
            initialValue: detail.beginDate ? [moment(detail.beginDate), moment(detail.endDate)] : [],
            rules: [{ required: true, message: '请选择开始时间和结束时间' }]
          })(
            <RangePicker
              showTime
              format='YYYY-MM-DD HH:mm:ss'
              placeholder={['请选择开始时间', '请选择结束时间']}
              style={{ width: '100%' }}
            />
          )}
        </FormItem>
        {
          formRewards
        }
        <FormItem {...tailFormItemLayout}>
          <Button type='dashed' onClick={this.handleRewardAdd} disabled={this.state.select}>
            <Icon type='plus' />添加奖励
          </Button>
        </FormItem>

        <FormItem {...tailFormItemLayout}>
          <Button type='primary' htmlType='submit'>提交</Button>
        </FormItem>
      </Form>
    )
  }
}

CDKeyModal.propTypes = {
  form: PropTypes.object,
  dataFlow: PropTypes.object,
  onModalLoad: PropTypes.func,
  onSubmitting: PropTypes.func,
  onUpdate: PropTypes.func,
  onCreate: PropTypes.func,
  onSearch: PropTypes.func
}

const Modal = Form.create()(CDKeyModal)

export default Modal
