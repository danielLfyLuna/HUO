import React, {Component} from 'react'
import PropTypes from 'prop-types'
import { Form, Row, Col, Button, Cascader, Modal } from 'antd'
import _ from 'lodash'

import Add from './Add'
import Sync from './Sync'

class SENFilter extends Component {

  static propTypes = {
    form: PropTypes.object,
    curd: PropTypes.object,
    onSearch: PropTypes.func,
    onAdd: PropTypes.func,
    onSync: PropTypes.func,
    options: PropTypes.array
  }

  state = {
    visible: false,
    syncVis: false
  }

  handleVisible = (e) => {
    this.setState({
      visible: true
    })
  }

  handleCancel = (e) => {
    this.setState({
      visible: false
    })
  }

  handleSyncVis = (e) => {
    this.setState({
      syncVis: true
    })
  }

  handleSyncCancel = (e) => {
    this.setState({
      syncVis: false
    })
  }


  handleReset = () => {
    this.props.form.resetFields()
  }

  handleSearch = (e) => {
    e.preventDefault()
    this.props.form.validateFields((err, fieldsValue) => {
      if (!err) {
        let value = {
          productId: fieldsValue.products[0],
          serverId: fieldsValue.products[1]
        }
        this.props.onSearch(value)
      }
    })
  }

  render() {
    const { form: { getFieldDecorator }, curd } = this.props

    const ColProps = {
      xs: 24,
      sm: 8,
      style: {
        marginBottom: 6
      }
    }
    const TwoColProps = {
      ...ColProps,
      xl: 96
    }

    return (
      <div style={{ borderBottom: '1px solid #ddd', paddingBottom: '10px' }}>
        <Form
          className='ant-advanced-search-form'
          onSubmit={this.handleSearch}
        >
          <Row gutter={20}>
            <Col {...ColProps} >
              {getFieldDecorator('products', {
                rules: [{ required: true, message: '请选择产品/服务器' }]
              })(
                <Cascader
                  showSearch
                  options={this.props.options}
                  placeholder='请选择产品/服务器(必填)'
                  expandTrigger='hover'
                  popupClassName='cascaderMenu'
                />
              )}
            </Col>
            <Col {...TwoColProps} xl={{ span: 3 }} md={{ span: 24 }} sm={{ span: 24 }}>
              {
                _.has(curd, '80401') &&
                <Button type='primary' htmlType='submit'>查询</Button>
              }
            </Col>
            <Col {...TwoColProps} xl={{ span: 3 }} md={{ span: 24 }} sm={{ span: 24 }}>
              {
                _.has(curd, '80402') &&
                <Button type='danger' onClick={this.handleVisible} style={{marginLeft: '20px'}}>添加敏感词</Button>
              }
            </Col>
            <Col {...TwoColProps} xl={{ span: 3 }} md={{ span: 24 }} sm={{ span: 24 }}>
              {
                _.has(curd, '80403') &&
                <Button type='danger' onClick={this.handleSyncVis} style={{marginLeft: '20px'}}>同步</Button>
              }
            </Col>
          </Row>
        </Form>

        <Modal
          width={1000}
          key={Math.random()}
          wrapClassName='ModalLongName'
          maskClosable={false}
          title='添加敏感词'
          footer={null}
          visible={this.state.visible}
          onCancel={this.handleCancel}
        >
          <Add
            handleCancel={this.handleCancel}
            options={this.props.options}
            onAdd={this.props.onAdd}
          />
        </Modal>

        <Modal
          width={1000}
          key={Math.random()}
          wrapClassName='ModalLongName'
          maskClosable={false}
          title='同步'
          footer={null}
          visible={this.state.syncVis}
          onCancel={this.handleSyncCancel}
        >
          <Sync
            handleSyncCancel={this.handleSyncCancel}
            options={this.props.options}
            onSync={this.props.onSync}
          />
        </Modal>
      </div>
    )
  }
}

const Filter = Form.create()(SENFilter)

export default Filter
