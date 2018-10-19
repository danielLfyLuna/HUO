import React, { Component } from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
// import _ from 'lodash'
import { Form, Button, Cascader, DatePicker, Row, Col, Tooltip, Icon } from 'antd'

const { RangePicker } = DatePicker

class TradeFilter extends Component {
  static propTypes = {
    data: PropTypes.object,
    form: PropTypes.object,
    onGet: PropTypes.func
  }

  handleSearch = (e) => {
    e.preventDefault()
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        let val = {}
        if (values.products && values.products.length > 1) {
          val.productId = values.products[0]
          val.serverId = values.products[1]
        } else {
            val.productId = 0
            val.serverId = 0
        }
        if (values.time) {
          val.time = {
            startTime: values.time[0].format('YYYY-MM-DD'),
            endTime: values.time[1].format('YYYY-MM-DD')
          }
          this.props.onGet(val)
        }
      }
    })
  }

  render() {
    const { form: { getFieldDecorator }, data } = this.props

    return (
      <div style={{ marginBottom: 12 }}>
        <Form onSubmit={this.handleSearch}>
          <Row gutter={10}>
            <Col className='gutter-row' span={6}>
              {getFieldDecorator('products', {
                rules: [{ type: 'array', required: false, message: '请选择产品/服务器!' }]
              })(
                <Cascader
                  options={data.products}
                  showSearch
                  expandTrigger='hover'
                  placeholder='请选择产品/服务器'
                  style={{ width: '100%' }}
                />
              )}
            </Col>
            <Col className='gutter-row' span={8}>
              {getFieldDecorator('time', {
                rules: [{ required: true, message: '请选择日期' }],
                initialValue: [ moment(new Date(), 'YYYY-MM-DD').subtract(1, 'd'), moment(new Date(), 'YYYY-MM-DD') ]
              })(
                <RangePicker format='YYYY-MM-DD' />
              )}
              <i style={{ marginLeft: '5px' }}><Tooltip title='日期范围必选'><Icon type='question-circle-o' /></Tooltip></i>
            </Col>

            <Col className='gutter-row' span={6}>
              <Button type='primary' htmlType='submit'>查询</Button>
            </Col>
          </Row>
        </Form>
      </div>
    )
  }
}

const Filter = Form.create()(TradeFilter)

export default Filter
