import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'
import _ from 'lodash'
import { Form, Row, Col, Button, Input, Modal, Cascader, Icon, DatePicker, TreeSelect, message } from 'antd'
import moment from 'moment'
import 'moment/locale/zh-cn'
moment.locale('zh-cn')

import ExportContainer from '../containers/ExportContainer'

const RangePicker = DatePicker.RangePicker

export class LogConsumesFilter extends Component {

  static propTypes = {
    curd: PropTypes.array.isRequired,
    onRender: PropTypes.func,
    onSubmit: PropTypes.func,
    consume: PropTypes.object,
    initial: PropTypes.object,
    options: PropTypes.array,
    form: PropTypes.object,
    onSearch: PropTypes.func,
    item: PropTypes.object,
    getItems: PropTypes.func,
    consumeSources: PropTypes.func
  }

  state = {
    visible: false
  }

  handleExportLogConsumes = () => {
    this.setState({
      visible: true
    })
  }

  handleCancel = (e) => {
    this.setState({
      visible: false
    })
  }

  handleOk = (e) => {
    this.setState({
      visible: false
    })
  }

  handleSearch = (e) => {
    e.preventDefault()
    // 校验并获取一组输入域的值与 Error，若 fieldNames 参数为空，则校验全部组件
    this.props.form.validateFields((err, values) => {
      if (!err) {
        let params = {
          itemId: ''
        }
        if (values.products) {
          params.productId = values.products[0]
          params.serverId = values.products[1]
        }
        if (values.nickname) params.nickname = values.nickname
        if (values.playerId) params.playerId = values.playerId
        if (values.dates) {
          params.startTime = values.dates[0].format('YYYY-MM-DD HH:mm:ss')
          params.endTime = values.dates[1].format('YYYY-MM-DD HH:mm:ss')
        }
        if (values.items.length) {
          params.itemId += values.items.join(',')
        }
        if (values.skills.length) {
          params.itemId += values.skills.join(',')
        }
        if (values.roles.length) {
          params.itemId += values.roles.join(',')
        }
        if (values.consumeSource.length) params.consumeSource = values.consumeSource[0]

        this.props.onSearch({
          params: params
        })
      } else {
        Object.values(err).map(val => val.errors.map(v => message.warning(v.message, 3)))
      }
    })
  }

  // 道具下拉接口
  fetchItems = (fieldsValue) => {
    this.props.getItems(fieldsValue)
  }

  componentDidMount() {
    this.props.consumeSources()
    // 消耗来源
  }

