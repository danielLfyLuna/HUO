import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'
import { Form, Row, Col, Button, Modal } from 'antd'

import MenuModal from './Modal'

class MenuFilter extends Component {
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
              options.authRoutes.includes('fetch-menu') &&
              <Col className='gutter-row' span={2}>
                <Button type='primary' htmlType='submit' style={{ marginLeft: 16 }}>查询</Button>
              </Col>
            }
            {
              options.authRoutes.includes('create-menu') &&
              <Col className='gutter-row' span={2}>
                <Button type='ghost' onClick={this.handleCreate}>添加菜单</Button>
              </Col>
            }
          </Row>
        </Form>

        <Modal
          width={700}
          key='create-menu'
          title='添加菜单'
          visible={this.state.visible}
          onCancel={this.handleCancel}
          footer={null}
          maskClosable={false}
          destroyOnClose
        >
          <MenuModal
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

MenuFilter.propTypes = {
  form: PropTypes.object,
  options: PropTypes.object,
  initials: PropTypes.object,
  onCreate: PropTypes.func,
  onSearch: PropTypes.func
}

const Filter = Form.create()(MenuFilter)

export default Filter
