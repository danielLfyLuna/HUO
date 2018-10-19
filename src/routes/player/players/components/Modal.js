import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Form, Input, Button, Cascader, Tooltip, Icon } from 'antd'

const FormItem = Form.Item
const Textarea = Input.TextArea

class PlayerModals extends Component {

  handleSubmit = (e) => {
    e.preventDefault()
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        const posts = {
          form: {
            // noviceId: values.noviceId,
            nicknames: values.nicknames
          },
          path: {
            productId: values.products[0],
            serverId: values.products[1]
          },
          handle: 'BATCH'
        }

        this.props.onSkip(posts)
        this.props.onSubmitting()
      }
    })
  }

  render() {
    const { getFieldDecorator } = this.props.form

    return (
      <div>
        <Form onSubmit={this.handleSubmit}>
          <FormItem
            label='请选择产品和服务器(必选)'
          >
            {getFieldDecorator('products', {
              rules: [{ required: true, message: '必填!' }]
            })(
              <Cascader
                options={this.props.options.products}
                expandTrigger='hover'
                showSearch
                placeholder='请选择产品与服务器(必选)'
              />
            )}
          </FormItem>

          {/* <FormItem
            label='新手步骤'
          >
            {getFieldDecorator('noviceId', {
              rules: [{ required: true, message: '请输入跳过的新手步骤' }],
              initialValue: 370
            })(
              <Input placeholder='请输入跳过的新手步骤' />
            )}
          </FormItem> */}

          <FormItem
            label={(
              <span>
                玩家昵称&nbsp;
                <Tooltip title='每个玩家昵称之间用英文逗号","或回车隔开' placement='right'>
                  <Icon type='question-circle-o' />
                </Tooltip>
              </span>
            )}
          >
            {getFieldDecorator('nicknames', {
              rules: [{ required: true, message: '请输入玩家昵称' }]
            })(
              <Textarea placeholder='玩家昵称' autosize={{minRows: 3}} />
            )}
          </FormItem>

          <Button type='primary' htmlType='submit' >提交</Button>
        </Form>
      </div>
    )
  }
}

PlayerModals.propTypes = {
  form: PropTypes.object,
  options: PropTypes.object,
  onSkip: PropTypes.func,
  onSubmitting: PropTypes.func
}

const PlayerModal = Form.create()(PlayerModals)

export default PlayerModal
