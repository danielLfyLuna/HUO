import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'
import { Form, Row, Col, Button, Input, Modal, Cascader, Icon, DatePicker, message } from 'antd'

import ExportActions from './Modal'

export class ActionFilter extends Component {

  state = {
    visible: false
  }

  handleExportLogActions = () => {
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
        if (values.nickname) {
          params.nickname = values.nickname
        }
        if (values.playerId) params.playerId = values.playerId
        if (values.startTime) {
          params.startTime = values.startTime.format('YYYY-MM-DD')
        }
        if (values.consumeSource.length) params.consumeSource = values.consumeSource[0]
        if (values.produceSource.length) params.produceSource = values.produceSource[0]
        if (values.operationType.length) params.operationType = values.operationType[0]

        this.props.onSearch({
          params: params,
          handle: 'ACTIONS'
        })
      } else {
        Object.values(err).map(val => val.errors.map(v => message.warning(v.message, 3)))
      }
    })
  }

  componentDidMount() {
    this.props.onSearch({ handle: 'OPERATES' })
    this.props.onSearch({ handle: 'CONSUMES' })
    this.props.onSearch({ handle: 'PRODUCES' })
  }

  render() {
    const { getFieldDecorator } = this.props.form
    const { login, globals, sources } = this.props.options
    const authRoutes = login.authRoutes

    return (
      <Fragment>
        <Form layout='inline' onSubmit={this.handleSearch} >
          <Row gutter={16} style={{ marginBottom: 6 }}>
            {
              authRoutes.includes('fetch-actions') &&
              <Col className='gutter-row' span={6}>
                {getFieldDecorator('products', {
                  rules: [{ type: 'array', required: true, message: '请选择产品与服务器(必选)' }]
                })(
                  <Cascader
                    options={globals.products}
                    showSearch
                    expandTrigger='hover'
                    placeholder='请选择产品与服务器(必选)'
                  />
                )}
              </Col>
            }
            {
              authRoutes.includes('fetch-actions') &&
              <Col className='gutter-row' span={3}>
                {getFieldDecorator('startTime', {
                  rules: [{ required: true, message: '请选择日期' }]
                })(
                  <DatePicker placeholder='请选择日期(必选)' />
                )}
              </Col>
            }
            {
              authRoutes.includes('fetch-actions') &&
              <Col className='gutter-row' span={4}>
                {getFieldDecorator('nickname', {
                  rules: [{ required: false, message: '请输入玩家昵称' }],
                })(
                  <Input placeholder='玩家昵称' />
                )}
              </Col>
            }
            {
              authRoutes.includes('fetch-actions') &&
              <Col className='gutter-row' span={4}>
                {getFieldDecorator('playerId', {
                  rules: [{ required: false, message: '请输入玩家ID' }],
                })(
                  <Input placeholder='玩家ID' />
                )}
              </Col>
            }
            <Col className='gutter-row' span={2}>
              {
                authRoutes.includes('fetch-actions') &&
                <Button type='primary' className='margin-right' htmlType='submit'><Icon type='search' />查询</Button>
              }
            </Col>
            <Col className='gutter-row' span={2}>
              {
                authRoutes.includes('export-actions') &&
                <Button type='ghost' onClick={this.handleExportLogActions}><Icon type='edit' />导出</Button>
              }
            </Col>
          </Row>
          {
            authRoutes.includes('fetch-actions') &&
            <Row gutter={16} style={{ marginBottom: 8 }}>
              <Col className='gutter-row' span={6}>
                {getFieldDecorator('produceSource', {
                  rules: [{ type: 'array', required: false, message: '请输入生产来源' }]
                })(
                  <Cascader
                    options={sources.produce}
                    placeholder='生产来源'
                    showSearch
                  />
                )}
              </Col>
              <Col className='gutter-row' span={6}>
                {getFieldDecorator('consumeSource', {
                  rules: [{ type: 'array', required: false, message: '请输入消耗来源' }]
                })(
                  <Cascader
                    options={sources.consume}
                    placeholder='消耗来源'
                    showSearch
                  />
                )}
              </Col>
              <Col className='gutter-row' span={6}>
                {getFieldDecorator('operationType', {
                  rules: [{ type: 'array', required: false, message: '请输入操作来源' }]
                })(
                  <Cascader
                    options={sources.operate}
                    placeholder='操作来源'
                    showSearch
                  />
                )}
              </Col>
            </Row>
          }
        </Form>

        <Modal
          width={900}
          key='actions-export'
          title='导出行为'
          visible={this.state.visible}
          onCancel={this.handleCancel}
          footer={null}
          maskClosable={false}
          destroyOnClose
        >
          <ExportActions
            options={this.props.options}
            onExport={this.props.onExport}
            onSubmitting={this.handleCancel}
          />
        </Modal>
      </Fragment>
    )
  }
}

ActionFilter.propTypes = {
  form: PropTypes.object,
  options: PropTypes.object,
  sources: PropTypes.object,
  onSearch: PropTypes.func,
  onExport: PropTypes.func,
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
      startTime: Form.createFormField({
        ...props.startTime,
        value: props.startTime.value
      }),
      nickname: Form.createFormField({
        ...props.nickname,
        value: props.nickname.value
      }),
      playerId: Form.createFormField({
        ...props.playerId,
        value: props.playerId.value
      }),
      produceSource: Form.createFormField({
        ...props.produceSource,
        value: props.produceSource.value
      }),
      consumeSource: Form.createFormField({
        ...props.consumeSource,
        value: props.consumeSource.value
      }),
      operationType: Form.createFormField({
        ...props.operationType,
        value: props.operationType.value
      }),
    }
  },
  // 任一表单域的值发生改变时的回调
  onValuesChange(_, values) {}
})(ActionFilter)

export default Filter
