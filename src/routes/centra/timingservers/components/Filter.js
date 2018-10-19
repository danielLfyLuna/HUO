import React, { Component } from 'react'
import { Form, Button, Modal, Row, Col } from 'antd'
import PropTypes from 'prop-types'
import CModal from './CreateModal'
import _ from 'lodash'


class TimingServerFilter extends Component {

  state = {
    visible: false,
    currentItem: {},
    modalType: 'create'
  }

  handleSearch = (e) => {
    e.preventDefault()
    this.props.onSearch()
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

  render() {

    return (
      <div>
        <Form layout='inline' onSubmit={this.handleSearch}>
          <Row gutter={20} style={{ marginBottom: 6 }}>
            {
              _.has(this.props.login.curd, '20703') &&
              <Col className='gutter-row' span={2}>
                <Button type='primary' htmlType='submit'>查询</Button>
              </Col>
            }
            {
              _.has(this.props.login.curd, '20701') &&
              <Col className='gutter-row' span={2}>
                <Button type='ghost' onClick={this.handleCreate}>添加</Button>
              </Col>
            }
          </Row>
        </Form>

        <Modal
          width={700}
          key={Math.random()}
          title='添加定时开服'
          visible={this.state.visible}
          onCancel={this.handleCancel}
          footer={null}
        >
          <CModal
            initials={this.props.initials}
            onModalLoad={this.onModalLoad}
            options={this.props.options}
            onCreate={this.props.onCreate}
            onSubmitting={this.handleCancel}
            />
        </Modal>
      </div>
    )
  }
}

TimingServerFilter.propTypes = {
  onSearch: PropTypes.func,
  onCreate: PropTypes.func,
  options: PropTypes.array,
  initials: PropTypes.object,
  login: PropTypes.object
}

const Filter = Form.create()(TimingServerFilter)

export default Filter
