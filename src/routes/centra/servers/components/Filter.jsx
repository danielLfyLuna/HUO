import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'
import { Form, Row, Col, Button, Modal, Cascader, message } from 'antd'

import ServerModal from './Modal'
import BatchModal from './Batch'

class ServerFilter extends Component {
  state = {
    currentItem: {},
    modalType: '',
    visible: false
  }

  handleCreateServer = () => {
    this.setState({
      currentItem: {},
      modalType: 'create',
      visible: true,
    })
  }

  handleBatchServer = () => {
    this.setState({
      currentItem: {},
      modalType: 'batch',
      visible: true,
    })
  }

  handleCancel = (e) => {
    this.setState({
      currentItem: {},
      modalType: '',
      visible: false
    })
  }

  handleSearch = (e) => {
    e.preventDefault()
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        let fields = {
          productId: values.products[0]
        }
        if (values.status) {
          fields.status = values.status[0]
        }
        this.props.onSearch({
          path: {
            productId: fields.productId
          },
          params: {
            status: fields.status
          }
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
    const { form: { getFieldDecorator }, options, initials } = this.props
    const authRoutes = options.login.authRoutes

    return (
      <Fragment>
        <Form layout='inline' onSubmit={this.handleSearch}>
          <Row gutter={20} style={{ marginBottom: 8 }}>
            {
              authRoutes.includes('fetch-server') &&
              <Col className='gutter-row' span={4}>
                {getFieldDecorator('products', {
                  rules: [{ type: 'array', required: true, message: '请选择产品!' }]
                })(
                  <Cascader
                    placeholder='请选择产品(必选)'
                    showSearch
                    options={options.list.product}
                  />
                )}
              </Col>
            }
            {
              authRoutes.includes('fetch-server') &&
              <Col className='gutter-row' span={4}>
                {getFieldDecorator('status', {
                  rules: [{ type: 'array', required: false, message: '请选择开服状态!' }]
                })(
                  <Cascader
                    placeholder='请选开服状态(不选查全部)'
                    showSearch
                    options={initials.enum.serverStatus}
                  />
                )}
              </Col>
            }
            {
              authRoutes.includes('fetch-server') &&
              <Col className='gutter-row' span={2}>
                <Button type='primary' htmlType='submit'>查询</Button>
              </Col>
            }
            {
              authRoutes.includes('create-server') &&
              <Col className='gutter-row' span={2}>
                <Button type='ghost' onClick={this.handleCreateServer}>添加</Button>
              </Col>
            }
            {
              authRoutes.includes('server-batch') &&
              <Col className='gutter-row' span={2}>
                <Button type='ghost' onClick={this.handleBatchServer}>批量维护</Button>
              </Col>
            }
          </Row>
        </Form>

        <Modal
          width={1000}
          key='create-server'
          title='添加服务器'
          visible={this.state.modalType === 'create' && this.state.visible}
          onCancel={this.handleCancel}
          footer={null}
          maskClosable={false}
          destroyOnClose
        >
          <ServerModal
            options={options}
            initials={initials}
            onCreate={this.props.onCreate}
            onModalLoad={this.onModalLoad}
            onSubmitting={this.handleCancel}
          />
        </Modal>

        <Modal
          width={1000}
          key='batch-server'
          title='批量维护服务器'
          visible={this.state.modalType === 'batch' && this.state.visible}
          onCancel={this.handleCancel}
          footer={null}
          maskClosable={false}
          destroyOnClose
        >
          <BatchModal
            options={options}
            initials={initials}
            onSwitch={this.props.onSwitch}
            onSubmitting={this.handleCancel}
          />
        </Modal>
      </Fragment>
    )
  }
}

ServerFilter.propTypes = {
  form: PropTypes.object,
  options: PropTypes.object,
  initials: PropTypes.object,
  onCreate: PropTypes.func,
  onSearch: PropTypes.func,
  onSwitch: PropTypes.func,
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
      status: Form.createFormField({
        ...props.status,
        value: props.status.value
      })
    }
  },
  onValuesChange(_, values) {
  }
})(ServerFilter)

export default Filter
