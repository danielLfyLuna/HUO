import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Form, Row, Col, Button, Cascader, Modal } from 'antd'
import _ from 'lodash'

import CreateModal from './Modal'


class AuthenticFilter extends Component {
  state = {
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
    this.props.form.validateFields((err, fieldsValue) => {
      if (!err) {
        this.props.onGet({
          productId: fieldsValue.products[0],
          serverId: fieldsValue.products[1]
        })
      }
    })
  }

  render() {
    const { form: { getFieldDecorator } } = this.props

    const ColProps = {
      xs: 24,
      sm: 18,
      md: 8,
      xl: 8,
      style: {
        marginBottom: 6
      }
    }

    return (
      <div>
        <Form layout='inline' onSubmit={this.handleSearch} >
          <Row gutter={20}>
            {
              _.has(this.props.curd, '100201') &&
              <Col {...ColProps}>
                {getFieldDecorator('products', {
                  rules: [{ required: true, message: '请选择产品与服务器' }]
                })(
                  <Cascader
                    style={{ width: '100%' }}
                    options={this.props.options}
                    placeholder='请选择产品/服务器(必选)'
                    showSearch
                    expandTrigger='hover'
                    popupClassName='cascaderMenu'
                  />
                )}
              </Col>
            }
            {
              _.has(this.props.curd, '100201') &&
              <Col className='gutter-row' span={2}>
                <Button type='primary' className='margin-right' htmlType='submit'>查询</Button>
              </Col>
            }
            {
              _.has(this.props.curd, '100202') &&
              <Col className='gutter-row' span={2}>
                <Button onClick={this.handleCreate}>添加 IP 地址</Button>
              </Col>
            }
          </Row>
        </Form>

        <Modal
          width={900}
          key={Math.random()}
          title='添加 IP 地址'
          visible={this.state.visible}
          onCancel={this.handleCancel}
          footer={null}
          maskClosable={false}
        >
          <CreateModal
            options={this.props.options}
            onCreate={this.props.onCreate}
            handleCancel={this.handleCancel}
          />
        </Modal>
      </div>
    )
  }
}

AuthenticFilter.propTypes = {
  form: PropTypes.object,
  curd: PropTypes.object,
  onCreate: PropTypes.func,
  onGet: PropTypes.func,
  options: PropTypes.array
}

const Filter = Form.create()(AuthenticFilter)

export default Filter
