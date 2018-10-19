import React, { Component } from 'react'
import PropTypes from 'prop-types'
import _ from 'lodash'
import moment from 'moment'
import { Form, Button, Cascader, InputNumber, DatePicker, Input, Row, Col, Modal, Tooltip, Icon } from 'antd'

import Exports from './Export'

const ButtonGroup = Button.Group
const { RangePicker } = DatePicker

class TradeFilter extends Component {
  state = {
    select: 0,
    visible: false
  }

  handleProductSelect = (products) => {
    this.props.onSearch({
      products: {
        productId: products[0],
        serverId: products[1]
      },
      handle: 'GET_GOODS'
    })
  }

  handleFilterSelect = (select) => {
    this.setState({
      select: select[0]
    })
  }

  _paramsReduce = (options) => {
    return _.reduce(options, (result, val, key) => {
      result.push(`${key}=${val}`)
      return result
    }, [])
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

  handleSearch = (e) => {
    e.preventDefault()
    this.props.form.validateFieldsAndScroll((err, values) => {
      const { initials } = this.props
      if (!err) {
        let obj = {}
        if (values.time && values.time.length > 0) {
          obj.startTime = moment(values.time[0]).format('x')
          obj.endTime = moment(values.time[1]).format('x')
        }
        if (values.selectTypes && values.selectTypes.length) obj.selectType = values.selectTypes[0]
        if (values.itemIds && values.itemIds.length) obj.itemId = values.itemIds[1]
        if (values.low) obj.low = values.low
        if (values.high) obj.high = values.high
        if (values.buyer) obj.buyer = values.buyer
        if (values.seller) obj.seller = values.seller

        let params = this._paramsReduce(obj)
        this.props.onSearch({
          search: params.length ? params.length > 1 ? params.join('&') : params[0] : '',
          handle: 'GET_TRADES',
          params: {
            selectType: obj.selectType ? obj.selectType : initials.params.selectType,
            items: {
              type: obj.itemId ? values.itemIds[0] : initials.params.items.type,
              itemId: obj.itemId ? obj.itemId : initials.params.items.itemId
            },
            low: obj.low ? obj.low : initials.params.low,
            high: obj.high ? obj.high : initials.params.high,
            buyer: obj.buyer ? obj.buyer : initials.params.buyer,
            seller: obj.seller ? obj.seller : initials.params.seller
          }
        })
      }
    })
  }

  render() {
    const { form: { getFieldDecorator }, options, initials } = this.props

    return (
      <div style={{ marginBottom: 6 }}>
        <Form onSubmit={this.handleSearch}>
          <Row gutter={10}>
            <Col className='gutter-row' span={8} style={{ marginBottom: 8 }}>
              {getFieldDecorator('products', {
                initialValue: initials.products.productId ? [initials.products.productId, initials.products.serverId] : [],
                rules: [{ type: 'array', required: true, message: '请选择产品/服务器(必选)以启用道具!' }],
                onChange: this.handleProductSelect
              })(
                <Cascader
                  options={options.products}
                  showSearch
                  expandTrigger='hover'
                  placeholder='请选择产品/服务器(必选)以启用道具'
                  style={{ width: '100%' }}
                />
              )}
            </Col>
            <Col className='gutter-row' span={8}>
              {getFieldDecorator('time', {
                rules: [{ required: false, message: '请选择日期' }]
              })(
                <RangePicker
                  format='YYYY-MM-DD'
                  showTime={{
                    defaultValue: [moment('00:00:00', 'HH:mm:ss'), moment('00:00:00', 'HH:mm:ss')]
                  }}
                />
              )}
              <i style={{ marginLeft: '5px' }}><Tooltip title='时间空选表示查询所有结果'><Icon type='question-circle-o' /></Tooltip></i>
            </Col>
            <Col className='gutter-row' span={6}>
              {getFieldDecorator('selectTypes', {
                rules: [{ type: 'array', required: true, message: '请选择筛选条件(必选)!' }],
                initialValue: [0],
                onChange: this.handleFilterSelect
              })(
                <Cascader
                  options={initials.enum.selectTypes}
                  showSearch
                  expandTrigger='hover'
                  placeholder='请选择筛选条件(必选)'
                />
              )}
            </Col>
          </Row>

          <Row gutter={10}>
            {
              (this.state.select === initials.conf.select.price ||
              this.state.select === initials.conf.select.num ||
              this.state.select === initials.conf.select.item) &&
              <Col className='gutter-row' span={6} style={{ marginRight: this.state.select === initials.conf.select.item ? 16 : 0 }}>
                {getFieldDecorator('itemIds', {
                  rules: [{ type: 'array', required: true, message: '请选择类型/道具(必选)!' }]
                })(
                  <Cascader
                    options={options.goods.list}
                    showSearch
                    expandTrigger='hover'
                    placeholder='请选择类型/道具(必选)'
                  />
                )}
              </Col>
            }
            {
              (this.state.select === initials.conf.select.price ||
              this.state.select === initials.conf.select.num) &&
              <Col className='gutter-row' span={3}>
                {getFieldDecorator('low', {
                  rules: [{ required: false, message: '请输入最小值!' }]
                })(
                  <InputNumber placeholder='请输入最小值' min={0} style={{ width: '100%' }} />
                )}
              </Col>
            }
            {
              (this.state.select === initials.conf.select.price ||
              this.state.select === initials.conf.select.num) &&
              <Col className='gutter-row' span={3} style={{ marginRight: 16 }}>
                {getFieldDecorator('high', {
                  rules: [{ required: false, message: '请输入最大值!' }]
                })(
                  <InputNumber placeholder='请输入最大值' min={0} style={{ width: '100%' }} />
                )}
              </Col>
            }
            {
              (this.state.select === initials.conf.select.name) &&
              <Col className='gutter-row' span={6}>
                {getFieldDecorator('buyer', {
                  rules: [{ required: false, message: '请输入买家昵称!' }]
                })(
                  <Input
                    placeholder='请输入买家昵称'
                  />
                )}
              </Col>
            }
            {
              (this.state.select === initials.conf.select.name) &&
              <Col className='gutter-row' span={6} style={{ marginRight: 16 }}>
                {getFieldDecorator('seller', {
                  rules: [{ required: false, message: '请输入卖家昵称!' }]
                })(
                  <Input
                    placeholder='请输入卖家昵称'
                  />
                )}
              </Col>
            }
            <Col className='gutter-row' span={6}>
              <ButtonGroup>
                {
                  options.authorize.includes(170101) &&
                  <Button type='primary' icon='search' htmlType='submit'>查询</Button>
                }
                {
                  options.authorize.includes(170104) &&
                  <Button type='primary' icon='download' onClick={this.handleClick}>导出</Button>
                }
              </ButtonGroup>
            </Col>
          </Row>
        </Form>
        <Modal
          title='导出'
          visible={this.state.visible}
          onCancel={this.handleCancel}
          footer={null}
          width={650}
        >
          <Exports
            onExport={this.props.onExport}
            handleCancel={this.handleCancel}
            options={this.props.options}
            tradeGoods={this.props.tradeGoods}
            initials={this.props.initials}
          />
        </Modal>
      </div>
    )
  }
}

TradeFilter.propTypes = {
  form: PropTypes.object,
  tradeGoods: PropTypes.object,
  options: PropTypes.object,
  initials: PropTypes.object,
  onSearch: PropTypes.func,
  onExport: PropTypes.func
}

const Filter = Form.create({
  onFieldsChange(props, changedFields) {
    props.onChange(changedFields)
  },
  mapPropsToFields(props) {
    return {
      products: Form.createFormField({
        ...props.products
      }),
      time: Form.createFormField({
        ...props.time
      }),
      selectTypes: Form.createFormField({
        ...props.selectTypes
      }),
      itemIds: Form.createFormField({
        ...props.itemIds
      }),
      state: Form.createFormField({
        ...props.state
      }),
      sign: Form.createFormField({
        ...props.sign
      }),
      low: Form.createFormField({
        ...props.low
      }),
      high: Form.createFormField({
        ...props.high
      }),
      seller: Form.createFormField({
        ...props.seller
      }),
      buyer: Form.createFormField({
        ...props.buyer
      })
    }
  },
  onValuesChange(_, values) {
  }
})(TradeFilter)

export default Filter
