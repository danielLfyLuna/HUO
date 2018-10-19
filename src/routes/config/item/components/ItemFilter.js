import React, { Component } from 'react'
import { Form, Button, Modal, Row, Col } from 'antd'
import PropTypes from 'prop-types'


import BModal from './Modal'

class ItemFilter extends Component {

  state = {
    visible: false,
    currentItem: {},
    modalType: 'create'
  }

  handleSearch = (e) => {
    e.preventDefault()
    this.props.onSearch()
  }

  onModalLoad = () => {
    return this.state
  }

  showSyncModel = () => {
    this.setState({
      visible: true
    })
  }

  handleCancel = () => {
    this.setState({
      visible: false
    })
  }

  syncItem = (productId, serverId) => {
    this.props.handleSyncItem(productId, serverId)
    this.setState({
      visible: false
    })
  }

  render() {
    return (
      <div>
        <Form layout='inline' onSubmit={this.handleSearch}>
          <Row gutter={20} style={{ marginBottom: 6 }}>
            {
              <Col className='gutter-row' span={2}>
                <Button type='primary' htmlType='submit'>查询</Button>
              </Col>
            }
            {
              <Col className='gutter-row' span={2}>
                <Button type='danger' onClick={this.showSyncModel}>同步道具列表</Button>
              </Col>
            }
          </Row>

          <Modal
            width={700}
            key={Math.random()}
            title='同步道具'
            visible={this.state.visible}
            onCancel={this.handleCancel}
            footer={null}
            >
            <BModal
              products={this.props.products}
              handleSyncItem={this.syncItem}
            />
          </Modal>
        </Form>
      </div>
    )
  }
}

ItemFilter.propTypes = {
  onSearch: PropTypes.func,
  products: PropTypes.object.isRequired,
  handleSyncItem: PropTypes.func.isRequired
}

const Filter = Form.create()(ItemFilter)

export default Filter
