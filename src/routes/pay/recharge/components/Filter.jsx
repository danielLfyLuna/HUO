import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'
import { Form, Row, Col, Cascader, Button, Input, message } from 'antd'

class RechargeFilter extends Component {
  state = {
    select: true
  }

  handleProductSelect = (products) => {
    if (products.length) {
      this.setState({
        select: false
      })
    } else {
      this.setState({
        select: true
      })
    }
  }

  handleSearch = (e) => {
    e.preventDefault()
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        this.props.onSearch({
          path: {
            productId: values.products[0],
            serverId: values.products[1]
          },
          params: {
            nickname: values.nickname || '',
            playerId: values.playerId || '',
          },
          handle: 'SEARCH'
        })
      } else {
        Object.values(err).map(val => val.errors.map(v => message.warning(v.message, 3)))
      }
    })
  }

  render() {
    const { form: { getFieldDecorator }, options, products } = this.props
    const check = products.value[0] ? false : this.state.select
    return (
      <Fragment>
        {
          options.authorize &&
          <Form layout='inline' onSubmit={this.handleSearch}>
            <Row gutter={16} style={{ marginBottom: 8 }}>
              <Col className='gutter-row' span={6}>
                {getFieldDecorator('products', {
                  rules: [{ type: 'array', required: true, message: '请选择产品/服务器!' }]
                })(
                  <Cascader
                    options={options.globals.products}
                    showSearch
                    onChange={this.handleProductSelect}
                    placeholder='请选择产品/服务器'
                    expandTrigger='hover'
                  />
                )}
              </Col>
              <Col className='gutter-row' span={4}>
                {getFieldDecorator('nickname', {
                  rules: [{ required: false, message: '请填写玩家昵称!' }]
                })(
                  <Input placeholder='请填写玩家昵称' disabled={check} />
                )}
              </Col>
              <Col className='gutter-row' span={4}>
                {getFieldDecorator('playerId', {
                  rules: [{ required: false, message: '请填写玩家 ID!' }]
                })(
                  <Input placeholder='请填写玩家 ID' disabled={check} />
                )}
              </Col>
              <Col className='gutter-row' span={2}>
                <Button type='primary' htmlType='submit'>查询</Button>
              </Col>
            </Row>
          </Form>
        }
      </Fragment>
    )
  }
}

RechargeFilter.propTypes = {
  form: PropTypes.object,
  options: PropTypes.object,
  products: PropTypes.object,
  onSearch: PropTypes.func
}

const Filter = Form.create({
  onFieldsChange(props, changedFields) {
    props.onChange(changedFields)
  },
  mapPropsToFields(props) {
    return {
      products: Form.createFormField({
        ...props.products,
        value: props.products.value
      }),
      nickname: Form.createFormField({
        ...props.nickname,
        value: props.nickname.value
      }),
      playerId: Form.createFormField({
        ...props.playerId,
        value: props.playerId.value
      }),
    }
  },
  onValuesChange(_, values) {}
})(RechargeFilter)

export default Filter
