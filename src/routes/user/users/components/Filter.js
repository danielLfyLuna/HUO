import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'
import { Form, Row, Col, Button, Modal } from 'antd'

import UserModal from './Modal'

class UserFilter extends Component {
  state = {
    currentItem: {},
    modalType: 'create',
    visible: false
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

  handleSearch = (e) => {
    e.preventDefault()
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        this.props.onSearch({
          handle: 'SEARCH'
        })
      }
    })
  }

  onModalLoad = () => {
    return this.state
  }

  render() {
    const { options } = this.props

    return (
      <Fragment>
        <Form onSubmit={this.handleSearch}>
          <Row gutter={10} style={{ marginBottom: 8 }}>
            {
              options.authRoutes.includes('fetch-user') &&
              <Col className='gutter-row' span={2}>
                <Button type='primary' htmlType='submit' style={{ marginLeft: 16 }}>查询</Button>
              </Col>
            }
            {
              options.authRoutes.includes('create-user') &&
              <Col className='gutter-row' span={2}>
                <Button type='ghost' onClick={this.handleCreate}>添加用户</Button>
              </Col>
            }
          </Row>
        </Form>

        <Modal
          width={700}
          key='create-user'
          title='添加管理台用户'
          visible={this.state.visible}
          onCancel={this.handleCancel}
          footer={null}
          maskClosable={false}
          destroyOnClose
        >
          <UserModal
            options={this.props.options}
            initials={this.props.initials}
            onCreate={this.props.onCreate}
            onModalLoad={this.onModalLoad}
            onSubmitting={this.handleCancel}
          />
        </Modal>
      </Fragment>
    )
  }
}

UserFilter.propTypes = {
  form: PropTypes.object,
  options: PropTypes.object,
  initials: PropTypes.object,
  onCreate: PropTypes.func,
  onSearch: PropTypes.func
}

const Filter = Form.create()(UserFilter)

export default Filter
