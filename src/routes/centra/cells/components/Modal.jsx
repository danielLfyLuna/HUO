import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { Form, Input, Cascader, Button } from 'antd'

import { fetchCellTypes, createCell } from '../modules/Module'

const FormItem = Form.Item

function _hasErrors(fieldsError) {
  return Object.keys(fieldsError).some(field => fieldsError[field])
}

const mapDispatchtoProps = {
  fetchCellTypes,
  createCell
}

const mapStateToProps = (state, props) => ({
  cell: state.cell,
  login: state.islogin
})

@connect(mapStateToProps, mapDispatchtoProps)
class CellModal extends Component {
  state = {
    productId: '',
    cellType: '',
    serverPort: '',
    currentItem: {},
    modalType: ''
  }

  componentWillMount() {
    const { currentItem, modalType } = this.props.onModalLoad()

    this.setState({
      productId: currentItem ? currentItem.productId : this.props.options.products.list[0].value,
      currentItem: currentItem,
      modalType: modalType
    })
  }

  componentDidMount() {
    this.props.form.validateFields(['products'])
  }

  handleProductSelect = (productId) => {
    this.props.fetchCellTypes({
      path: { productId: productId }
    })
    this.setState({
      productId: productId
   })
  }

  handleSubmit = (e) => {
    e.preventDefault()
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        let data = {
          productId: values.products[0],
          serverId: values.serverId,
          serverHost: values.serverHost,
          serverLocal: values.serverLocal,
          cellType: values.cellTypes[0],
          serverPort: values.cellTypes[1],
          dbHost: values.dbHost,
          dbPort: values.dbPort,
          crossServerId: values.crossServerId,
          audioServerId: values.audioServerId,
          combineServerId: values.combineServerId
        }
        if (values.status) {
          data = {
            ...data,
            status: values.status[0]
          }
        }

        const posts = {
          form: data,
          path: {
            productId: data.productId,
            serverId: data.serverId
          }
        }

        if (this.state.modalType === 'create') {
          this.props.createCell(posts)
        } else {
          this.props.onUpdate(posts)
        }
        this.props.onSubmitting()
      }
    })
  }


  render() {
    const { form: {
      getFieldDecorator,
      getFieldsError,
      getFieldError,
      isFieldTouched
    }, options, initials } = this.props

    let productOpt = []
    if (!productOpt.length) {
      productOpt = options.globals.products.map(o => ({ label: o.label, value: o.value }))
    }

    const check = this.state.modalType !== 'create'
    const productsError = isFieldTouched('productId') && getFieldError('productId')
    const detail = this.state.currentItem

    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 8 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 12 }
      }
    }

    const tailFormItemLayout = {
      wrapperCol: {
        xs: { span: 24, offset: 0 },
        sm: { span: 14, offset: 6 }
      }
    }

    return (
      <Form onSubmit={this.handleSubmit}>
        <FormItem
          {...formItemLayout}
          validateStatus={productsError ? 'error' : ''}
          label='产品'
        >
          {getFieldDecorator('products', {
            initialValue: this.state.productId ? [this.state.productId] : [],
            rules: [{ type: 'array', required: true, message: '请选择产品!' }],
            onChange: this.handleProductSelect
          })(
            <Cascader
              options={productOpt}
              showSearch
              expandTrigger='hover'
              placeholder='选择产品'
              disabled={check}
            />
          )}
        </FormItem>
        {
          !_hasErrors(getFieldsError(['products'])) &&
          <div>
            <FormItem
              {...formItemLayout}
              label='节点 ID'
            >
              {getFieldDecorator('serverId', {
                initialValue: detail.serverId,
                rules: [{ required: true, message: '请填写节点 ID!' }]
              })(
                <Input disabled={check} placeholder='填写节点 ID' />
              )}
            </FormItem>

            <FormItem
              {...formItemLayout}
              label='服务器主机 (外网IP)'
            >
              {getFieldDecorator('serverHost', {
                initialValue: detail.serverHost,
                rules: [{ required: true, message: '请填写服务器主机 外网 IP!' }]
              })(
                <Input placeholder='填写服务器主机 外网 IP' />
              )}
            </FormItem>

            <FormItem
              {...formItemLayout}
              label='服务器主机 (内网IP)'
            >
              {getFieldDecorator('serverLocal', {
                initialValue: detail.serverLocal,
                rules: [{ required: true, message: '请填写服务器主机 内网 IP!' }]
              })(
                <Input placeholder='填写服务器主机 内网 IP' />
              )}
            </FormItem>

            <FormItem {...formItemLayout} label='节点类型/服务器端口/WEB端口'>
              {getFieldDecorator('cellTypes', {
                initialValue: detail.cellType ? [`${detail.cellType}`, `${detail.serverPort}`] : [],
                rules: [{ type: 'array', required: true, message: '请选择节点类型、服务器端口、Web 端口!' }]
              })(
                <Cascader
                  options={options.cell.types}
                  showSearch
                  expandTrigger='hover'
                  placeholder='选择节点类型、服务器端口、Web 端口'
                />
              )}
            </FormItem>

            <FormItem
              {...formItemLayout}
              label='数据库主机'
            >
              {getFieldDecorator('dbHost', {
                initialValue: detail.dbHost,
                rules: [{ required: true, message: '请填写数据库主机 IP!' }]
              })(
                <Input placeholder='填写数据库主机 IP' />
              )}
            </FormItem>

            <FormItem
              {...formItemLayout}
              label='数据库端口'
            >
              {getFieldDecorator('dbPort', {
                initialValue: detail.dbPort || '3306',
                rules: [{ required: true, message: '请填写数据库端口，默认3306!' }]
              })(
                <Input placeholder='填写数据库端口，默认3306' />
              )}
            </FormItem>

            <FormItem
              {...formItemLayout}
              label='跨服ID'
            >
              {getFieldDecorator('crossServerId', {
                initialValue: detail.crossServerId || '',
                rules: [{ message: '请填写跨服 ID!' }]
              })(
                <Input placeholder='填写跨服 ID' />
              )}
            </FormItem>

            <FormItem
              {...formItemLayout}
              label='媒体服务器ID'
            >
              {getFieldDecorator('audioServerId', {
                initialValue: detail.audioServerId || '',
                rules: [{ message: '请填写媒体服务器 ID!' }]
              })(
                <Input placeholder='填写媒体服务器 ID' />
              )}
            </FormItem>

            <FormItem
              {...formItemLayout}
              label='合服主服务器ID'
            >
              {getFieldDecorator('combineServerId', {
                initialValue: detail.combineServerId || '',
                rules: [{ message: '请填写合服主服务器 ID!' }]
              })(
                <Input disabled={check} placeholder='填写合服主服务器 ID' />
              )}
            </FormItem>
            {
              this.state.modalType === 'update' &&
              <FormItem
                {...formItemLayout}
                label='状态'
              >
                {getFieldDecorator('status', {
                  initialValue: detail.status ? [detail.status] : [],
                  rules: [{ type: 'array', required: true, message: '请选择状态!' }]
                })(
                  <Cascader
                    options={initials.enum.cellStatus}
                    showSearch
                    expandTrigger='hover'
                    placeholder='选择状态'
                  />
                )}
              </FormItem>
            }
          </div>
        }

        <FormItem {...tailFormItemLayout}>
          <Button type='primary' htmlType='submit' >提交</Button>
        </FormItem>
      </Form>
    )
  }
}

CellModal.propTypes = {
  form: PropTypes.object,
  options: PropTypes.object,
  initials: PropTypes.object,
  onModalLoad: PropTypes.func,
  onSubmitting: PropTypes.func,
  onUpdate: PropTypes.func,
  createCell: PropTypes.func,
  fetchCellTypes: PropTypes.func
}

const Modal = Form.create()(CellModal)

export default Modal
