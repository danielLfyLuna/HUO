import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'
import { Form, Row, Col, Cascader, Button } from 'antd'


class AllianceFilter extends Component {
  state = {
    select: true,
    visible: false
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
          handle: 'SEARCH'
        })
      }
    })
  }

  handleCancel = () => {
    this.setState({
      visible: false
    })
  }

  render() {
    const { form: { getFieldDecorator }, options, initials } = this.props
    const { authRoutes } = options.login
    return (
      <Fragment>
        <Form layout='inline' onSubmit={this.handleSearch}>
          <Row gutter={20} style={{ marginBottom: 8 }}>
            {
              authRoutes.includes('fetch-alliances') &&
              <Col className='gutter-row' span={6}>
                {getFieldDecorator('products', {
                  initialValue: initials.products.productId ? [initials.products.productId, initials.products.serverId] : [],
                  rules: [{ type: 'array', required: true, message: '请选择产品/服务器!' }]
                })(
                  <Cascader
                    options={options.products.list}
                    showSearch
                    onChange={this.handleProductSelect}
                    placeholder='请选择产品/服务器'
                    expandTrigger='hover'
                  />
                )}
              </Col>
            }
            {
              authRoutes.includes('fetch-alliances') &&
              <Col className='gutter-row' span={2}>
                <Button type='primary' htmlType='submit'>查询</Button>
              </Col>
            }
          </Row>
        </Form>
      </Fragment>
    )
  }
}

AllianceFilter.propTypes = {
  form: PropTypes.object,
  options: PropTypes.object,
  initials: PropTypes.object,
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
    }
  },
  onValuesChange(_, values) {
  }
})(AllianceFilter)

export default Filter
