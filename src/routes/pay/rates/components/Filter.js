import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Form, Row, Col, Cascader, Button, Modal } from 'antd'

import CreateModal from './Modal'

class RateFilter extends Component {
  state = {
    select: true,
    visible: false
  }

  handleProductSelect = (products) => {
    if (products.length) {
      this.setState({
        select: false
      })
    } else {
      this.setState({
        select: true
      })
    }
  }

  handleCreate = () => {
    this.setState({
      visible: true
    })
  }

  handleCancel = (e) => {
    this.setState({
      visible: false
    })
  }

  onModalLoad = () => {
    return this.state
  }

  handleSearch = (e) => {
    e.preventDefault()
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        this.props.onSearch({
          path: {
            productId: values.products[0]
          },
          handle: 'SEARCH'
        })
      }
    })
  }

  render() {
    const { form: { getFieldDecorator }, options, initials } = this.props
    return (
      <div>
        <Form layout='inline' onSubmit={this.handleSearch}>
          <Row gutter={20} style={{ marginBottom: 6 }}>
            <Col className='gutter-row' span={5}>
              {getFieldDecorator('products', {
                initialValue: initials.products.productId ? [initials.products.productId] : [],
                rules: [{ type: 'array', required: true, message: '请选择产品!' }]
              })(
                <Cascader
                  options={options.products.list}
                  showSearch
                  onChange={this.handleProductSelect}
                  placeholder='请选择产品'
                  expandTrigger='hover'
                />
              )}
            </Col>
            <Col className='gutter-row' span={2}>
              <Button type='primary' htmlType='submit'>查询</Button>
            </Col>
            <Col className='gutter-row' span={2}>
              <Button type='ghost' onClick={this.handleCreate} disabled={this.state.select}>添加</Button>
            </Col>
          </Row>
        </Form>

        <Modal
          width={700}
          key={Math.random()}
          title='添加倍率'
          visible={this.state.visible}
          onCancel={this.handleCancel}
          footer={null}
          maskClosable={false}
        >
          <CreateModal
            options={this.props.options}
            initials={this.props.initials}
            onCreate={this.props.onCreate}
            onModalLoad={this.onModalLoad}
            onSubmitting={this.handleCancel}
          />
        </Modal>
      </div>
    )
  }
}

RateFilter.propTypes = {
  form: PropTypes.object,
  options: PropTypes.object,
  initials: PropTypes.object,
  onSearch: PropTypes.func,
  onCreate: PropTypes.func
}

const Filter = Form.create({
  onFieldsChange(props, changedFields) {
    props.onChange(changedFields)
  },
  mapPropsToFields(props) {
    return {
      products: props.products
    }
  },
  onValuesChange(_, values) {
  }
})(RateFilter)

export default Filter
