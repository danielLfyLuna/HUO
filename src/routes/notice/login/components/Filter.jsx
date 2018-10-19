import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'
import { Form, Row, Col, Button, Cascader, Modal, DatePicker } from 'antd'
import moment from 'moment'

import CreateForms from './Forms'

const { RangePicker } = DatePicker

export class LoginFilter extends Component {

  static propTypes = {
    form: PropTypes.object,
    dataFlow: PropTypes.object,
    onCreate: PropTypes.func,
    onSearch: PropTypes.func
  }

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

  handleCancel = () => {
    this.setState({
      visible: false
    })
  }

  onModalLoad = () => {
    return this.state
  }

  handleSearch = (e) => {
    e.preventDefault()
    // 校验并获取一组输入域的值与 Error，若 fieldNames 参数为空，则校验全部组件
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        let data = {}
        if (values.products.length) data.productId = values.products[0]
        if (values.channels.length) data.channels = values.channels[0]
        if (values.times.length) {
          data.startTime = moment(values.times[0]).format('YYYY-MM-DD HH:mm:ss')
          data.endTime = moment(values.times[1]).format('YYYY-MM-DD HH:mm:ss')
        }
        if (values.open.length) data.open = values.open[0]

        this.props.onSearch({
          params: data,
          handle: 'SEARCH'
        })
      }
    })
  }

  render() {
    const { form: { getFieldDecorator }, dataFlow: { options, initials } } = this.props
    return (
      <Fragment>
        <Form layout='inline' onSubmit={this.handleSearch}>
          <Row gutter={16} style={{ marginBottom: 8 }}>
            {
              options.login.authRoutes.includes('fetch-logins') &&
              <Col className='gutter-row' span={4}>
                {getFieldDecorator('products', {
                  rules: [{ type: 'array', required: false, message: '请选择产品!' }]
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
              options.login.authRoutes.includes('fetch-logins') &&
              <Col className='gutter-row' span={4}>
                {getFieldDecorator('channels', {
                  rules: [{ type: 'array', required: false, message: '请选择渠道!' }]
                })(
                  <Cascader
                    options={options.channels}
                    showSearch
                    expandTrigger='hover'
                    placeholder='请选择渠道'
                  />
                )}
              </Col>
            }
            {
              options.login.authRoutes.includes('fetch-logins') &&
              <Col className='gutter-row' span={4}>
                {getFieldDecorator('open', {
                  rules: [{ type: 'array', required: false, message: '请选择开关状态!' }]
                })(
                  <Cascader
                    options={initials.enum.openItems}
                    showSearch
                    expandTrigger='hover'
                    placeholder='请选择开关状态'
                  />
                )}
              </Col>
            }
            {
              options.login.authRoutes.includes('fetch-logins') &&
              <Col className='gutter-row' span={7}>
                {getFieldDecorator('times', {
                  rules: [{ type: 'array', required: false, message: '请选择开始时间和结束时间' }]
                })(
                  <RangePicker
                    showTime
                    format='YYYY-MM-DD HH:mm:ss'
                    placeholder={['请选择开始时间', '请选择结束时间']}
                    style={{ width: '100%' }}
                  />
                )}
              </Col>
            }
            {
              options.login.authRoutes.includes('fetch-logins') &&
              <Col className='gutter-row' span={2}>
                <Button type='primary' htmlType='submit'>查询</Button>
              </Col>
            }
            {
              options.login.authRoutes.includes('create-login') &&
              <Col className='gutter-row' span={2}>
                <Button type='ghost' onClick={this.handleCreate}>添加</Button>
              </Col>
            }
          </Row>
        </Form>

        <Modal
          width={1000}
          key='create-login'
          title='添加登录公告'
          visible={this.state.visible}
          onCancel={this.handleCancel}
          footer={null}
          maskClosable={false}
          destroyOnClose
        >
          <CreateForms
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
      channels: Form.createFormField({
        ...props.channels,
        value: props.channels.value
      }),
      times: Form.createFormField({
        ...props.times,
        value: props.times.value
      }),
      open: Form.createFormField({
        ...props.open,
        value: props.open.value
      })
    }
  },
  onValuesChange(_, values) {}
})(LoginFilter)

export default Filter
