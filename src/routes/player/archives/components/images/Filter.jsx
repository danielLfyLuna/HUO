import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'
import { Form, Row, Col, Button, Cascader, message } from 'antd'

export class ImageFilter extends Component {

  handleSearch = (e) => {
    e.preventDefault()
    // 校验并获取一组输入域的值与 Error，若 fieldNames 参数为空，则校验全部组件
    this.props.form.validateFields((err, values) => {
      if (err) {
        return Object.values(err).map(val => val.errors.map(v => message.warning(v.message, 3)))
      }

      const { dataType } = this.props

      this.props.onSearch({
        path: {
          productId: values.products[0],
          serverId: values.products[1],
        },
        handle: dataType.toUpperCase()
      })
    })
  }

  render() {
    const { form: { getFieldDecorator }, dataFlow: { options } } = this.props
    const { authRoutes } = options.login

    return (
      <Fragment>
        <Form layout='inline' onSubmit={this.handleSearch}>
          <Row gutter={20} style={{ marginBottom: 8 }}>
            {
              authRoutes &&
              <Col className='gutter-row' span={6}>
                {getFieldDecorator('products', {
                  rules: [{ type: 'array', required: true, message: '请选择产品与服务器!' }]
                })(
                  <Cascader
                    placeholder='请选择产品与服务器(必选)'
                    showSearch
                    expandTrigger='hover'
                    options={options.globals.products}
                  />
                )}
              </Col>
            }
            {
              authRoutes &&
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

ImageFilter.propTypes = {
  form: PropTypes.object,
  dataType: PropTypes.string,
  dataFlow: PropTypes.object,
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
    }
  },
  // 任一表单域的值发生改变时的回调
  onValuesChange(_, values) {}
})(ImageFilter)

export default Filter
