import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import _ from 'lodash'
// import R from 'ramda'

import { Form, Input, InputNumber, Tooltip, Icon, Radio, Row, Col, Button, Cascader, Table } from 'antd'

import { fetchGoodsMap } from '../../../../../base/modules/Goods'

const FormItem = Form.Item
const RadioGroup = Radio.Group
const TextArea = Input.TextArea

const mapDispatchtoProps = {
  fetchGoodsMap
}

const mapStateToProps = (state) => ({
  goods: state.goods.options
})

@connect(mapStateToProps, mapDispatchtoProps)
class DetailModal extends Component {

  state = {
    currentItem: {},
    modalType: '',
    select: true,
    ruleTransFrom: 0,
    products: []
  }

  constructor(props) {
    super(props)
    this.columns = [{
      title: '玩家信息',
      dataIndex: 'playerName',
    }, {
      title: '已得到奖励',
      dataIndex: 'rewards',
    }, {
      title: '状态',
      dataIndex: 'status',
      render: (text, record) => {
        if (record.status === 0) {
          return <div style={{color: '#f90b16'}}>未成功</div>
        }
        if (record.status === 1) {
          return <div style={{color: '#16d021'}}>已成功</div>
        }
      }
    }, {
        title: '操作时间',
        dataIndex: 'operateTime',
      }, {
      title: '操作',
      render: (text, record) => {
        return (
          <Button onClick={e => this.handleUpdateReceiver(record)} disabled>
            修改收件人
          </Button>
        )
      }
    }]
  }

  componentWillMount() {
    const { currentItem, modalType } = this.props.onModalLoad()

    this.setState({
      currentItem: currentItem,
      modalType: modalType
    })

    this.props.fetchGoodsMap({ productId: currentItem.productId })
    this.props.onFetch({
      path: { mailId: currentItem.id },
      handle: this.props.mailType.toUpperCase()
    })

  }

  handleUpdateReceiver = (record) => {

  }

  render() {
    const { getFieldDecorator, getFieldValue } = this.props.form
    const { mailType, options } = this.props

    let itemOpt = _.map(this.props.goods[0], (val, key) => ({ value: `${key}`, label: `${val}(${key})` }))
    const detail = this.state.currentItem
    let players = options.mail[mailType].mail.mailPlayers || []

    let pagination = {
      showSizeChanger: true,
      defaultPageSize: 50,
      pageSizeOptions: ['20', '50', '100', '200', '500'],
      total: players.length
    }

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

    const userTypeOptions = [
      { label: '用户昵称', value: '1' },
      { label: '玩家Id', value: '2' },
      { label: '平台ID', value: '3' }
    ]

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
                    disabled
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
                    style={{ width: '80%' }}
                    disabled
                  />
                )}
              </FormItem>
            </Col>
          </Row>
        )
    })


    return (
      <Fragment>
        <Form>
          <FormItem
            {...formItemLayout}
            label='选择产品/服务器'
          >
            {getFieldDecorator('products', {
              initialValue: detail.productId && detail.serverIds ? [detail.productId, detail.serverIds] : [],
              rules: [{ required: true, message: '请选择产品与服务器(必选)' }]
            })(
              <Cascader
                options={this.props.options.products}
                showSearch
                expandTrigger='hover'
                placeholder='请选择产品与服务器(必选)'
                disabled
              />
            )}
          </FormItem>
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
          <FormItem
            {...formItemLayout}
            label='邮件标题'
          >
            {getFieldDecorator('title', {
              initialValue: detail.title || '',
              rules: [{ required: true, message: '请填写邮件标题' }]
            })(
              <Input placeholder='邮件标题' disabled />
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
              <Input disabled />
            )}
          </FormItem>

          <FormItem
            {...formItemLayout}
            label='玩家格式'
          >
            {getFieldDecorator('receiverType', {
              initialValue: `${detail.receiverType || 1}` || '1',
              rules: [{ required: true, message: '必填!' }]
            })(
              <RadioGroup options={userTypeOptions} disabled />
            )}
          </FormItem>

          <FormItem
            {...formItemLayout}
            label={(
              <span>
                玩家&nbsp;
                <Tooltip title='多个昵称用(,)分隔'>
                  <Icon type='question-circle-o' />
                </Tooltip>
              </span>
            )}
          >
            {getFieldDecorator('receivers', {
              initialValue: detail.receivers || '',
              rules: [{ required: true, message: '必填!' }]
            })(
              <TextArea placeholder='多个昵称用(,)分隔' autosize disabled />
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
              <TextArea placeholder='邮件内容' autosize disabled />
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
              <TextArea placeholder='描述' autosize disabled />
            )}
          </FormItem>

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
          {
            formItems
          }
        </Form>
        <Table
          dataSource={players}
          columns={this.columns}
          rowKey='index'
          pagination={pagination}
          bordered
          loading={options.mail.fetching}
        />
      </Fragment>

    )
  }
}

DetailModal.propTypes = {
  form: PropTypes.object,
  goods: PropTypes.object,
  options: PropTypes.object,
  initials: PropTypes.object,
  mailType: PropTypes.string,
  onFetch: PropTypes.func,
  fetchGoodsMap: PropTypes.func,
  onModalLoad: PropTypes.func,
}

const Details = Form.create()(DetailModal)

export default Details
