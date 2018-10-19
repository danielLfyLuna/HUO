import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'
import _ from 'lodash'
import { Form, Row, Col, Button, Cascader, Modal, DatePicker, Select } from 'antd'
import moment from 'moment'

import NoticesLoginModal from './Modal'

const RangePicker = DatePicker.RangePicker

export class NoticesLoginFilter extends Component {

  static propTypes = {
    // curd: PropTypes.object,
    onCreate: PropTypes.func,
    options: PropTypes.array,
    form: PropTypes.object,
    onSearch: PropTypes.func,
    products: PropTypes.object,
    initialFiler: PropTypes.object
  }

  state = {
    visible: false,
    enum: {
      noticeTypes: [
        { label: '所有', value: '' },
        { label: '定时公告', value: 1 },
        { label: '跑马灯公告', value: 100 }
      ]
    }
  }

  noticeTypes = []

  componentWillMount() {
    _.map(this.state.enum.noticeTypes, (value, index) => {
      this.noticeTypes.push(
        <Select.Option key={value.value} value={value.value}>{value.label}</Select.Option>
      )
    })
  }

  handleAddNotice = () => {
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
        fieldsValue.productId = fieldsValue.products ? fieldsValue.products[0] : this.props.products.value[0]
        this.props.onSearch({
          path: {
            productId: fieldsValue.productId
          },
          params: {
            type: fieldsValue.noticeType,
            startTime: fieldsValue.time[0].format('YYYY-MM-DD HH:mm:ss'),
            endTime: fieldsValue.time[1].format('YYYY-MM-DD HH:mm:ss')
          },
          handle: 'SEARCH'
        })
      }
    })
  }

  render() {
    const { form: {getFieldDecorator}, initialFiler } = this.props

    let proOptions = []
    _.map(this.props.options, (v, i) => {
      proOptions.push({ label: v.label, value: v.value })
    })

    const ColProps = {
      xs: 24,
      sm: 12,
      style: {
        marginBottom: 6
      }
    }

    const TwoColProps = {
      ...ColProps,
      xl: 96
    }

    return (
      <Fragment>
        <Form
          className='ant-advanced-search-form'
          onSubmit={this.handleSearch}
        >
          <Row gutter={16}>
            <Col {...ColProps} xl={{ span: 6 }} md={{ span: 6 }}>
              {getFieldDecorator('products', {
                initialValue: initialFiler.value ? [this.props.initialFiler.value[0]] : [],
                rules: [{ required: true, message: '请选择产品(必选)' }]
              })(
                <Cascader
                  showSearch
                  options={proOptions}
                  placeholder='请选择产品(必选)'
                  expandTrigger='hover'
                />
              )}
            </Col>
            <Col {...ColProps} xl={{ span: 4 }} md={{ span: 6 }}>
              {getFieldDecorator('noticeType', {
                initialValue: ''
              })(
                <Select placeholder='请选择类型'>
                  {this.noticeTypes}
                </Select>
              )}
            </Col>
            <Col {...ColProps} xl={{ span: 7 }} md={{ span: 6 }}>
              {getFieldDecorator('time', {
                rules: [{ type: 'array', required: true, message: '请选择起止时间' }],
                initialValue: [moment('00:00:00', 'HH:mm:ss').subtract({days: 1}), moment('00:00:00', 'HH:mm:ss')]
              })(
                <RangePicker showTime format='YYYY-MM-DD HH:mm:ss' />
              )}
            </Col>

            <Col {...TwoColProps} xl={{ span: 3 }} md={{ span: 24 }} sm={{ span: 24 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <Button type='primary' className='margin-right' htmlType='submit'>查询</Button>
                <Button type='ghost' onClick={this.handleAddNotice}>写公告</Button>
              </div>
            </Col>
          </Row>
        </Form>

        <Modal
          width={700}
          key={Math.random()}
          title='写公告'
          visible={this.state.visible}
          onCancel={this.handleCancel}
          footer={null}
          maskClosable={false}
        >
          <NoticesLoginModal
            options={this.props.options}
            onCreate={this.props.onCreate}
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
      time: Form.createFormField({
        ...props.time
      }),
      products: Form.createFormField({
        ...props.products
      }),
      noticeType: Form.createFormField({
        ...props.noticeType
      })
    }
  },
  // 任一表单域的值发生改变时的回调
  onValuesChange(_, values) {
    console.log('Form.create.onValuesChange', values)
  }
})(NoticesLoginFilter)

export default Filter
