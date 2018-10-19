import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Form, Row, Col, Cascader, Button, message } from 'antd'

class TemplateFilter extends Component {
  state = {
  }

  handleSearch = (e) => {
    e.preventDefault()
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        this.props.onSearch({
          path: {
            productId: values.products[0],
            serverId: values.products[1],
          },
          handle: 'SEARCH'
        })
      } else {
        Object.values(err).map(val => val.errors.map(v => message.warning(v.message, 3)))
      }
    })
  }

  handleBack = () => {
    this.context.router.push('/activity/activities')
  }

  render() {
    const { form: { getFieldDecorator }, dataFlow: { options } } = this.props

    return (
      <div>
        <Form onSubmit={this.handleSearch}>
          <Row gutter={16} style={{ marginBottom: 8 }}>
            {
              options.login.authRoutes &&
              <Col className='gutter-row' span={6}>
                {getFieldDecorator('products', {
                  rules: [{ type: 'array', required: true, message: '请选择产品/服务器!' }]
                })(
                  <Cascader
                    options={options.globals.products}
                    showSearch
                    expandTrigger='hover'
                    placeholder='请选择产品/服务器'
                  />
                )}
              </Col>
            }
            {
              options.login.authRoutes &&
              <Col className='gutter-row' span={2}>
                <Button
                  type='primary'
                  htmlType='submit'
                  style={{ marginLeft: 16 }}
                >
                  查询
                </Button>
              </Col>
            }
            {
              options.login.authRoutes &&
              <Col className='gutter-row' span={2}>
                <Button onClick={this.handleBack}>返回</Button>
              </Col>
            }
          </Row>
        </Form>
      </div>
    )
  }
}

TemplateFilter.propTypes = {
  form: PropTypes.object,
  dataFlow: PropTypes.object,
  onSearch: PropTypes.func
}

TemplateFilter.contextTypes = {
  router: PropTypes.object
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
      })
    }
  },
  onValuesChange(_, values) {}
})(TemplateFilter)

export default Filter
