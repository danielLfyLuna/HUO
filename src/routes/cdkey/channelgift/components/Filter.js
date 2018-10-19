import React, {Component} from 'react'
import PropTypes from 'prop-types'
import { Form, Row, Col, Button, Cascader, Modal } from 'antd'
import _ from 'lodash'

import CDkeysModal from './Modal'

export class CDkeysFilter extends Component {

  state = {
    currentItem: {},
    visible: false
  }

  handleAdd = () => {
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
    // 校验并获取一组输入域的值与 Error，若 fieldNames 参数为空，则校验全部组件
    this.props.form.validateFields((err, fieldsValue) => {
      if (!err) {
        this.props.onSearch(fieldsValue)
      }
    })
  }

  onModalLoad = () => {
    return this.state
  }

  render() {
    const { form: { getFieldDecorator }, options, curd } = this.props
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

    let proOptions = []
    _.map(options, (opt, index) => {
      proOptions.push({value: opt.value, label: opt.label})
    })

    return (
      <div>
        <Form
          className='ant-advanced-search-form'
          onSubmit={this.handleSearch}
        >
          <Row gutter={20}>
            <Col {...ColProps} xl={{ span: 5 }} md={{ span: 6 }}>
              {getFieldDecorator('products', {
                rules: [{ required: true, message: '请选择产品(必选)' }]
              })(
                <Cascader
                  showSearch
                  options={proOptions}
                  placeholder='请选择产品(必选)'
                />
              )}
            </Col>
            <Col {...TwoColProps} xl={{ span: 4 }} md={{ span: 24 }} sm={{ span: 24 }}>
              <Button.Group>
                {
                  _.has(curd, '60301')
                  ?
                    <Button type='primary' className='margin-right' htmlType='submit'>查询</Button>
                  :
                    ''
                }
                {
                  _.has(curd, '60302')
                  ?
                    <Button type='primary' onClick={this.handleAdd}>添加</Button>
                  :
                    ''
                }
              </Button.Group>
            </Col>
          </Row>
        </Form>

        <Modal
          width={700}
          key={Math.random()}
          title='新渠道兑换码礼包对应cdkey'
          visible={this.state.visible}
          onCancel={this.handleCancel}
          footer={null}
        >
          <CDkeysModal
            proOptions={proOptions}
            onModalLoad={this.onModalLoad}
            onCreate={this.props.onCreate}
            onSubmitting={this.handleCancel}
          />
        </Modal>
      </div>
    )
  }
}

CDkeysFilter.propTypes = {
  curd: PropTypes.object.isRequired,
  options: PropTypes.array,
  form: PropTypes.object,
  onCreate: PropTypes.func,
  onSearch: PropTypes.func
}

const Filter = Form.create()(CDkeysFilter)

export default Filter
