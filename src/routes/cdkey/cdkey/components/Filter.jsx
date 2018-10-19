import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'
import { Form, Button, Input, Row, Col, message } from 'antd'

class CDKeyFilter extends Component {

  handleSearch = (e) => {
    e.preventDefault()
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        this.props.onSearch({
          path: {
            cdkey: values.cdkey
          },
          handle: 'GET_CDKEY'
        })
      } else {
        Object.values(err).map(val => val.errors.map(v => message.warning(v.message, 3)))
      }
    })
  }

  render() {
    const { form: { getFieldDecorator }, dataFlow: { options } } = this.props
    return (
      <Fragment>
        <Form onSubmit={this.handleSearch}>
          <Row gutter={10} style={{ marginBottom: 8 }}>
            {
              options.login.authRoutes.includes('cdkey-query') &&
              <Col className='gutter-row' span={5}>
                {getFieldDecorator('cdkey', {
                  rules: [{ type: 'string', required: true, message: '请输入CDKey兑换码!' }]
                })(
                  <Input
                    placeholder='请输入 CDKey 兑换码'
                  />
                )}
              </Col>
            }
            {
              options.login.authRoutes.includes('cdkey-query') &&
              <Col className='gutter-row' span={2}>
                <Button type='primary' htmlType='submit' style={{ marginLeft: 16 }}>查询</Button>
              </Col>
            }
          </Row>
        </Form>
      </Fragment>
    )
  }
}

CDKeyFilter.propTypes = {
  form: PropTypes.object,
  dataFlow: PropTypes.object,
  onSearch: PropTypes.func
}

const Filter = Form.create({
  onFieldsChange(props, changedFields) {
    props.onChange(changedFields)
  },
  mapPropsToFields(props) {
    return {
      cdkey: Form.createFormField({
        ...props.cdkey,
        value: props.cdkey.value
      })
    }
  },
  onValuesChange(_, values) {}
})(CDKeyFilter)

export default Filter
