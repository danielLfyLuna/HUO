import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import _ from 'lodash'
import R from 'ramda'

import { Form, Input, InputNumber, Icon, Row, Col, Button, Cascader, Switch } from 'antd'
import { RuleTransFrom } from '../../../../../base/modules/ruleTransform/RuleTransFrom.js'

import { fetchGoodsMap } from '../../../../../base/modules/Goods'

const FormItem = Form.Item
const TextArea = Input.TextArea

let rewardId = 0

const mapDispatchtoProps = {
  fetchGoodsMap
}

const mapStateToProps = (state) => ({
  goods: state.goods.options
})

@connect(mapStateToProps, mapDispatchtoProps)
class MailsForm extends Component {

  state = {
    currentItem: {},
    modalType: '',
    select: true,
    ruleTransFrom: 0,
    products: []
  }

  componentWillMount() {
    const { currentItem, modalType } = this.props.onModalLoad()

    this.setState({
      currentItem: modalType === 'create' ? {} : currentItem,
      modalType: modalType
    })

    if (modalType === 'update' || modalType === 'copy') {
      this.props.fetchGoodsMap({ productId: currentItem.productId })
      rewardId += currentItem.rewards.length
      this.setState({
        select: false
      })
    }
  }

  handleProductSelect = (products) => {
    if (products.length) {
      this.props.fetchGoodsMap({ productId: products[0] })
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
        const { mailType } = this.props
        let data = {
          productId: values.products[0],
          serverIds: values.products[1],
          important: values.important ? 1 : 0,
          title: values.title,
          senderName: values.senderName,
          receivers: values.receivers,
          context: values.context,
          description: values.description,
        }
        if (values.rewards && values.rewards.length) {
          data = {
            ...data,
            rewards: R.map(value => ({ ...value, itemId: value.itemId[0] }), values.rewards.filter(o => o))
          }
        }
        if (values.id) {
          data = {
            ...data,
            id: values.id
          }
        }

        let posts = {
          form: data,
          path: {
            mailId: data.id || ''
          },
          handle: mailType.toUpperCase()
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
    rewardId++
    const { form } = this.props
    const rewardKeys = form.getFieldValue('rewardKeys')
    const nextKeys = rewardKeys.concat(rewardId)
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
      rewardKeys: rewardKeys.filter(key => key !== k)
    })
  }


  handleReset = () => {
    this.props.form.resetFields()
  }

  // 验证
  handlerRoleTransFrom = (value) => {
    this.setState({
      ruleTransFrom: _.toNumber(value)
    })
  }
  handlerRoleTransFromFocus = (event) => {
    event.preventDefault()
    this.setState({
      ruleTransFrom: _.toNumber(event.target.value)
    })
  }