  render() {
    const {curd} = this.props
    const {getFieldDecorator} = this.props.form

    let consumeSources = []
    for (let key in this.props.consume.consumeSources) {
      consumeSources.push({value: this.props.consume.consumeSources[key], label: `${key}(${this.props.consume.consumeSources[key]})`})
    }

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

    // 道具ID
    let itemOpt = []
    let skillOpt = []
    let roleOpt = []
    if (this.props.item.options[0]) {
      _.map(this.props.item.options[0], (value, key) => {
          itemOpt.push(
            {value: key, key: key, label: `${value}(${key})`}
          )
      })
    }
    if (this.props.item.options[4]) {
      _.map(this.props.item.options[4], (value, key) => {
          skillOpt.push(
            {value: key, key: key, label: `${value}(${key})`}
          )
      })
    }
    if (this.props.item.options[5]) {
      _.map(this.props.item.options[5], (value, key) => {
          roleOpt.push(
            {value: key, key: key, label: `${value}(${key})`}
          )
      })
    }

    return (
      <Fragment>
        <Form onSubmit={this.handleSearch} >
          <Row gutter={16}>
            {
              curd.includes('fetch-consumes') &&
              <Col {...ColProps} xl={{ span: 6 }} md={{ span: 4 }}>
                {getFieldDecorator('products', {
                  rules: [{ required: true, message: '请选择产品与服务器(必选)' }],
                  initialValue: this.props.initial.products ? this.props.initial.products : []
                })(
                  <Cascader
                    options={this.props.options}
                    placeholder='请选择产品与服务器(必选)'
                    onChange={this.fetchItems}
                    showSearch
                    expandTrigger='hover'
                  />
                )}
              </Col>
            }
            {
              curd.includes('fetch-consumes') &&
              <Col {...ColProps} xl={{ span: 4 }} md={{ span: 4 }}>
                {getFieldDecorator('nickname', {
                  rules: [{ required: false, message: '请输入玩家昵称' }],
                  initialValue: ''
                })(
                  <Input placeholder='玩家昵称' />
                )}
              </Col>
            }
            {
              <Col {...ColProps} xl={{ span: 4 }} md={{ span: 4 }}>
                {getFieldDecorator('playerId', {
                  rules: [{ required: false, message: '请输入玩家ID' }],
                  initialValue: ''
                })(
                  <Input placeholder='玩家ID' />
                )}
              </Col>
            }
            {
              curd.includes('fetch-consumes') &&
              <Col {...ColProps} xl={{ span: 6 }} md={{ span: 6 }}>
                {getFieldDecorator('dates', {
                  rules: [{ type: 'array', required: true, message: '请选择起止日期' }]
                })(
                  <RangePicker
                    format='YYYY-MM-DD HH:mm:ss'
                  />
                )}
              </Col>
            }
            <Col {...ColProps} xl={{ span: 4 }} md={{ span: 4 }}>
              {getFieldDecorator('consumeSource', {
                rules: [{ required: false, message: '请输入消耗来源' }]
              })(
                <Cascader
                  options={consumeSources}
                  placeholder='消耗来源'
                  showSearch
                />
              )}
            </Col>
          </Row>
          {
            curd.includes('fetch-consumes') &&
            <Fragment>
              <Row gutter={16}>
                <Col {...ColProps} xl={{ span: 6 }} md={{ span: 6 }}>
                  {getFieldDecorator('items', {
                    rules: [{ required: false, message: '请选择道具(请先选择产品)' }]
                  })(
                    <TreeSelect
                      treeData={[{
                        label: '全选',
                        value: null,
                        key: '全选',
                        children: [...itemOpt]
                      }]}
                      showSearch
                      allowClear
                      treeDefaultExpandAll
                      multiple
                      treeCheckable
                      treeNodeFilterProp='label'
                      showCheckedStrategy={TreeSelect.SHOW_CHILD}
                      searchPlaceholder='道具列表(请先选择产品)'
                      dropdownStyle={{height: 300}}
                    />
                  )}
                </Col>
                <Col {...ColProps} xl={{ span: 6 }} md={{ span: 6 }}>
                  {getFieldDecorator('skills', {
                    rules: [{ required: false, message: '请选择技能(请先选择产品)' }]
                  })(
                    <TreeSelect
                      treeData={[{
                        label: '全选',
                        value: null,
                        key: '全选',
                        children: [...skillOpt]
                      }]}
                      showSearch
                      allowClear
                      treeDefaultExpandAll
                      multiple
                      treeCheckable
                      treeNodeFilterProp='label'
                      showCheckedStrategy={TreeSelect.SHOW_CHILD}
                      searchPlaceholder='技能列表(请先选择产品)'
                      dropdownStyle={{height: 300}}
                    />
                  )}
                </Col>
                <Col {...ColProps} xl={{ span: 6 }} md={{ span: 6 }}>
                  {getFieldDecorator('roles', {
                    rules: [{ required: false, message: '请选择角色(请先选择产品)' }]
                  })(
                    <TreeSelect
                      treeData={[{
                        label: '全选',
                        value: null,
                        key: '全选',
                        children: [...roleOpt]
                      }]}
                      showSearch
                      allowClear
                      treeDefaultExpandAll
                      multiple
                      treeCheckable
                      treeNodeFilterProp='label'
                      showCheckedStrategy={TreeSelect.SHOW_CHILD}
                      searchPlaceholder='角色列表(请先选择产品)'
                      dropdownStyle={{height: 300}}
                    />
                  )}
                </Col>
                <Col {...TwoColProps} xl={{ span: 4 }} md={{ span: 4 }} sm={{ span: 4 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    {
                      curd.includes('fetch-consumes') &&
                      <Button type='primary' className='margin-right' htmlType='submit'><Icon type='search' />查询</Button>
                    }
                    {
                      curd.includes('export-consumes') &&
                      <Button type='ghost' onClick={this.handleExportLogConsumes}><Icon type='edit' />导出</Button>
                    }
                  </div>
                </Col>

              </Row>
            </Fragment>
          }
        </Form>

        <Modal
          width={900}
          key='consumes-export'
          title='导出行为'
          visible={this.state.visible}
          onCancel={this.handleCancel}
          footer={null}
          maskClosable={false}
          destroyOnClose
        >
          <ExportContainer
            options={this.props.options}
            consume={this.props.consume}
            onSubmit={this.props.onSubmit}
            onCreate={this.handleOk}
            onRender={this.props.onRender}
          />
        </Modal>
      </Fragment>
    )
  }
}

const Filter = Form.create({
  // 当 Form.Item 子节点的值发生改变时触发，可以把对应的值转存到 Redux store
  onFieldsChange(props, changedFields) {
    props.onChange(changedFields)
  },
  // 把 props 转为对应的值，可用于把 Redux store 中的值读出 {...this.state.fields}
  mapPropsToFields(props) {
    return {
      products: Form.createFormField({
        ...props.products,
        value: props.products.value
      }),
      nickname: Form.createFormField({
        ...props.nickname,
        value: props.nickname.value
      }),
      playerId: Form.createFormField({
        ...props.playerId,
        value: props.playerId.value
      }),
      dates: Form.createFormField({
        ...props.dates,
        value: props.dates.value
      }),
      items: Form.createFormField({
        ...props.items,
        value: props.items.value
      }),
      skills: Form.createFormField({
        ...props.skills,
        value: props.skills.value
      }),
      roles: Form.createFormField({
        ...props.roles,
        value: props.roles.value
      }),
      consumeSource: Form.createFormField({
        ...props.consumeSource,
        value: props.consumeSource.value
      })
    }
  },
  // 任一表单域的值发生改变时的回调
  onValuesChange(_, values) {
    // console.log('Form.create.onValuesChange', values)
  }
})(LogConsumesFilter)

export default Filter
