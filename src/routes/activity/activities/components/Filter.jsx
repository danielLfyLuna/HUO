import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'
import { Form, Cascader, Row, Col, Button, Modal, message } from 'antd'

import CreateForms from './Create'

class ActivitiesFilter extends Component {
  state = {
    visible: false
  }

  handleCreate = () => {
    this.context.router.push('/activity/templates')
  }

  handleCancel = e => {
    this.setState({
      visible: false
    })
  }

  onModalLoad = () => {
    return this.state
  }

  handleSearch = e => {
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

  render() {
    const { form: { getFieldDecorator }, dataFlow: { options } } = this.props
    return (
      <Fragment>
        <Form layout='inline' onSubmit={this.handleSearch}>
          <Row gutter={16} style={{ marginBottom: 8 }}>
            {options.login.authRoutes && (
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
            )}
            {options.login.authRoutes && (
              <Col className='gutter-row' span={2}>
                <Button
                  type='primary'
                  htmlType='submit'
                  style={{ marginLeft: 16 }}
                >
                  查询
                </Button>
              </Col>
            )}
            {
              (
                options.login.authRoutes ||
                options.login.authRoutes ||
                options.login.authRoutes
              ) &&
              <Col className='gutter-row' span={2}>
                <Button type='ghost' onClick={this.handleCreate}>添加活动</Button>
              </Col>
            }
          </Row>
        </Form>

        <Modal
          width={1000}
          key='create-activities'
          title='添加活动'
          visible={this.state.visible}
          onCancel={this.handleCancel}
          footer={null}
          maskClosable={false}
          destroyOnClose
        >
          <CreateForms
            dataFlow={this.props.dataFlow}
            onRender={this.props.onRender}
            onModalLoad={this.onModalLoad}
            onSubmitting={this.handleCancel}
          />
        </Modal>
      </Fragment>
    )
  }
}

ActivitiesFilter.propTypes = {
  form: PropTypes.object,
  dataFlow: PropTypes.object,
  onSearch: PropTypes.func,
  onRender: PropTypes.func
}

ActivitiesFilter.contextTypes = {
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
})(ActivitiesFilter)

export default Filter
