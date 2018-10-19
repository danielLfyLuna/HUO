import React, { Component } from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
// import _ from 'lodash'
import { Form, Button, Cascader, DatePicker, Row, Col } from 'antd'

const { RangePicker } = DatePicker

class TradeFilter extends Component {
  static propTypes = {
    products: PropTypes.object,
    form: PropTypes.object,
    onSearch: PropTypes.func
  }

  handleSearch = (e) => {
    e.preventDefault()
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        let val = {}
        if (values.products && values.products.length > 1) {
          val.productId = values.products[0]
          val.serverId = values.products[1]  
        }
        if (values.time && values.time.length > 0) {
          val.time = {
            startTime: moment(values.time[0]).format('YYYY-MM-DD'),
            endTime: moment(values.time[1]).format('YYYY-MM-DD')
          }
        }
        this.props.onSearch(val)
      }
    })
  }

  render() {
    const { form: { getFieldDecorator }, products } = this.props

    return (
      <div style={{ marginBottom: 12 }}>
        <Form onSubmit={this.handleSearch}>
          <Row gutter={10}>
            <Col className='gutter-row' span={6}>
              {getFieldDecorator('products', {
                rules: [{ type: 'array', required: false, message: '请选择产品/服务器!' }]
              })(
                <Cascader
                  options={products.options}
                  showSearch
                  expandTrigger='hover'
                  placeholder='请选择产品/服务器(非必选)'
                  style={{ width: '100%' }}
                />
              )}
            </Col>
            <Col className='gutter-row' span={8}>
              {getFieldDecorator('time', {
                rules: [{ required: false, message: '请选择日期' }]
              })(
                <RangePicker format='YYYY-MM-DD' />
              )}
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
