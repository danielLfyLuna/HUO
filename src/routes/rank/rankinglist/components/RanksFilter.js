import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'
import { Form, Row, Col, Button, Cascader } from 'antd'

const EquipChildren = [
  {value: '101', label: '武器(101)'},
  {value: '102', label: '头饰(102)'},
  {value: '103', label: '衣服(103)'},
  {value: '104', label: '鞋子(104)'},
  {value: '105', label: '戒指(105)'},
  {value: '106', label: '玉佩(106)'}
]

const rankType = [
    {value: '1', label: '个人战力榜'},
    {value: '2', label: '个人战力榜(跨服)'},
    {value: '3', label: '个人等级榜'},
    {value: '4', label: '个人等级榜(跨服)'},
    {value: '5', label: '联盟势力榜'},
    {value: '6', label: '联盟势力榜(跨服)'},
    {
      value: '7',
      label: '装备积分榜',
      children: EquipChildren
    },
    {
      value: '8',
      label: '装备积分榜(跨服)',
      children: EquipChildren
    },
    {value: '9', label: '鲜花榜(跨服)'},
    {value: '11', label: '充值榜'},
    {value: '13', label: '坐骑榜'},
    {value: '14', label: '坐骑榜(跨服)'}
  ]

export class RanksFilter extends Component {

  handleSubmit = (e) => {
    e.preventDefault()
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        const productId = values.products[0]
        const serverId = values.products[1]
        const type1 = values.rankType[0]
        let params = {}
        if (values.rankType[1]) {
          params = {
            ...params,
            subType: values.rankType[1]
          }
        }
        this.props.onSearch(productId, serverId, type1, params)
      }
    })
  }

  render() {

    const { getFieldDecorator } = this.props.form
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
          onSubmit={this.handleSubmit}
        >
          <Row gutter={20}>
            <Col {...ColProps} xl={{ span: 5 }} md={{ span: 6 }}>
              {getFieldDecorator('products', {
                rules: [{ required: true, message: '请选择产品与服务器(必选)' }],
                initialValue: this.props.initial.products ? this.props.initial.products : []
              })(
                <Cascader
                  showSearch
                  options={this.props.options}
                  placeholder='请选择产品与服务器(必选)'
                  expandTrigger='hover'
                />
              )}
            </Col>
            <Col {...ColProps} xl={{ span: 5 }} md={{ span: 6 }}>
              {getFieldDecorator('rankType', {
                rules: [{ required: true, message: '请选择排行榜类型' }]
              })(
                <Cascader
                  options={rankType}
                  placeholder='请选择排行榜类型'
                  showSearch
                />
              )}
            </Col>
            <Col {...TwoColProps} xl={{ span: 3 }} md={{ span: 24 }} sm={{ span: 24 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <div>
                  <Button type='primary' className='margin-right' htmlType='submit'>查询</Button>
                </div>
              </div>
            </Col>
          </Row>
        </Form>
      </Fragment>
    )
  }
}

RanksFilter.propTypes = {
  options: PropTypes.array,
  initial: PropTypes.object,
  form: PropTypes.object,
  onSearch: PropTypes.func
}

const Filter = Form.create()(RanksFilter)

export default Filter
