import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Form, Row, Col, Button, Cascader, Input, message } from 'antd'

import { welfareLogs } from './AsExcel'

class LogsFilter extends Component {

  constructor(props) {
    super(props)

    this.state = {
      currentItem: {},
      modalType: '',
      modalTitle: '',
      visible: false
    }
    this.formRef = {}
    this.formKey = ''
  }

  handleSearch = (e) => {
    e.preventDefault()
    const { location } = this.props.options
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        let data = {
          path: {},
          params: {}
        }
        data.path.productId = values.products[0]
        data.path.serverId = values.products[1]
        if (location.query.groupId) data.params.groupId = location.query.groupId
          else if (values.groupId) data.params.groupId = values.groupId
        if (values.playerId) data.params.playerId = values.playerId

        this.props.onSearch({
          ...data,
          handle: 'LOGS'
        })
      } else {
        Object.values(err).map(val => val.errors.map(v => message.warning(v.message, 3)))
      }
    })
  }

  handleExport = () => {
    const { welfare, location, purchases } = this.props.options
    welfareLogs(welfare.logs, {...location.query, purchases})
  }

  handleReback = () => {
    const { location } = this.props.options
    if (location.query.playerId) {
      this.context.router.push({
        pathname: '/welfare/welfares',
        query: {
          groupId: location.query.groupId
        }
      })
    } else {
      this.context.router.push('/welfare/groups')
    }
  }

  render() {
    const { options } = this.props
    const { form: { getFieldDecorator } } = this.props

    return (
      <div>
        <Form layout='inline' onSubmit={this.handleSearch}>
          <Row gutter={20} style={{ marginBottom: 8 }}>
            {
              options.authorize.includes(150201) &&
              !options.location.query.playerId &&
              <Col className='gutter-row' span={6}>
                {getFieldDecorator('products', {
                  rules: [{ type: 'array', required: true, message: '请选择产品/服务器!' }]
                })(
                  <Cascader
                    options={options.globals.products}
                    showSearch
                    placeholder='请选择产品/服务器'
                    expandTrigger='hover'
                  />
                )}
              </Col>
            }
            {
              options.authorize.includes(150201) &&
              !options.location.query.groupId &&
              <Col className='gutter-row' span={4}>
                {getFieldDecorator('groupId', {
                  rules: [{ required: false, message: '请填写分组 ID!' }]
                })(
                  <Input placeholder='请填写分组 ID' />
                )}
              </Col>
            }
            {
              options.authorize.includes(150201) &&
              !options.location.query.playerId &&
              <Col className='gutter-row' span={4}>
                {getFieldDecorator('playerId', {
                  rules: [{ required: false, message: '请填写玩家 ID!' }]
                })(
                  <Input placeholder='请填写玩家 ID' />
                )}
              </Col>
            }
            {
              options.authorize.includes(150201) &&
              !options.location.query.playerId &&
              <Col className='gutter-row' span={2}>
                <Button type='primary' htmlType='submit'>查询</Button>
              </Col>
            }
            {
              options.authorize.includes(150201) &&
              <Col className='gutter-row' span={2}>
                <Button type='primary' onClick={this.handleExport}>导出</Button>
              </Col>
            }
            {
              options.authorize.includes(150201) &&
              options.location.query.groupId &&
              <Col className='gutter-row' span={3}>
                <Button type='ghost' onClick={this.handleReback}>返回</Button>
              </Col>
            }
          </Row>
        </Form>
      </div>
    )
  }
}

LogsFilter.propTypes = {
  form: PropTypes.object,
  options: PropTypes.object,
  onSearch: PropTypes.func
}

LogsFilter.contextTypes = {
  router: PropTypes.object
}

const Filter = Form.create()(LogsFilter)

export default Filter
