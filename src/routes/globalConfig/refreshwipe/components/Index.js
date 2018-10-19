import React, {Component} from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { Card, Button, Form, Row, Col, Cascader } from 'antd'
import _ from 'lodash'

import {
  fetchCD
} from './../modules/Module'
import { fetchProductsMap } from '../../../../base/modules/Products'
const mapDispatchtoProps = {
  fetchCD,
  fetchProductsMap
}
const mapStateToProps = (state) => ({
  login: state.islogin,
  products: state.products,
  wipe: state.wipe
})
@connect(mapStateToProps, mapDispatchtoProps)
class Index extends Component {

  static propTypes = {
    login: PropTypes.object,
    form: PropTypes.object,
    products: PropTypes.object,
    fetchProductsMap: PropTypes.func,
    fetchCD: PropTypes.func
  }

  componentWillMount() {
    this.props.fetchProductsMap()
  }

  handleSearch = (e) => {
    e.preventDefault()
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        this.props.fetchCD({
          productId: values.products[0],
          serverId: values.products[1]
        })
      }
    })
  }

  render() {
    const { products, form: { getFieldDecorator }, login: {curd} } = this.props

    return (
      <div>
        <Card style={{marginBottom: 6}}>
          <Form onSubmit={this.handleSearch}>
            <Row gutter={20}>
              <Col className='gutter-row' span={12}>
                {getFieldDecorator('products', {
                  rules: [{ required: true, message: '请选择产品/服务器' }]
                })(
                  <Cascader
                    options={products.options}
                    showSearch
                    allowClear
                    placeholder='请选择产品/服务器(必填)'
                    expandTrigger='hover'
                  />
                )}
              </Col>
              <Col className='gutter-row' span={4}>
                {
                  _.has(curd, '160101') &&
                  <Button type='primary' htmlType='submit'>刷怪</Button>
                }
              </Col>
            </Row>
          </Form>
        </Card>
      </div>
    )
  }
}
const IndexForm = Form.create()(Index)
export default IndexForm
