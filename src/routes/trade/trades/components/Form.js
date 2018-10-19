import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Form, Input, Button } from 'antd'

const { TextArea } = Input
const FormItem = Form.Item

class Filters extends Component {
  handleSearch = (e) => {
    e.preventDefault()
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        this.props.actionOnOk(values)
      }
    })
  }

  render() {
    const { form: { getFieldDecorator }, actionOnCancel } = this.props
    return (
      <div>
        <Form onSubmit={this.handleSearch}>
          <FormItem label='原因' help='该内容会以邮件的形式发送给玩家!' style={{marginBottom: '40px'}}>
            {getFieldDecorator('reason', {
              rules: [{ required: true, message: '请输入原因!' }]
            })(
              <TextArea autosize={{ minRows: 1 }} placeholder='请输入原因' />
            )}
          </FormItem>
          <Button type='primary' htmlType='submit' style={{marginRight: '10px'}} >确认</Button>
          <Button type='ghost' onClick={actionOnCancel}>取消</Button>
        </Form>
      </div>
    )
  }
}

Filters.propTypes = {
  form: PropTypes.object,
  actionOnCancel: PropTypes.func,
  actionOnOk: PropTypes.func
}

const Filter = Form.create()(Filters)

export default Filter
