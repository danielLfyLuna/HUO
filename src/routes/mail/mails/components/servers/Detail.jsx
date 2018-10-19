import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import _ from 'lodash'
import R from 'ramda'

import { Form, Input, InputNumber, Tooltip, Switch, Icon, Radio, Row, Col, Button, Cascader, Table, TreeSelect } from 'antd'

import { fetchGoodsMap } from '../../../../../base/modules/Goods'
import {
  fetchGlobalChannels
} from '../../../../../base/modules/Global'

const FormItem = Form.Item
const RadioGroup = Radio.Group
const TextArea = Input.TextArea

let itemOpt = []
let productOpt = []
let serverOpt = []
let channelOpt = []

const mapDispatchtoProps = {
  fetchGoodsMap,
  fetchGlobalChannels
}

const mapStateToProps = (state) => ({
  goods: state.goods.options,
  globals: state.globals
})

@connect(mapStateToProps, mapDispatchtoProps)
class DetailModal extends Component {

  state = {
    currentItem: {},
    modalType: '',
    select: true,
    ruleTransFrom: 0,
    switch: true
  }

  constructor(props) {
    super(props)
    this.columns = [{
      title: '玩家信息',
      dataIndex: 'playerName',
    }, {
      title: '服务器',
      dataIndex: 'serverId',
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
    this.props.fetchGlobalChannels()
    let serverBlock = currentItem.serverIds.includes('-')
    this.setState({
      switch: !serverBlock
    })
    this.props.onFetch({
      path: { mailId: currentItem.id },
      handle: this.props.mailType.toUpperCase()
    })

  }

  handleUpdateReceiver = (record) => {

  }

  render() {
    const { getFieldDecorator, getFieldValue } = this.props.form
    const { mailType, options, globals } = this.props
    console.log(globals)
    const detail = {
      ...this.state.currentItem,
      serverType: this.state.switch ? '1' : '2'
    }
    let players = options.mail[mailType].mail.mailPlayers || []
    if (!itemOpt.length) {
      itemOpt = _.map(this.props.goods[0], (val, key) => ({ value: `${key}`, label: `${val}(${key})` }))
    }
    if (!productOpt.length) {
      productOpt = R.map(o => ({ label: o.label, value: o.value }), options.products)
    }
    if (!channelOpt.length) {
      channelOpt = _.map(globals.channels, (val, idx) => ({ label: val, value: idx }))
    }
    if (!serverOpt.length) {
      options.products.map(o => {
        if (o.value === detail.productId && o.children) {
          o.children.map(v => {
            serverOpt.push({ label: v.label, value: v.value, key: v.value })
          })
        }
      })
    }

    const serverOptions = [
      { label: '多选形式', value: '1' },
      { label: '区间形式', value: '2' }
    ]

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
            label='选择产品'
          >
            {getFieldDecorator('products', {
              initialValue: detail.productId ? [detail.productId] : [],
              rules: [{ required: true, message: '请选择产品(必选)' }],
            })(
              <Cascader
                options={productOpt}
                showSearch
                expandTrigger='hover'
                placeholder='请选择产品(必选)'
                disabled
              />
            )}
          </FormItem>

          <FormItem
            {...formItemLayout}
            label='服务器选择方式'
          >
            {getFieldDecorator('serverType', {
              initialValue: `${detail.serverType || 1}` || '1',
              rules: [{ required: true, message: '必选!' }]
            })(
              <RadioGroup
                options={serverOptions}
                disabled
              />
            )}
          </FormItem>
          {
            this.state.switch
            ?
              <FormItem
                {...formItemLayout}
                label='选择服务器'
              >
                {getFieldDecorator('serverIds', {
                  initialValue: detail.serverIds ? detail.serverIds.split(',') : [],
                  rules: [{ required: true, message: '选择服务器(可选)' }]
                })(
                  <TreeSelect
                    treeData={[{
                      label: '全选',
                      value: null,
                      key: '全选',
                      children: serverOpt
                    }]}
                    showSearch
                    allowClear
                    treeDefaultExpandAll
                    multiple
                    treeCheckable
                    treeNodeFilterProp='label'
                    style={{ maxHeight: 100, overflow: 'auto' }}
                    dropdownStyle={{ maxHeight: 300, overflow: 'auto' }}
                    showCheckedStrategy={TreeSelect.SHOW_CHILD}
                    searchPlaceholder='多选服务器'
                    disabled
                  />
                )}
              </FormItem>
            :
              <FormItem
                {...formItemLayout}
                label={(
                  <span>
                    选择服务器&nbsp;
                    <Tooltip
                      title={
                        <div>连续区间用 (-) 分隔. <i style={{color: '#f11738'}}>例：app_001-app_100</i><p>多段区间用 (,) 分割. <i style={{color: '#f11738'}}>例：app_001-app_002,app_100-app_102</i></p></div>
                      }
                    >
                      <Icon type='question-circle-o' />
                    </Tooltip>
                  </span>
                )}
              >
                {getFieldDecorator('serverIds', {
                  initialValue: detail.serverIds || '',
                  rules: [
                    { required: true, message: '输入区间数值!' }
                  ]
                })(
                  <TextArea placeholder='输入区间数值' disabled />
                )}
              </FormItem>
          }
          <FormItem
            {...formItemLayout}
            label='渠道'
          >
            {getFieldDecorator('channels', {
              initialValue: detail.channels ? detail.channels.split(',') : [],
              rules: [{ required: false, message: '请选择渠道' }]
            })(
              <TreeSelect
                treeData={[{
                  label: '全选',
                  value: null,
                  key: '全选',
                  children: channelOpt
                }]}
                showSearch
                allowClear
                treeDefaultExpandAll
                multiple
                treeCheckable
                treeNodeFilterProp='label'
                showCheckedStrategy={TreeSelect.SHOW_CHILD}
                style={{ maxHeight: 100, overflow: 'auto' }}
                dropdownStyle={{ maxHeight: 300 }}
                searchPlaceholder='多选渠道'
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
            label='是否重要'
          >
            {getFieldDecorator('important', {
              initialValue: detail.important || false,
              rules: [{ required: true }],
              valuePropName: 'checked'
            })(
              <Switch
                checkedChildren='是' unCheckedChildren='否'
                disabled
              />
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
  globals: PropTypes.object,
  options: PropTypes.object,
  initials: PropTypes.object,
  mailType: PropTypes.string,
  onFetch: PropTypes.func,
  fetchGoodsMap: PropTypes.func,
  fetchGlobalChannels: PropTypes.func,
  onModalLoad: PropTypes.func,
}

const Details = Form.create()(DetailModal)

export default Details
