import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'
import { Form, Row, Col, Button, Input, Modal, Cascader, Icon, DatePicker, message } from 'antd'
import moment from 'moment'
import 'moment/locale/zh-cn'
moment.locale('zh-cn')

import ExportContainer from '../containers/ExportContainer'

const RangePicker = DatePicker.RangePicker

class LogOperationsFilter extends Component {

  static propTypes = {
    curd: PropTypes.array.isRequired,
    onRender: PropTypes.func,
    onSubmit: PropTypes.func,
    operation: PropTypes.object,
    initial: PropTypes.object,
    options: PropTypes.array,
    form: PropTypes.object,
    onSearch: PropTypes.func,
    operationSources: PropTypes.func
  }

  state = {
    visible: false
  }

  handleExportLogOperations = () => {
    this.setState({
      visible: true
    })
  }

  handleCancel = (e) => {
    this.setState({
      visible: false
    })
  }

  handleOk = (e) => {
    this.setState({
      visible: false
    })
  }

  handleSearch = (e) => {
    e.preventDefault()
    // 校验并获取一组输入域的值与 Error，若 fieldNames 参数为空，则校验全部组件
    this.props.form.validateFields((err, values) => {
      if (!err) {
        let params = {}
        if (values.products) {
          params.productId = values.products[0]
          params.serverId = values.products[1]
        }
        if (values.nickname) params.nickname = values.nickname
        if (values.playerId) params.playerId = values.playerId
        if (values.dates) {
          params.startTime = values.dates[0].format('YYYY-MM-DD HH:mm:ss')
          params.endTime = values.dates[1].format('YYYY-MM-DD HH:mm:ss')
        } else {
          return
        }
        if (values.operationType.length) params.operationType = values.operationType[0]

        this.props.onSearch({
          params: params
        })
      } else {
        Object.values(err).map(val => val.errors.map(v => message.warning(v.message, 3)))
      }
    })
  }

  componentDidMount() {
    this.props.operationSources()
    // 消耗来源
  }

  render() {
    const { getFieldDecorator } = this.props.form
    const { curd } = this.props

    let operationSources = []
    for (let key in this.props.operation.operationSources) {
      operationSources.push({value: this.props.operation.operationSources[key], label: `${key}(${this.props.operation.operationSources[key]})`})
    }

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
        <Form onSubmit={this.handleSearch} >
          <Row gutter={16}>
            {
              curd.includes('fetch-operations') &&
              <Col {...ColProps} xl={{ span: 5 }} md={{ span: 6 }}>
                {getFieldDecorator('products', {
                  rules: [{ required: true, message: '请选择产品与服务器(必选)' }],
                  initialValue: this.props.initial.products ? this.props.initial.products : []
                })(
                  <Cascader
                    options={this.props.options}
                    placeholder='请选择产品与服务器(必选)'
                    showSearch
                    expandTrigger='hover'
                  />
                )}
              </Col>
            }
            {
              curd.includes('fetch-operations') &&
              <Col {...ColProps} xl={{ span: 4 }} md={{ span: 6 }}>
                {getFieldDecorator('nickname', {
                  rules: [{ required: false, message: '请输入玩家昵称' }],
                  initialValue: ''
                })(
                  <Input placeholder='玩家昵称' />
                )}
              </Col>
            }
            {
              curd.includes('fetch-operations') &&
              <Col {...ColProps} xl={{ span: 4 }} md={{ span: 6 }}>
                {getFieldDecorator('playerId', {
                  rules: [{ required: false, message: '请输入玩家ID' }],
                  initialValue: ''
                })(
                  <Input placeholder='玩家ID' />
                )}
              </Col>
            }
            {
              curd.includes('fetch-operations') &&
              <Col {...ColProps} xl={{ span: 4 }} md={{ span: 4 }}>
                {getFieldDecorator('operationType', {
                  rules: [{ required: false, message: '请输入操作来源' }]
                })(
                  <Cascader
                    options={operationSources}
                    placeholder='操作来源'
                    showSearch
                  />
                )}
              </Col>
            }
            {
              curd.includes('fetch-operations') &&
              <Col {...ColProps} xl={{ span: 6 }} md={{ span: 4 }}>
                {getFieldDecorator('dates', {
                  rules: [{ type: 'array', required: true, message: '请选择起止日期' }]
                })(
                  <RangePicker showTime format='YYYY-MM-DD HH:mm:ss' />
                )}
              </Col>
            }

            <Col {...TwoColProps} xl={{ span: 4 }} md={{ span: 4 }} sm={{ span: 4 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                {
                  curd.includes('fetch-operations') &&
                  <div>
                    <Button type='primary' className='margin-right' htmlType='submit'><Icon type='search' />查询</Button>
                  </div>
                }
                {
                  curd.includes('export-operations') &&
                  <div>
                    <Button type='ghost' onClick={this.handleExportLogOperations}><Icon type='edit' />导出</Button>
                  </div>
                }
              </div>
            </Col>
          </Row>
        </Form>

        <Modal
          width={900}
          key='operations-export'
          title='导出行为'
          visible={this.state.visible}
          onCancel={this.handleCancel}
          footer={null}
          maskClosable={false}
        >
          <ExportContainer
            options={this.props.options}
            operation={this.props.operation}
            onCreate={this.handleOk}
            onRender={this.props.onRender}
            onSubmit={this.props.onSubmit}
          />
        </Modal>
      </Fragment>
    )
  }
}

const Filter = Form.create({
  // 当 Form.Item 子节点的值发生改变时触发，可以把对应的值转存到 Redux store
  onFieldsChange(props, changedFields) {
    props.onChange(changedFields)
  },
  // 把 props 转为对应的值，可用于把 Redux store 中的值读出 {...this.state.fields}
  mapPropsToFields(props) {
    return {
      products: Form.createFormField({
        ...props.products,
        value: props.products.value
      }),
      nickname: Form.createFormField({
        ...props.nickname,
        value: props.nickname.value
      }),
      playerId: Form.createFormField({
        ...props.playerId,
        value: props.playerId.value
      }),
      dates: Form.createFormField({
        ...props.dates,
        value: props.dates.value
      }),
      operationType: Form.createFormField({
        ...props.operationType,
        value: props.operationType.value
      })
    }
  },
  // 任一表单域的值发生改变时的回调
  onValuesChange(_, values) {
    // console.log('Form.create.onValuesChange', values)
  }
})(LogOperationsFilter)

export default Filter
