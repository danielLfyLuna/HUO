import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Form, Row, Col, Button, Modal, Cascader } from 'antd'
import _ from 'lodash'

import Modals from './Modal'


class MergeFilter extends Component {
  state = {
    visible: false,
    initialValue: []
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
        this.props.onSearch(values)
      }
    })
  }

  componentDidMount() {
    this.setState({
      initialValue: (this.props.merge.initial.length > 0 ? this.props.merge.initial : ['1'])
    })
    console.log('重新渲染： initialValue', this.state)
  }

  render() {
    const { getFieldDecorator } = this.props.form
    const { curd } = this.props

    let opts = []
    _.map(this.props.options, (val, idx) => {
      opts.push({
        value: val.value,
        label: val.label
      })
    })

    return (
      <div>
        <Form layout='inline' onSubmit={this.handleSearch}>
          <Row gutter={20} style={{ marginBottom: 6 }}>
            {
              _.has(curd, '20603') &&
              <Col className='gutter-row' span={5}>
                {getFieldDecorator('productId', {
                  rules: [{ required: true, message: '请选择产品' }],
                  initialValue: this.state.initialValue
                })(
                  <Cascader
                    popupClassName='cascaderPullMenu'
                    showSearch
                    options={opts}
                    placeholder='请选择产品(必选)'
                    expandTrigger='hover'
                  />
                )}
              </Col>
            }
            {
              _.has(curd, '20603') &&
              <Col className='gutter-row' span={2}>
                <Button type='primary' htmlType='submit'>查询</Button>
              </Col>
            }
            {
              _.has(curd, '20601') &&
              <Col className='gutter-row' span={2}>
                <Button type='ghost' onClick={this.handleCreate}>添加</Button>
              </Col>
            }
          </Row>
        </Form>

        <Modal
          width={1000}
          key={Math.random()}
          title='添加合服'
          visible={this.state.visible}
          onCancel={this.handleCancel}
          footer={null}
          maskClosable={false}
        >
          <Modals
            onCreate={this.props.onCreate}
            handleCancel={this.handleCancel}
            options={this.props.options}
            cellOptions={this.props.cellOptions}
          />
        </Modal>
      </div>
    )
  }
}

MergeFilter.propTypes = {
  curd: PropTypes.object.isRequired,
  options: PropTypes.array,
  cellOptions: PropTypes.array,
  form: PropTypes.object,
  merge: PropTypes.object,
  onCreate: PropTypes.func,
  onSearch: PropTypes.func
}

const Filter = Form.create()(MergeFilter)

export default Filter
