import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'
import { Form, Row, Col, Cascader, Button, Modal, message } from 'antd'

import CreateModal from './Modal'

class CDKeyFilter extends Component {
  state = {
    currentItem: {},
    modalType: 'create',
    visible: false
  }

  handleCreate = () => {
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
    const { form: { getFieldDecorator }, dataFlow: { options } } = this.props
    return (
      <Fragment>
        <Form layout='inline' onSubmit={this.handleSearch}>
          <Row gutter={16} style={{ marginBottom: 8 }}>
            {
              options.login.authRoutes.includes('fetch-cdkeys') &&
              <Col className='gutter-row' span={4}>
                {getFieldDecorator('products', {
                  rules: [{ type: 'array', required: true, message: '请选择产品!' }]
                })(
                  <Cascader
                    options={options.products}
                    showSearch
                    expandTrigger='hover'
                    placeholder='请选择产品'
                  />
                )}
              </Col>
            }
            {
              options.login.authRoutes.includes('fetch-cdkeys') &&
              <Col className='gutter-row' span={2}>
                <Button type='primary' htmlType='submit'>查询</Button>
              </Col>
            }
            {
              options.login.authRoutes.includes('create-cdkey') &&
              <Col className='gutter-row' span={2}>
                <Button type='ghost' onClick={this.handleCreate}>添加</Button>
              </Col>
            }
          </Row>
        </Form>

        <Modal
          width={1000}
          key='create-cdkey'
          title='添加兑换码礼包'
          visible={this.state.visible}
          onCancel={this.handleCancel}
          footer={null}
          maskClosable={false}
          destroyOnClose
        >
          <CreateModal
            dataFlow={this.props.dataFlow}
            onCreate={this.props.onCreate}
            onSearch={this.props.onSearch}
            onModalLoad={this.onModalLoad}
            onSubmitting={this.handleCancel}
          />
        </Modal>
      </Fragment>
    )
  }
}

CDKeyFilter.propTypes = {
  form: PropTypes.object,
  dataFlow: PropTypes.object,
  onCreate: PropTypes.func,
  onSearch: PropTypes.func,
}

const Filter = Form.create()(CDKeyFilter)

export default Filter
