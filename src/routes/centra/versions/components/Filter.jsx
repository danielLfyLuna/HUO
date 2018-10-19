import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'
import { Form, Row, Col, Button, Modal, Cascader } from 'antd'

import VersionModal from './Modal'

class VersionFilter extends Component {
  state = {
    currentItem: {},
    modalType: 'create',
    visible: false
  }

  handleCreateVersion = () => {
    this.setState({
      visible: true
    })
  }

  handleCancel = (e) => {
    this.setState({
      visible: false
    })
  }

  handleSearch = (e) => {
    e.preventDefault()
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        values.productId = values.products ? values.products[0] : this.props.products.value[0]
        this.props.onSearch({
          path: {
            productId: values.productId
          },
          handle: 'SEARCH'
        })
      }
    })
  }

  onModalLoad = () => {
    return this.state
  }

  render() {
    const { form: { getFieldDecorator }, options } = this.props
    const authRoutes = options.login.authRoutes

    return (
      <Fragment>
        <Form layout='inline' onSubmit={this.handleSearch}>
          <Row gutter={20} style={{ marginBottom: 8 }}>
            {
              authRoutes.includes('fetch-version') &&
              <Col className='gutter-row' span={4}>
                {getFieldDecorator('products', {
                  rules: [{ type: 'array', required: true, message: '请选择产品!' }]
                })(
                  <Cascader
                    placeholder='请选择产品(必选)'
                    showSearch
                    options={options.products}
                  />
                )}
              </Col>
            }
            {
              authRoutes.includes('fetch-version') &&
              <Col className='gutter-row' span={2}>
                <Button type='primary' htmlType='submit'>查询</Button>
              </Col>
            }
            {
              authRoutes.includes('create-version') &&
              <Col className='gutter-row' span={2}>
                <Button type='ghost' onClick={this.handleCreateVersion}>添加</Button>
              </Col>
            }
          </Row>
        </Form>

        <Modal
          width={1000}
          key='create-version'
          title='添加版本'
          visible={this.state.visible}
          onCancel={this.handleCancel}
          footer={null}
          maskClosable={false}
          destroyOnClose
        >
          <VersionModal
            options={this.props.options}
            initials={this.props.initials}
            onCreate={this.props.onCreate}
            onModalLoad={this.onModalLoad}
            onSubmitting={this.handleCancel}
          />
        </Modal>
      </Fragment>
    )
  }
}

VersionFilter.propTypes = {
  form: PropTypes.object,
  options: PropTypes.object,
  initials: PropTypes.object,
  products: PropTypes.object,
  onCreate: PropTypes.func,
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
      })
    }
  },
  onValuesChange(_, values) {}
})(VersionFilter)

export default Filter
