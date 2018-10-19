import React, { Component } from 'react'
import PropTypes from 'prop-types'
import _ from 'lodash'
import { Form, Row, Col, Cascader, Button, Modal, Input } from 'antd'

import Add from './Modal'

class BlackFilter extends Component {
  static propTypes = {
    curd: PropTypes.object.isRequired,
    form: PropTypes.object,
    options: PropTypes.array,
    onSearch: PropTypes.func,
    onAdd: PropTypes.func
  }

  state = {
    visible: false
  }

  handleSearch = (e) => {
    e.preventDefault()
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        let val = {}
        val.productId = values.productId[0]
        if (values.userId) {
          val.userId = values.userId
        }
        this.props.onSearch(val)
      }
    })
  }

  handleClick = () => {
    this.setState({
      visible: true
    })
  }

  handleCancel = () => {
    this.setState({
      visible: false
    })
  }

  render() {
    const { form: { getFieldDecorator }, options, curd } = this.props
    let productOpt = []
    _.map(options, (val, idx) => {
      productOpt.push({
        value: val.value,
        label: val.label
      })
    })

    return (
      <div>
        <Form layout='inline' onSubmit={this.handleSearch}>
          <Row gutter={20} style={{ marginBottom: 6 }}>
            {
              _.has(curd, '80301')
              ?
                <Col className='gutter-row' span={6}>
                  {getFieldDecorator('productId', {
                    rules: [{ required: true, message: '请选择产品' }]
                  })(
                    <Cascader
                      options={productOpt}
                      showSearch
                      placeholder='请选择产品(必填)'
                      expandTrigger='hover'
                    />
                  )}
                </Col>
              :
                ''
            }
            {
              _.has(curd, '80301')
              ?
                <Col className='gutter-row' span={6}>
                  {getFieldDecorator('userId', {
                    rules: [{ required: false, message: '请选择平台ID' }]
                  })(
                    <Input
                      placeholder='请选择平台ID(非必填)'
                    />
                  )}
                </Col>
              :
                ''
            }
            {
              _.has(curd, '80301')
              ?
                <Col className='gutter-row' span={2}>
                  <Button type='primary' htmlType='submit'>查询</Button>
                </Col>
              :
                ''
            }
            {
              _.has(curd, '80302')
              ?
                <Col className='gutter-row' span={2}>
                  <Button type='default' onClick={this.handleClick}>添加黑名单</Button>
                </Col>
              :
                ''
            }
          </Row>
        </Form>

        <Modal
          key={Math.random()}
          width={900}
          maskClosable={false}
          title='添加平台黑名单'
          footer={null}
          visible={this.state.visible}
          onCancel={this.handleCancel}
        >
          <Add
            options={this.props.options}
            handleCancel={this.handleCancel}
            onAdd={this.props.onAdd}
          />
        </Modal>
      </div>
    )
  }
}

const Filter = Form.create()(BlackFilter)

export default Filter
