import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Form, Button, TreeSelect, Input, Switch, Icon, Cascader } from 'antd'

const FormItem = Form.Item

class PlayerBatch extends Component {

  state = {
    currentItem: {},
    modalType: '',
    players: []
  }

  componentWillMount() {
    const { currentItem, modalType } = this.props.onModalLoad()

    this.setState({
      currentItem,
      modalType
    })

    if (currentItem.players) {
      this.handleBenifit(currentItem.players)
    }
  }

  handleSubmit = (e) => {
    e.preventDefault()
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        this.props.onBatch({
          path: {
            groupId: values.groupId
          },
          form: {
            groupId: values.groupId,
            indexList: values.indexList.map(v => Number(v)),
            open: values.open ? 1 : 0,
            rechargeId: values.recharges[0]
          }
        })
        this.props.onSubmitting()
      }
    })
  }

  handleBenifit = (players) => {
    this.setState({
      players: players.map(k => ({
        label: `${k.playerId}`,
        value: `${k.index}`,
        key: `${k.index}`
      }))
    })
  }

  handleRecharge = (purchases) => {
    return purchases.map(v => ({
      label: `${v.rechargeName} (${v.rechargeId})`,
      value: v.rechargeId
    }))
  }

  render() {
    const { form: { getFieldDecorator }, options: { globals } } = this.props

    const detail = this.state.currentItem
    const players = this.state.players
    let purchases = []
    if (!purchases.length) {
      purchases = this.handleRecharge(globals.purchases)
    }

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
        xs: { span: 24, offset: 0 },
        sm: { span: 14, offset: 6 }
      }
    }

    return (
      <Form onSubmit={this.handleSubmit}>
        <FormItem
          {...formItemLayout}
          label='所属分组'
        >
          {getFieldDecorator('groupId', {
            initialValue: detail.groupId,
            rules: [{ required: true, message: '请填写所属分组!' }]
          })(
            <Input disabled placeholder='请填写所属分组' />
          )}
        </FormItem>

        <FormItem
          {...formItemLayout}
          label='选择玩家'
        >
          {getFieldDecorator('indexList', {
            initialValue: detail.indexList.map(v => String(v)),
            rules: [{ type: 'array', required: true, message: '请选择玩家!' }]
          })(
            <TreeSelect
              treeData={players}
              showSearch
              allowClear
              treeDefaultExpandAll={false}
              multiple
              treeCheckable
              treeNodeFilterProp='label'
              showCheckedStrategy={TreeSelect.SHOW_CHILD}
              searchPlaceholder='请选择玩家'
              disabled
            />
          )}
        </FormItem>

        <FormItem
          {...formItemLayout}
          label='开关'
        >
          {getFieldDecorator('open', {
            rules: [{ type: 'boolean', required: true, message: '请选择开关!' }]
          })(
            <Switch
              checkedChildren={<Icon type='check' />}
              unCheckedChildren={<Icon type='cross' />}
            />
          )}
        </FormItem>

        <FormItem
          {...formItemLayout}
          label='发放福利'
        >
          {getFieldDecorator('recharges', {
            initialValue: [],
            rules: [{ type: 'array', required: true, message: '请选择发放福利!' }]
          })(
            <Cascader
              options={purchases}
              showSearch
              expandTrigger='hover'
              placeholder='请选择发放福利'
            />
          )}
        </FormItem>

        <FormItem {...tailFormItemLayout}>
          <Button type='primary' htmlType='submit'>提交</Button>
        </FormItem>
      </Form>
    )
  }
}

PlayerBatch.propTypes = {
  form: PropTypes.object,
  options: PropTypes.object,
  onBatch: PropTypes.func,
  onSubmitting: PropTypes.func,
  onModalLoad: PropTypes.func
}

const Batch = Form.create()(PlayerBatch)

export default Batch
