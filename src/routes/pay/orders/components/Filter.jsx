import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'
import { Form, Row, Col, Cascader, Button, DatePicker, Input, Modal, Tooltip, message } from 'antd'

import RepairModal from './Modal'

const { RangePicker } = DatePicker

class OrderFilter extends Component {
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

  handleRepair = () => {
    this.setState({
      visible: true
    })
  }

  _formatFormData = (values) => {
    return {
      path: {
        productId: values.products[0],
        serverId: values.products[1]
      },
      params: {
        startTime: values.times[0].format('YYYY-MM-DD HH:mm:ss'),
        endTime: values.times[1].format('YYYY-MM-DD HH:mm:ss'),
        nickname: values.nickname || '',
        playerId: values.playerId || '',
        orderId: values.orderId || '',
        platformId: values.platformId || '',
      }
    }
  }

  handleExport = () => {
    this.props.form.validateFields((err, values) => {
      if (!err) {
        let data = this._formatFormData(values)
        this.props.onExport({ ...data })
      }
    })
  }

  handleCancel = (e) => {
    this.setState({
      visible: false
    })
  }

  onModalLoad = () => {
    return this.state
  }

  handleSearch = (e) => {
    e.preventDefault()
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        let data = this._formatFormData(values)
        this.props.onSearch({
          ...data,
          handle: 'SEARCH'
        })
      } else {
        Object.values(err).map(val => val.errors.map(v => message.warning(v.message, 3)))
      }
    })
  }

  render() {
    const { form: { getFieldDecorator }, options, products } = this.props
    const check = products.value[0] ? false : this.state.select

    return (
      <Fragment>
        <Form layout='inline' onSubmit={this.handleSearch}>
          {
            options.login.authRoutes.includes('pay-orders') &&
            <Row gutter={16} style={{ marginBottom: 6 }}>
              <Col className='gutter-row' span={6}>
                {getFieldDecorator('products', {
                  rules: [{ type: 'array', required: true, message: '请选择产品/服务器!' }]
                })(
                  <Cascader
                    options={options.globals.products}
                    showSearch
                    onChange={this.handleProductSelect}
                    placeholder='请选择产品/服务器'
                    expandTrigger='hover'
                  />
                )}
              </Col>
              <Col className='gutter-row' span={7}>
                {getFieldDecorator('times', {
                  rules: [{ type: 'array', required: false, message: '请选择开始时间和结束时间' }]
                })(
                  <RangePicker
                    showTime
                    format='YYYY-MM-DD HH:mm:ss'
                    placeholder={['请选择开始时间', '请选择结束时间']}
                    disabled={check}
                    style={{ width: '100%' }}
                  />
                )}
              </Col>
            </Row>
          }
          {
            options.login.authRoutes.includes('pay-orders') &&
            <Row gutter={16} style={{ marginBottom: 8 }}>
              <Col className='gutter-row' span={4}>
                {getFieldDecorator('nickname', {
                  rules: [{ required: false, message: '请填写玩家昵称!' }]
                })(
                  <Input placeholder='请填写玩家昵称' disabled={check} />
                )}
              </Col>
              <Col className='gutter-row' span={4}>
                {getFieldDecorator('playerId', {
                  rules: [{ required: false, message: '请填写玩家 ID!' }]
                })(
                  <Input placeholder='请填写玩家 ID' disabled={check} />
                )}
              </Col>
              <Col className='gutter-row' span={4}>
                {getFieldDecorator('orderId', {
                  rules: [{ required: false, message: '请填写订单 ID!' }]
                })(
                  <Input placeholder='请填写订单 ID' disabled={check} />
                )}
              </Col>
              <Col className='gutter-row' span={4}>
                {getFieldDecorator('platformId', {
                  rules: [{ required: false, message: '请填写平台 ID!' }]
                })(
                  <Input placeholder='请填写平台 ID' disabled={check} />
                )}
              </Col>
              <Col className='gutter-row' span={2}>
                <Button type='primary' htmlType='submit'>查询</Button>
              </Col>
              {
                options.login.authRoutes.includes('pay-repair') &&
                <Col className='gutter-row' span={2}>
                  <Button type='ghost' onClick={this.handleRepair}>充值补单</Button>
                </Col>
              }
              {
                options.login.authRoutes.includes('pay-export') &&
                <Col className='gutter-row' span={2}>
                  <Tooltip title='请先选择产品和服务器！！！'>
                    <Button type='ghost' onClick={this.handleExport} disabled={check}>数据导出</Button>
                  </Tooltip>
                </Col>
              }
            </Row>
          }
        </Form>

        <Modal
          width={700}
          key='pay-repair'
          title='充值补单'
          visible={this.state.visible}
          onCancel={this.handleCancel}
          footer={null}
          maskClosable={false}
          destroyOnClose
        >
          <RepairModal
            options={this.props.options}
            initials={this.props.initials}
            onRepair={this.props.onRepair}
            onModalLoad={this.onModalLoad}
            onSubmitting={this.handleCancel}
          />
        </Modal>
      </Fragment>
    )
  }
}

OrderFilter.propTypes = {
  form: PropTypes.object,
  options: PropTypes.object,
  initials: PropTypes.object,
  products: PropTypes.object,
  onSearch: PropTypes.func,
  onExport: PropTypes.func,
  onRepair: PropTypes.func
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
      times: Form.createFormField({
        ...props.times,
        value: props.times.value
      }),
      nickname: Form.createFormField({
        ...props.nickname,
        value: props.nickname.value
      }),
      playerId: Form.createFormField({
        ...props.playerId,
        value: props.playerId.value
      }),
      orderId: Form.createFormField({
        ...props.orderId,
        value: props.orderId.value
      }),
      platformId: Form.createFormField({
        ...props.platformId,
        value: props.platformId.value
      }),
    }
  },
  onValuesChange(_, values) {}
})(OrderFilter)

export default Filter
