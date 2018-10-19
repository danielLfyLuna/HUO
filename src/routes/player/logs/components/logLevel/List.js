import React, {Component} from 'react'
import PropTypes from 'prop-types'
import { Form, Row, Col, Input, Cascader, Button, Icon, Modal } from 'antd'
import _ from 'lodash'

import LogsConfigModule from './Modal'


class PlayerLogsPage extends Component {

  static propTypes = {
    clearLogsConfig: PropTypes.func,
    options: PropTypes.array,
    onSearch: PropTypes.func,
    onUpdate: PropTypes.func,
    form: PropTypes.object,
    data: PropTypes.object,
    curd: PropTypes.object,
    iniVisit: PropTypes.bool
  }

  state = {
    visible: false,
    products: []
  }

  handleCancel = (e) => {
    this.setState({
      visible: false
    })
  }

  handleSearch = (e) => {
    e.preventDefault()
    this.props.form.validateFields((err, fieldsValue) => {
      if (!err) {
        this.props.onSearch(fieldsValue)
        this.setState({
          products: fieldsValue.products
        })
      }
    })
  }

  componentWillReceiveProps(nextProps) {
    console.log(this.props.iniVisit)
    this.setState({
      visible: nextProps.iniVisit
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
      <div>
        <Form onSubmit={this.handleSearch}>
          <Row gutter={10}>
            <Col {...ColProps} xl={{ span: 6 }} md={{ span: 8 }}>
              {getFieldDecorator('products', {
                rules: [{
                  required: true, message: '必填!'
                }]
              })(
                <Cascader
                  placeholder='请选择产品与服务器(必选)'
                  options={this.props.options}
                  expandTrigger='hover'
                  showSearch
                />
              )}
            </Col>
            <Col {...ColProps} xl={{ span: 6 }} md={{ span: 6 }}>
              {getFieldDecorator('nickname', {
                rules: [{
                  required: true, message: '必填!'
                }]
              })(
                <Input
                  placeholder='请输入玩家昵称(必填)'
                />
              )}
            </Col>
            <Col {...TwoColProps} xl={{ span: 6 }} md={{ span: 6 }} sm={{ span: 12 }}>
              {
                _.has(this.props.curd, '30701') &&
                <Button type='primary' className='margin-right' htmlType='submit'><Icon type='search' />查询</Button>
              }
            </Col>
          </Row>
        </Form>

        <Modal
          width={700}
          key={Math.random()}
          title='按模块设置log等级'
          visible={this.state.visible}
          onCancel={this.handleCancel}
          footer={null}
          maskClosable={false}
        >
          <LogsConfigModule
            products={this.state.products}
            onUpdate={this.props.onUpdate}
            handleCancel={this.handleCancel}
            data={this.props.data}
            curd={this.props.curd}
            clearLogsConfig={this.props.clearLogsConfig}
          />
        </Modal>
      </div>
    )

  }
}

const logsConfig = Form.create()(PlayerLogsPage)

export default logsConfig
