import React, { Component } from 'react'
import PropTypes from 'prop-types'
import _ from 'lodash'
import { Form, Button, Cascader, InputNumber, Input, Row, Col } from 'antd'


class TradeFilter extends Component {
  state = {
    select: 0
  }

  handleProductSelect = (products) => {
    this.props.onExport({
      products: {
        productId: products[0],
        serverId: products[1]
      },
      handle: 'GOODS'
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

  _goodReduce = (options, types) => {
    let goods = []
    _.reduce(options, (result, option, index) => {
      let gds = []
      _.reduce(option, (res, opt, idx) => {
        res.push({ value: idx, label: opt })
        return res
      }, gds)
      result.push({ value: index, label: types[index], children: gds })
      return result
    }, goods)
    return goods
  }

  handleSearch = (e) => {
    e.preventDefault()
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        let obj = {}
        if (values.selectTypes && values.selectTypes.length) obj.selectType = values.selectTypes[0]
        if (values.itemIds && values.itemIds.length) obj.itemId = values.itemIds[1]
        if (values.low) obj.low = values.low
        if (values.high) obj.high = values.high
        if (values.buyer) obj.buyer = values.buyer
        if (values.seller) obj.seller = values.seller

        let params = this._paramsReduce(obj)
        this.props.onExport({
          products: {
            productId: values.products[0],
            serverId: values.products[1]
          },
          search: params.length ? params.length > 1 ? params.join('&') : params[0] : '',
          handle: 'EXPORTS'
        })
        this.props.handleCancel()
      }
    })
  }

  render() {
    const { form: { getFieldDecorator }, options, initials, tradeGoods } = this.props
    const goods = this._goodReduce(tradeGoods.options, initials.map.goodTypes)

    return (
      <div style={{ marginBottom: 12 }}>
        <Form onSubmit={this.handleSearch}>
          <Row gutter={10}>
            <Col className='gutter-row' span={12} style={{ marginBottom: 8 }}>
              {getFieldDecorator('products', {
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
            <Col className='gutter-row' span={12}>
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
              <Col className='gutter-row' span={12}>
                {getFieldDecorator('itemIds', {
                  rules: [{ type: 'array', required: true, message: '请选择类型/道具(必选)!' }]
                })(
                  <Cascader
                    options={goods}
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
              <Col className='gutter-row' span={6}>
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
              <Col className='gutter-row' span={6}>
                {getFieldDecorator('high', {
                  rules: [{ required: false, message: '请输入最大值!' }]
                })(
                  <InputNumber placeholder='请输入最大值' min={0} style={{ width: '100%' }} />
                )}
              </Col>
            }
          </Row>
          <Row gutter={10}>
            {
              (this.state.select === initials.conf.select.name) &&
              <Col className='gutter-row' span={12}>
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
              <Col className='gutter-row' span={12}>
                {getFieldDecorator('seller', {
                  rules: [{ required: false, message: '请输入卖家昵称!' }]
                })(
                  <Input
                    placeholder='请输入卖家昵称'
                  />
                )}
              </Col>
            }
          </Row>
          <Row gutter={10}>
            <Col className='gutter-row' span={4}>
              <Button type='primary' htmlType='submit' style={{ marginLeft: 16, marginTop: 10 }}>导出</Button>
            </Col>
          </Row>
        </Form>
      </div>
    )
  }
}

TradeFilter.propTypes = {
  form: PropTypes.object,
  options: PropTypes.object,
  tradeGoods: PropTypes.object,
  initials: PropTypes.object,
  onExport: PropTypes.func,
  handleCancel: PropTypes.func
}

const Filter = Form.create()(TradeFilter)

export default Filter
