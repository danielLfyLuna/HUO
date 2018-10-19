import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Form, Input, Button, Cascader, message } from 'antd'

const FormItem = Form.Item

class PlayerForm extends Component {
  state = {
    groupId: ''
  }

  componentWillMount() {
    const { location } = this.props.options

    this.setState({
      groupId: location.query.groupId
    })
  }

  handleSubmit = (e) => {
    e.preventDefault()
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        if (!values.nickname && !values.playerId) {
          return message.warning('请输入玩家 ID 或者昵称！', 5)
        }
        let data = {
          productId: values.products[0],
          serverId: values.products[1],
          groupId: values.groupId
        }
        if (values.playerId) {
          data = { ...data, playerId: values.playerId }
        }
        if (values.nickname) {
          data = { ...data, nickname: values.nickname }
        }

        let posts = {
          form: data,
          path: {
            groupId: data.groupId
          }
        }

        this.props.onCreate(posts)
        this.props.onSubmitting()
      }
    })
  }

  render() {
    const { getFieldDecorator } = this.props.form
    const { globals } = this.props.options
    const detail = this.state

    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 6 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 12 }
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
          label='产品服/务器'
        >
          {getFieldDecorator('products', {
            initialValue: [],
            rules: [{ type: 'array', required: true, message: '请选择产品服/务器!' }]
          })(
            <Cascader
              options={globals.products}
              showSearch
              expandTrigger='hover'
              placeholder='请选择产品服/务器'
            />
          )}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label='玩家 ID'
        >
          {getFieldDecorator('playerId', {
            initialValue: '',
            rules: [{ required: false, message: '请填写玩家 ID!' }]
          })(
            <Input placeholder='请填写玩家 ID' />
          )}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label='玩家昵称'
        >
          {getFieldDecorator('nickname', {
            initialValue: '',
            rules: [{ required: false, message: '请填写玩家昵称!' }]
          })(
            <Input placeholder='请填写玩家昵称' />
          )}
        </FormItem>
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

        <FormItem {...tailFormItemLayout}>
          <Button type='primary' htmlType='submit'>提交</Button>
        </FormItem>
      </Form>
    )
  }
}

PlayerForm.propTypes = {
  form: PropTypes.object,
  options: PropTypes.object,
  onCreate: PropTypes.func,
  onSubmitting: PropTypes.func
}

const PlayerForms = Form.create()(PlayerForm)

export default PlayerForms
