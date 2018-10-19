import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Form, Row, Col, Button, Input } from 'antd'

class ActivitiesFilter extends Component {

  handleSearch = e => {
    e.preventDefault()
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        this.props.changeReceiver({
          type: 'alliance',
          id: this.props.names.mailId,
          index: this.props.names.index,
          list: { playerName: values.name }
        })
        this.props.onCancel()
      }
    })
  }

  render() {
    const { form: { getFieldDecorator } } = this.props
    return (
      <Form layout='inline' onSubmit={this.handleSearch}>
        <Row gutter={16} style={{ marginBottom: 8 }}>
          <Col className='gutter-row' span={16}>
            {getFieldDecorator('name', {
              rules: [{ required: true, message: '请输入收件人' }],
              initialValue: this.props.names.playerName
            })(
              <Input placeholder='请输入收件人' />
            )}
          </Col>
          <Col className='gutter-row' span={4}>
            <Button type='primary' htmlType='submit'>修改</Button>
          </Col>
          <Col className='gutter-row' span={4}>
            <Button type='gost' onClick={this.props.onCancel}>取消</Button>
          </Col>
        </Row>
      </Form>
    )
  }
}

ActivitiesFilter.propTypes = {
  form: PropTypes.object,
  names: PropTypes.object,
  changeReceiver: PropTypes.func,
  onCancel: PropTypes.func
}

const Filter = Form.create()(ActivitiesFilter)

export default Filter
