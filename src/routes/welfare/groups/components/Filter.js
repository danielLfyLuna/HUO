import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Form, Row, Col, Button, Modal } from 'antd'

import GroupForms from './Group'
import SyncForms from './Synchs'

class GroupFilter extends Component {
  state = {
    currentItem: {},
    modalType: '',
    visible: false
  }

  handleSearch = (e) => {
    e.preventDefault()
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        this.props.onSearch({ handle: 'SEARCH' })
      }
    })
  }

  handleCreate = () => {
    this.setState({
      modalType: 'create',
      visible: true
    })
  }

  handleRewardSync = () => {
    this.setState({
      modalType: 'reward_sync',
      visible: true
    })
  }

  handleCancel = (e) => {
    this.setState({
      modalType: '',
      visible: false
    })
  }

  onModalLoad = () => {
    return this.state
  }

  onClose = () => {
    this.form.resetFields()
  }

  saveFormRef = (form) => {
    this.form = form
  }

  render() {
    const { options } = this.props
    const { modalType, visible } = this.state

    return (
      <div>
        <Form layout='inline' onSubmit={this.handleSearch}>
          <Row gutter={20} style={{ marginBottom: 6 }}>
            {
              options.authorize.includes(150103) &&
              <Col className='gutter-row' span={2}>
                <Button type='primary' htmlType='submit'>查询</Button>
              </Col>
            }
            {
              options.authorize.includes(150101) &&
              <Col className='gutter-row' span={2}>
                <Button type='ghost' onClick={this.handleCreate}>添加分组</Button>
              </Col>
            }
            {
              options.authorize.includes(150109) &&
              <Col className='gutter-row' span={2}>
                <Button type='ghost' onClick={this.handleRewardSync}>同步奖励</Button>
              </Col>
            }
          </Row>
        </Form>

        <Modal
          width={800}
          key='create-group'
          title='添加福利分组'
          visible={modalType === 'create' && visible}
          onCancel={this.handleCancel}
          footer={null}
          maskClosable={false}
          afterClose={this.onClose}
        >
          <GroupForms
            ref={this.saveFormRef}
            options={this.props.options}
            initials={this.props.initials}
            onCreate={this.props.onCreate}
            onModalLoad={this.onModalLoad}
            onSubmitting={this.handleCancel}
          />
        </Modal>

        <Modal
          width={800}
          key='reward-sync'
          title='同步奖励内容'
          visible={modalType === 'reward_sync' && visible}
          onCancel={this.handleCancel}
          footer={null}
          maskClosable={false}
        >
          <SyncForms
            options={this.props.options}
            initials={this.props.initials}
            onSearch={this.props.onSearch}
            onModalLoad={this.onModalLoad}
            onSubmitting={this.handleCancel}
          />
        </Modal>
      </div>
    )
  }
}

GroupFilter.propTypes = {
  form: PropTypes.object,
  options: PropTypes.object,
  initials: PropTypes.object,
  onCreate: PropTypes.func,
  onSearch: PropTypes.func
}

GroupFilter.contextTypes = {
  router: PropTypes.object
}

const Filter = Form.create()(GroupFilter)

export default Filter
