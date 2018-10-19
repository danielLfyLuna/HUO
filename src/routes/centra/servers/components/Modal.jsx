import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { Form, Input, Cascader, Button, Switch } from 'antd'

import openNotificationWithIcon from '../../../../base/components/Notification'
import { fetchGlobalProducts } from '../../../../base/modules/Global'
import { fetchCellsMap } from '../modules/Module'

const FormItem = Form.Item

const mapDispatchtoProps = {
  fetchCellsMap,
  fetchGlobalProducts
}
const mapStateToProps = (state) => ({
  server: state.server,
  globals: state.globals,
  login: state.islogin
})

@connect(mapStateToProps, mapDispatchtoProps)
class ServerModal extends Component {
  state = {
    currentItem: {},
    modalType: ''
  }

  componentWillMount() {
    const { currentItem, modalType } = this.props.onModalLoad()

    this.setState({
      currentItem: currentItem,
      modalType: modalType
    })
    switch (modalType) {
      case 'create':
        this.props.fetchCellsMap()
        break
      case 'update':
        this.props.fetchGlobalProducts()
        break
      default:
        console.log('Error')
    }
  }

  _cellFormat = (cells, products) => products.map(val => ({
    value: val.value,
    label: val.label,
    children: cells[Number(val.value)]
              ? cells[Number(val.value)].map(v => ({ value: v, label: v }))
              : [{ value: '', label: '没有可用节点' }]
  }))

  _cellReduce = (cells, products) => {
    return products.map(val => {
      return ({
        value: val.value,
        label: val.label,
        children: cells[Number(val.value)].length
                  ? cells[Number(val.value)].map(v => ({ value: v, label: v }))
                  : [{ value: '', label: '没有可用节点' }]
      })
    })
  }

  handleSubmit = (e) => {
    e.preventDefault()
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        let data = {
          productId: values.products[0],
          serverId: values.products[1] || '',
          serverName: values.serverName,
          group: values.groups[0] || '',
          hot: values.hot[0] || 0,
          recommend: values.recommend[0] || 0,
          status: values.status[0] || 0,
          purchaseOpen: values.purchaseOpen
        }

        if (data.serverId === '') {
          return openNotificationWithIcon('warning', `当前所选产品(${data.productId})下没有可用节点，请重新选择其他产品和节点！`)
        }

        if (this.state.modalType === 'create') {
          this.props.onCreate({
            path: {
              productId: data.productId
            },
            form: data
          })
        } else {
          this.props.onUpdate({
            path: {
              productId: data.productId,
              serverId: data.serverId
            },
            form: data
          })
        }
        this.props.onSubmitting()
      }
    })
  }

  render() {
    const { form: { getFieldDecorator }, options, initials, globals, server } = this.props
    const check = this.state.modalType !== 'create'
    const detail = this.state.currentItem
    let cellsMap = []
    let productsMap = []
    cellsMap = this._cellFormat(server.cells, options.list.product)
    productsMap = check ? globals.products : cellsMap

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
        <FormItem {...formItemLayout} label='产品/服务器'>
          {getFieldDecorator('products', {
            initialValue: detail.productId ? [`${detail.productId}`, `${detail.serverId}`] : [],
            rules: [{ type: 'array', required: true, message: '请选择产品、服务器!' }]
          })(
            <Cascader
              options={productsMap}
              showSearch
              changeOnSelect
              expandTrigger='hover'
              disabled={check}
              placeholder='选择产品、服务器'
            />
          )}
        </FormItem>

        <FormItem {...formItemLayout} label='服务器名称'>
          {getFieldDecorator('serverName', {
            initialValue: detail.serverName,
            rules: [{ required: true, message: '请填写服务器名称!' }]
          })(
            <Input placeholder='填写服务器名称' />
          )
          }
        </FormItem>

        <FormItem {...formItemLayout} label='分组'>
          {getFieldDecorator('groups', {
            initialValue: detail.group ? [detail.group] : [],
            rules: [{ type: 'array', required: false, message: '请选择分组!' }]
          })(
            <Cascader
              options={options.groups}
              showSearch
              expandTrigger='hover'
              placeholder='选择分组'
            />
          )}
        </FormItem>

        <FormItem {...formItemLayout} label='火爆'>
          {getFieldDecorator('hot', {
            initialValue: detail.hot ? [detail.hot] : [],
            rules: [{ type: 'array', required: true, message: '请选择火爆程度!' }]
          })(
            <Cascader
              options={initials.enum.hotTypes}
              showSearch
              expandTrigger='hover'
              placeholder='选择火爆程度'
            />
          )}
        </FormItem>

        <FormItem {...formItemLayout} label='是否推荐'>
          {getFieldDecorator('recommend', {
            initialValue: detail.recommend ? [detail.recommend] : [],
            rules: [{ type: 'array', required: false, message: '请选择是否推荐!' }]
          })(
            <Cascader
              options={initials.enum.recommendTypes}
              showSearch
              expandTrigger='hover'
              placeholder='选择是否推荐'
            />
          )}
        </FormItem>

        <FormItem {...formItemLayout} label='状态'>
          {getFieldDecorator('status', {
            initialValue: detail.status ? [detail.status] : [],
            rules: [{ type: 'array', required: false, message: '请选择服务器状态!' }]
          })(
            <Cascader
              options={initials.enum.status}
              showSearch
              expandTrigger='hover'
              placeholder='选择服务器状态'
            />
          )}
        </FormItem>

        <FormItem {...formItemLayout} label='充值开启'>
          {getFieldDecorator('purchaseOpen', {
            initialValue: detail.purchaseOpen || false,
            rules: [{ type: 'boolean', required: false, message: '请选择充值开启!' }]
          })(
            <Switch checkedChildren='开启' unCheckedChildren='关闭' defaultChecked={detail.purchaseOpen || false} />
          )}
        </FormItem>

        <FormItem {...tailFormItemLayout}>
          <Button type='primary' htmlType='submit' >提交</Button>
        </FormItem>
      </Form>
    )
  }
}

ServerModal.propTypes = {
  form: PropTypes.object,
  options: PropTypes.object,
  initials: PropTypes.object,
  globals: PropTypes.object,
  server: PropTypes.object,
  onModalLoad: PropTypes.func,
  onCreate: PropTypes.func,
  onUpdate: PropTypes.func,
  onSubmitting: PropTypes.func,
  fetchCellsMap: PropTypes.func,
  fetchGlobalProducts: PropTypes.func,
}

const Modal = Form.create()(ServerModal)

export default Modal