  render() {
    const { getFieldDecorator, getFieldValue } = this.props.form

    let itemOpt = _.map(this.props.goods[0], (val, key) => ({ value: `${key}`, label: `${val}(${key})` }))
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

    getFieldDecorator('rewardKeys', { initialValue: [] })
    const rewardKeys = getFieldValue('rewardKeys')
    if (detail.rewards && !rewardKeys.length) {
      detail.rewards.map((k, i) => {
        return rewardKeys.push(i + 1)
      })
    }

    const formItems = rewardKeys.map((key, index) => {
        return (
          <Row key={`rewards-${key}`}>
            <Col span={12} offset={4}>
              <FormItem
                {...(index === 0 ? tail2FormItemLayout : tail1FormItemLayout)}
                label={index === 0 ? '道具列表' : ''}
                key={`rewards-itemId-${key}`}
              >
                {getFieldDecorator(`rewards[${key}].itemId`, {
                  initialValue: detail.rewards && key <= detail.rewards.length ? [`${detail.rewards[key - 1].itemId}`] : [],
                  rules: [{type: 'array', required: true, message: '请选择道具'}]
                })(
                  <Cascader
                    options={itemOpt}
                    expandTrigger='hover'
                    showSearch
                    placeholder='请选择道具'
                  />
                )}
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem
                {...tail3FormItemLayout}
                key={`rewards-count-${key}`}
              >
                {getFieldDecorator(`rewards[${key}].count`, {
                  initialValue: detail.rewards && key <= detail.rewards.length ? detail.rewards[key - 1].count : 1,
                  validateTrigger: ['onChange', 'onBlur'],
                  rules: [
                  {required: true, message: '请填写数量'},
                  {pattern: /^\d+$/, message: '数量必须为整数'}
                ]
                })(
                  <InputNumber
                    min={1}
                    placeholder='请填写数量'
                    onChange={this.handlerRoleTransFrom}
                    onFocus={this.handlerRoleTransFromFocus}
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
          label='选择产品/服务器'
        >
          {getFieldDecorator('products', {
            initialValue: detail.productId && detail.serverIds ? [detail.productId, detail.serverIds] : [],
            rules: [{ required: true, message: '请选择产品与服务器(必选)' }],
            onChange: this.handleProductSelect
          })(
            <Cascader
              options={this.props.options.products}
              showSearch
              expandTrigger='hover'
              placeholder='请选择产品与服务器(必选)'
              disabled={check}
            />
          )}
        </FormItem>

        <FormItem
          {...formItemLayout}
          label='联盟名称'
        >
          {getFieldDecorator('receivers', {
            initialValue: detail.receivers || '',
            rules: [{ required: true, message: '必填!' }]
          })(
            <TextArea placeholder='联盟名称' autosize />
          )}
        </FormItem>
        {
          check &&
          <FormItem
            {...formItemLayout}
            label='邮件 ID'
          >
            {getFieldDecorator('id', {
              initialValue: detail.id || '',
              rules: [{ required: true, message: '请填写邮件 ID' }]
            })(
              <Input placeholder='邮件 ID' disabled />
            )}
          </FormItem>
        }
        <FormItem
          {...formItemLayout}
          label='邮件标题'
        >
          {getFieldDecorator('title', {
            initialValue: detail.title || '',
            rules: [{ required: true, message: '请填写邮件标题' }]
          })(
            <Input placeholder='邮件标题' />
          )}
        </FormItem>

        <FormItem
          {...formItemLayout}
          label='发件人'
        >
          {getFieldDecorator('senderName', {
            initialValue: detail.senderName || '运营团队',
            rules: [{ required: true, message: '请填写发件人' }],
          })(
            <Input />
          )}
        </FormItem>

        <FormItem
          {...formItemLayout}
          label='邮件内容'
        >
          {getFieldDecorator('context', {
            initialValue: detail.context || '',
            rules: [{ required: true, message: '必填!' }]
          })(
            <TextArea placeholder='邮件内容' autosize={{ minRows: 3, maxRows: 10 }} />
          )}
        </FormItem>

        <FormItem
          {...formItemLayout}
          label='描述'
        >
          {getFieldDecorator('description', {
            initialValue: detail.description || '',
            rules: [{ required: true, message: '必填!' }]
          })(
            <TextArea placeholder='描述' autosize={{ minRows: 3, maxRows: 10 }} />
          )}
        </FormItem>

        <FormItem
          {...formItemLayout}
          label='是否重要'
        >
          {getFieldDecorator('important', {
            initialValue: detail.important || false,
            rules: [{ required: true }],
            valuePropName: 'checked'
          })(
            <Switch
              checkedChildren='是' unCheckedChildren='否'
            />
          )}
        </FormItem>

        {
          check &&
          <FormItem
            {...formItemLayout}
            label='邮件状态'
          >
            {getFieldDecorator('status', {
              initialValue: this.props.initials.map.mailStatus[detail.status],
              rules: [{ required: true, message: '必填!' }]
            })(
              <Input placeholder='邮件状态' disabled />
            )}
          </FormItem>
        }
        {
          formItems
        }
        <FormItem {...tailFormItemLayout}>
          <Button type='dashed' onClick={this.handleRewardAdd} disabled={this.state.select}>
            <Icon type='plus' />添加奖励
          </Button>
        </FormItem>

        <FormItem
          {...formItemLayout}
          label='友情提示'
        >
          <RuleTransFrom
            value={this.state.ruleTransFrom}
          />
        </FormItem>

        <FormItem {...tailFormItemLayout}>
          <Button type='primary' htmlType='submit' >提交表单</Button>
          <Button type='default' onClick={this.handleReset} style={{marginLeft: '10px'}}>重置</Button>
        </FormItem>

      </Form>
    )
  }
}

MailsForm.propTypes = {
  form: PropTypes.object,
  goods: PropTypes.object,
  options: PropTypes.object,
  initials: PropTypes.object,
  mailType: PropTypes.string,
  onCreate: PropTypes.func,
  onUpdate: PropTypes.func,
  fetchGoodsMap: PropTypes.func,
  onModalLoad: PropTypes.func,
  onSubmitting: PropTypes.func,
}

const Mails = Form.create()(MailsForm)

export default Mails
