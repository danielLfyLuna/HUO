import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'
import { Form, Row, Col, Button, Cascader, DatePicker, Input, Modal } from 'antd'

const { RangePicker } = DatePicker

class MailFilter extends Component {

  state = {
    currentItem: {},
    modalType: 'create',
    visible: false
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

  onModalLoad = () => {
    return this.state
  }

  handleSearch = (e) => {
    e.preventDefault()
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const { mailType } = this.props
        let params = {}
        if (values.products && values.products.length) {
          params = {
            ...params,
            productId: values.products[0],
            serverId: values.products[1] || ''
          }
        }
        if (values.nickName) {
          params = {
            ...params,
            nickName: values.nickName
          }
        }
        if (values.allianceName) {
          params = {
            ...params,
            allianceName: values.allianceName
          }
        }
        if (values.mailStatus && values.mailStatus.length) {
          params = {
            ...params,
            mailStatus: values.mailStatus[0]
          }
        }
        if (values.dates && values.dates.length) {
          params = {
            ...params,
            startDate: values.dates[0].format('YYYY-MM-DD'),
            endDate: values.dates[1].format('YYYY-MM-DD'),
          }
        }

        this.props.onSearch({
          params,
          handle: mailType.toUpperCase()
        })
      }
    })
  }

  render() {
    const { form: { getFieldDecorator }, options, initials, mailType } = this.props
    // const { authRoutes } = options.login

    const Mails = require(`./${mailType}/Mails`).default

    return (
      <Fragment>
        <Form
          className='ant-advanced-search-form'
          onSubmit={this.handleSearch}
        >
          <Row gutter={20} style={{ marginBottom: 6 }}>
            <Col className='gutter-row' span={6}>
              {getFieldDecorator('products', {
                rules: [{ type: 'array', message: '请选择产品与服务器!' }]
              })(
                <Cascader
                  placeholder='请选择产品与服务器(必选)'
                  showSearch
                  changeOnSelect
                  expandTrigger='hover'
                  options={options.products}
                />
              )}
            </Col>
            {
              mailType === 'personal' &&
              <Col className='gutter-row' span={4}>
                {getFieldDecorator('nickName')(
                  <Input placeholder='玩家昵称' />
                )}
              </Col>
            }
            {
              ['alliance', 'servers'].includes(mailType) &&
              <Col className='gutter-row' span={4}>
                {getFieldDecorator('allianceName')(
                  <Input placeholder='联盟名称' />
                )}
              </Col>
            }
            <Col className='gutter-row' span={4}>
              {getFieldDecorator('mailStatus', {
                rules: [{ type: 'array', required: false, message: '请选择邮件状态' }]
              })(
                <Cascader
                  showSearch
                  options={initials.enum.mailStatus}
                  placeholder='请选择查看某种状态的邮件'
                  expandTrigger='hover'
                />
              )}
            </Col>
            <Col className='gutter-row' span={6}>
              {getFieldDecorator('dates', {
                rules: [{ type: 'array', required: false, message: '请选择起止日期' }]
              })(
                <RangePicker
                  format='YYYY-MM-DD'
                />
              )}
            </Col>
          </Row>
          <Row gutter={20} style={{ marginBottom: 8 }}>
            <Col className='gutter-row' span={2}>
              <Button type='primary' htmlType='submit'>查询</Button>
            </Col>
            <Col className='gutter-row' span={2}>
              <Button type='danger' onClick={this.handleVisible}>写邮件</Button>
            </Col>
          </Row>
        </Form>

        <Modal
          width={1000}
          key='create-personal'
          title='新建邮件'
          visible={this.state.visible}
          onCancel={this.handleCancel}
          footer={null}
          maskClosable={false}
          destroyOnClose
        >
          <Mails
            options={options}
            initials={initials}
            mailType={mailType}
            onCreate={this.props.onCreate}
            onModalLoad={this.onModalLoad}
            onSubmitting={this.handleCancel}
          />
        </Modal>
      </Fragment>
    )
  }
}

MailFilter.propTypes = {
  form: PropTypes.object,
  options: PropTypes.object,
  initials: PropTypes.object,
  mailType: PropTypes.string,
  onSearch: PropTypes.func,
  onCreate: PropTypes.func
}

const Filter = Form.create()(MailFilter)

export default Filter
