import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'
import { Form, Row, Col, Input, InputNumber, Button, Cascader } from 'antd'

export class OfflineFilter extends Component {

  handleSearch = (e) => {
    e.preventDefault()
    // 校验并获取一组输入域的值与 Error，若 fieldNames 参数为空，则校验全部组件
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.props.onSearch({
          path: {
            productId: values.products[0],
            serverId: values.products[1],
          },
          params: {
            nickname: values.nickname || '',
            playerId: values.playerId || '',
          },
          handle: 'SEARCH'
        })
      }
    })
  }

  render() {
    const { form: { getFieldDecorator }, options } = this.props
    const { authRoutes } = options.login

    return (
      <Fragment>
        <Form layout='inline' onSubmit={this.handleSearch}>
          <Row gutter={20} style={{ marginBottom: 8 }}>
            {
              authRoutes.includes('fetch-online') &&
              <Col className='gutter-row' span={6}>
                {getFieldDecorator('products', {
                  rules: [{ type: 'array', required: true, message: '请选择产品与服务器!' }]
                })(
                  <Cascader
                    placeholder='请选择产品与服务器(必选)'
                    showSearch
                    options={options.products.options}
                  />
                )}
              </Col>
            }
            {
              authRoutes.includes('fetch-online') &&
              <Col className='gutter-row' span={4}>
                {getFieldDecorator('nickname')(
                  <Input placeholder='玩家昵称' />
                )}
              </Col>
            }
            {
              authRoutes.includes('fetch-online') &&
              <Col className='gutter-row' span={4}>
                {getFieldDecorator('playerId')(
                  <InputNumber min={0} placeholder='玩家ID' style={{width: '100%'}} />
                )}
              </Col>
            }
            {
              authRoutes.includes('fetch-online') &&
              <Col className='gutter-row' span={2}>
                <Button type='primary' htmlType='submit'>查询</Button>
              </Col>
            }
          </Row>
        </Form>
      </Fragment>
    )
  }
}

OfflineFilter.propTypes = {
  form: PropTypes.object,
  options: PropTypes.object,
  onSearch: PropTypes.func,
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
      })
    }
  },
  // 任一表单域的值发生改变时的回调
  onValuesChange(_, values) {
    // console.log('Form.create.onValuesChange', values)
  }
})(OfflineFilter)

export default Filter
