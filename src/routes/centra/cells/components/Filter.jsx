import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'
import { Form, Row, Col, Button, Modal, Cascader, message } from 'antd'

import ModalContainer from './Modal'

class CellFilter extends Component {
  state = {
    currentItem: {},
    modalType: 'create',
    visible: false
  }

  handleCreateCell = () => {
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
        this.props.onSearch({
          path: {
            productId: values.products[0]
          },
          handle: 'SEARCH'
        })
      } else {
        Object.values(err).map(val => val.errors.map(v => message.warning(v.message, 3)))
      }
    })
  }

  onModalLoad = () => {
    return this.state
  }

  render() {
    const { form: { getFieldDecorator }, options } = this.props
    const authRoutes = options.login.authRoutes
    let productOpt = []
    if (!productOpt.length) {
      productOpt = options.globals.products.map(o => ({ label: o.label, value: o.value }))
    }

    return (
      <Fragment>
        <Form layout='inline' onSubmit={this.handleSearch}>
          <Row gutter={20} style={{ marginBottom: 8 }}>
            {
              authRoutes.includes('fetch-cell') &&
              <Col className='gutter-row' span={4}>
                {getFieldDecorator('products', {
                  rules: [{ type: 'array', required: true, message: '请选择产品!' }]
                })(
                  <Cascader
                    placeholder='请选择产品(必选)'
                    showSearch
                    options={productOpt}
                  />
                )}
              </Col>
            }
            {
              authRoutes.includes('fetch-cell') &&
              <Col className='gutter-row' span={2}>
                <Button type='primary' htmlType='submit'>查询</Button>
              </Col>
            }
            {
              authRoutes.includes('create-cell') &&
              <Col className='gutter-row' span={2}>
                <Button type='ghost' onClick={this.handleCreateCell}>添加</Button>
              </Col>
            }
          </Row>
        </Form>

        <Modal
          width={1000}
          key='create-cell'
          title='添加节点'
          visible={this.state.visible}
          onCancel={this.handleCancel}
          footer={null}
          maskClosable={false}
          destroyOnClose
        >
          <ModalContainer
            options={options}
            onModalLoad={this.onModalLoad}
            onSubmitting={this.handleCancel}
          />
        </Modal>
      </Fragment>
    )
  }
}

CellFilter.propTypes = {
  form: PropTypes.object,
  options: PropTypes.object,
  onSearch: PropTypes.func,
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
})(CellFilter)

export default Filter
