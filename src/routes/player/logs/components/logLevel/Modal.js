import React, {Component} from 'react'
import PropTypes from 'prop-types'
import { Form, Input, Select, Button, Row, Col, Icon } from 'antd'
import _ from 'lodash'

const FormItem = Form.Item
const Option = Select.Option

class Modal extends Component {

  static propTypes = {
    clearLogsConfig: PropTypes.func,
    form: PropTypes.object,
    onUpdate: PropTypes.func,
    handleCancel: PropTypes.func,
    data: PropTypes.object,
    curd: PropTypes.object,
    products: PropTypes.array
  }

  state = {
    num: []
  }

  constructor(props) {
    super(props)
    this.uuid = 0
    this.isOpenTypes = [
    { label: '关闭', value: 'false' },
    { label: '开启', value: 'true' }
    ]
    this.levelTypes = [
      { label: 'ALL', value: '0' },
      { label: 'TRACE', value: '1' },
      { label: 'DEBUG', value: '20' },
      { label: 'INFO', value: '30' },
      { label: 'WARN', value: '40' },
      { label: 'ERROR', value: '50' }
    ]
  }

  handleSubmit = (e) => {
    e.preventDefault()
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        let items = {
          products: this.props.products,
          list: {
            isOpen: values.isOpen,
            loglevel: values.loglevel,
            nickname: values.nickname,
            moduleLogLevelList: []
          }
        }
        _.map(values.keys, (val, idx) => {
          let nameList = 'name-' + val
          let levelList = 'level-' + val
          items.list.moduleLogLevelList.push({name: values[nameList], level: values[levelList]})
        })
        this.props.onUpdate(items)
        this.props.handleCancel()
      }
    })
  }

  remove = (k) => {
    const { form } = this.props
    if (!form.getFieldValue('keys').length) { return }
    form.setFieldsValue({ keys: form.getFieldValue('keys').filter(key => key !== k) })
    if (!form.getFieldValue('keys').length) { this.uuid = 0 }
  }

  add = () => {
    this.uuid++
    const { form } = this.props
    const nextKeys = form.getFieldValue('keys').concat(this.uuid)
    form.setFieldsValue({ keys: nextKeys })
  }

  componentWillMount() {
    this.uuid = this.props.data.moduleLogLevelList.length
    let numbers = []
    for (let i = 0 ; i < this.props.data.moduleLogLevelList.length ; i++) {
      numbers.push(i + 1)
    }
    this.setState({
      num: numbers
    })
  }

  componentWillUnmount() {
    this.props.clearLogsConfig()
    this.uuid = 0
  }

  render() {
    const {getFieldDecorator, getFieldValue} = this.props.form

    const ColProps = {
      xs: 24,
      sm: 12,
      style: {
        marginBottom: 6
      }
    }
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 6 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 18 }
      }
    }
    const formItemLayoutWithOutLabel = {
      wrapperCol: {
        xs: {
          span: 24,
          offset: 0
        },
        sm: {
          span: 14,
          offset: 6
        }
      }
    }

    let openOptions = []
    _.map(this.isOpenTypes, (val, idx) => {
      openOptions.push(
        <Option key={val.value} value={val.value}>{val.label}</Option>
      )
    })
    let levelOptions = []
    _.map(this.levelTypes, (val, idx) => {
      levelOptions.push(
        <Option key={val.value} value={val.value}>{val.label}</Option>
      )
    })

    // 添加模块
    getFieldDecorator('keys', { initialValue: this.state.num })
    const keys = getFieldValue('keys')
    const formItems = keys.map((k, index) => {
      if (this.props.data.moduleLogLevelList
        && this.props.data.moduleLogLevelList.length > 0
        && k <= this.props.data.moduleLogLevelList.length
      ) {
        return (
          <Row key={k}>
            <Col span='10' offset={2}>
              <FormItem
                {...formItemLayout}
                label={'模块名称' + k}
                required={false}
              >
                {getFieldDecorator(`name-${k}`, {
                  validateTrigger: ['onChange', 'onBlur'],
                  initialValue: this.props.data.moduleLogLevelList[index].name,
                  rules: [{
                    required: true,
                    whitespace: true,
                    message: '请输入模块名称'
                  }]
                })(
                  <Input placeholder='请输入模块名称' style={{ width: '60%', marginRight: 8 }} />
                )}
              </FormItem>
            </Col>
            <Col span='12'>
              <FormItem
                {...formItemLayout}
                label={'log 等级' + k}
                required={false}
              >
                {getFieldDecorator(`level-${k}`, {
                  validateTrigger: ['onChange', 'onBlur'],
                  initialValue: this.props.data.moduleLogLevelList[index].level,
                  rules: [{
                    required: true,
                    message: '请选择log等级'
                  }]
                })(
                  <Select
                    style={{width: '70%'}}
                    placeholder='全局 log 等级'
                  >
                    {levelOptions}
                  </Select>
                )}
                <Icon
                  style={{marginLeft: '10px'}}
                  type='minus-circle-o'
                  onClick={() => this.remove(k)}
                />
              </FormItem>
            </Col>
          </Row>
        )
      }
      else {
        return (
          <Row key={k}>
            <Col span='10' offset={2}>
              <FormItem
                {...formItemLayout}
                label={'模块名称' + k}
                required={false}
              >
                {getFieldDecorator(`name-${k}`, {
                  validateTrigger: ['onChange', 'onBlur'],
                  rules: [{
                    required: true,
                    whitespace: true,
                    message: '请输入模块名称'
                  }]
                })(
                  <Input placeholder='请输入模块名称' style={{ width: '60%', marginRight: 8 }} />
                )}
              </FormItem>
            </Col>
            <Col span='12'>
              <FormItem
                {...formItemLayout}
                label={'log 等级' + k}
                required={false}
              >
                {getFieldDecorator(`level-${k}`, {
                  validateTrigger: ['onChange', 'onBlur'],
                  rules: [{
                    required: true,
                    message: '请选择log等级'
                  }]
                })(
                  <Select
                    style={{width: '70%'}}
                    placeholder='全局 log 等级'
                  >
                    {levelOptions}
                  </Select>
                )}
                <Icon
                  style={{marginLeft: '10px'}}
                  type='minus-circle-o'
                  onClick={() => this.remove(k)}
                />
              </FormItem>
            </Col>
          </Row>
        )
      }
    })

    return (
      <Form onSubmit={this.handleSubmit}>
        <Row gutter={40}>
          <Col {...ColProps} xl={{ span: 8 }} md={{ span: 8 }}>
            <FormItem
              label='玩家昵称 (没有昵称则视为全局)'
            >
              { getFieldDecorator('nickname', {
                rules: [{ required: false, message: '请输入玩家昵称' }],
                initialValue: this.props.data.nickname
              })(
                <Input placeholder='玩家昵称 (没有昵称则视为全局)' />
              )}
            </FormItem>
          </Col>
          <Col {...ColProps} xl={{ span: 8 }} md={{ span: 8 }}>
            <FormItem
              label='全局 log 等级'
            >
              { getFieldDecorator('loglevel', {
                rules: [{ required: true, message: '请选择全局 log 等级' }],
                initialValue: String(this.props.data.loglevel)
              })(
                <Select
                  placeholder='全局 log 等级'
                >
                  {levelOptions}
                </Select>
              )}
            </FormItem>
          </Col>
          <Col {...ColProps} xl={{ span: 8 }} md={{ span: 8 }}>
            <FormItem
              label='是否开启'
            >
              { getFieldDecorator('isOpen', {
                rules: [{ required: true, message: '请选择是否开启' }],
                initialValue: String(this.props.data.isOpen)
              })(
                <Select
                  placeholder='是否开启'
                >
                  {openOptions}
                </Select>
              )}
            </FormItem>
          </Col>
        </Row>
        {formItems}
        <FormItem {...formItemLayoutWithOutLabel}>
          <Button type='dashed' onClick={this.add} style={{ width: '60%' }}>
            <Icon type='plus' />添加新模块
          </Button>
        </FormItem>
        <FormItem>
          {
            _.has(this.props.curd, '30702') &&
            <Button type='primary' htmlType='submit' >提交</Button>
          }
        </FormItem>
      </Form>
    )
  }
}

const LogsConfigModal = Form.create()(Modal)

export default LogsConfigModal
