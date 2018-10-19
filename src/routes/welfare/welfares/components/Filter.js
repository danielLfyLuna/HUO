import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Form, Row, Col, Button, Modal } from 'antd'

import SyncForms from './Synch'
import Imports from './Import'
import Forms from './Forms'

class PlayerFilter extends Component {

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
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        this.props.onSearch({ handle: 'SEARCH' })
      }
    })
  }

  handleReback = () => {
    this.context.router.push('/welfare/groups')
  }

  handleCreate = () => {
    this.setState({
      modalType: 'create',
      modalTitle: '添加托管玩家',
      visible: true
    })
  }

  handleSynch = () => {
    this.setState({
      modalType: 'synch',
      modalTitle: '同步奖励内容',
      visible: true
    })
  }

  handleImport = () => {
    this.setState({
      modalType: 'imports',
      modalTitle: '批量导入玩家',
      visible: true
    })
    if (this.formRef.imports) {
      this.formRef.imports.setState({
        fileList: [],
        uploading: false
      })
    }
  }

  handleCancel = (e) => {
    this.setState({
      modalType: '',
      modalTitle: '',
      visible: false
    })
  }

  onModalLoad = () => {
    return this.state
  }

  onClose = () => {
    const type = this.formKey
    if (type) {
      this.formRef[type].props.form.resetFields()
    }
  }

  formRefs = ({inst, type}) => {
    if (inst && type) {
      this.formRef[type] = inst
      this.formKey = type
    }
  }

  render() {
    const { options } = this.props
    const { modalType, modalTitle, visible } = this.state

    return (
      <div>
        <Form layout='inline' onSubmit={this.handleSearch}>
          <Row gutter={20} style={{ marginBottom: 8 }}>
            {
              options.authorize.includes(150103) &&
              <Col className='gutter-row' span={2}>
                <Button type='primary' htmlType='submit'>查询</Button>
              </Col>
            }
            {
              options.authorize.includes(150103) &&
              <Col className='gutter-row' span={3}>
                <Button type='ghost' onClick={this.handleReback}>返回</Button>
              </Col>
            }
            {
              options.authorize.includes(150109) &&
              <Col className='gutter-row' span={2}>
                <Button type='ghost' onClick={this.handleSynch}>同步奖励</Button>
              </Col>
            }
            {
              options.authorize.includes(150106) &&
              <Col className='gutter-row' span={2}>
                <Button type='ghost' onClick={this.handleImport}>导入玩家</Button>
              </Col>
            }
            {
              options.authorize.includes(150104) &&
              <Col className='gutter-row' span={2}>
                <Button type='ghost' onClick={this.handleCreate}>添加玩家</Button>
              </Col>
            }
          </Row>
        </Form>

        <Modal
          width={800}
          key='welfares-synch'
          title={modalType === 'synch' && modalTitle}
          visible={modalType === 'synch' && visible}
          onCancel={this.handleCancel}
          footer={null}
          maskClosable={false}
        >
          <SyncForms
            options={this.props.options}
            onSearch={this.props.onSearch}
            onModalLoad={this.onModalLoad}
            onSubmitting={this.handleCancel}
          />
        </Modal>

        <Modal
          width={800}
          key='welfares-imports'
          title={modalType === 'imports' && modalTitle}
          visible={modalType === 'imports' && visible}
          onCancel={this.handleCancel}
          footer={null}
          maskClosable={false}
          afterClose={this.onClose}
        >
          <Imports
            wrappedComponentRef={(inst) => this.formRefs({ inst, type: modalType })}
            options={this.props.options}
            onImport={this.props.onImport}
            onSearch={this.props.onSearch}
            onModalLoad={this.onModalLoad}
            onSubmitting={this.handleCancel}
          />
        </Modal>

        <Modal
          width={800}
          key='welfares-player'
          title={modalType === 'create' && modalTitle}
          visible={modalType === 'create' && visible}
          onCancel={this.handleCancel}
          footer={null}
          maskClosable={false}
          afterClose={this.onClose}
        >
          <Forms
            wrappedComponentRef={(inst) => this.formRefs({ inst, type: modalType })}
            options={this.props.options}
            onCreate={this.props.onCreate}
            onSearch={this.props.onSearch}
            onModalLoad={this.onModalLoad}
            onSubmitting={this.handleCancel}
          />
        </Modal>
      </div>
    )
  }
}

PlayerFilter.propTypes = {
  form: PropTypes.object,
  options: PropTypes.object,
  onSearch: PropTypes.func,
  onImport: PropTypes.func,
  onCreate: PropTypes.func
}

PlayerFilter.contextTypes = {
  router: PropTypes.object
}

const Filter = Form.create()(PlayerFilter)

export default Filter
