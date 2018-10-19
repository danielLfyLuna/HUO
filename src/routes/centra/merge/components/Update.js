import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Form, Button, Cascader, TreeSelect, Tooltip, Icon, Row, Col } from 'antd'
import _ from 'lodash'

const FormItem = Form.Item


class MergeUpdate extends Component {
  static propTypes = {
    form: PropTypes.object,
    data: PropTypes.object,
    cellOptions: PropTypes.array,
    onUpdate: PropTypes.func,
    handleCancel: PropTypes.func
  }

  state = {
    serNum: []   // 计算节点组长度
  }
  constructor(props) {
    super(props)
    this.initialNum = this.props.data.mergeList.length
  }

  handleSubmit = (e) => {
    e.preventDefault()
    this.props.form.validateFieldsAndScroll((err, fieldsValue) => {
      if (!err) {
        let values = {
          productId: fieldsValue.productId[0],
          id: this.props.data.id,
          mergeList: []
        }
        _.map(this.state.serNum, (v, k) => {
          let items = {}
          items.master = fieldsValue[`master-${v}`][0]
          items.slaves = fieldsValue[`slaves-${v}`]
          values.mergeList.push(items)
        })

        this.props.onUpdate(values)
        this.props.handleCancel()
      }
    })
  }

  // 节点组的添加删除
  add = () => {
    if (this.state.serNum.length >= 4) return
    this.initialNum++
    let intermediate = this.state.serNum
    intermediate.push(this.initialNum)

    this.setState({
      serNum: intermediate
    })
  }

  remove = (v) => {
    let intermediate = _.filter(this.state.serNum, k => k !== v)

    this.setState({
      serNum: intermediate
    })
  }

  componentDidMount() {
    let arrays = []
    for (var i = 1; i <= this.initialNum; i++) {
      arrays.push(i)
    }
    this.setState({
      serNum: arrays
    })
  }

  componentWillUnmount() {
    this.setState({
      serNum: []
    })
    this.initialNum = this.props.data.mergeList.length
  }

  render() {
    const { form: { getFieldDecorator } } = this.props
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 8 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 12 }
      }
    }

    const tailFormItemLayout = {
      wrapperCol: {
        xs: { span: 24, offset: 0 },
        sm: { span: 14, offset: 8 }
      }
    }

    // 设置菜单联动
    let opts = []
    _.map(this.props.cellOptions, (val, idx) => {
      opts.push({
        value: val.value,
        label: val.label
      })
    })

    let masterOpts = []
    _.map(this.props.cellOptions, (val, idx) => {
      if (val.value == this.props.data.productId) {
        masterOpts = val.children
      }
    })

    // 遍历节点组
    let formItems = _.map(this.state.serNum, (v, idx) => {
      if (this.state.serNum.length <= this.props.data.mergeList.length && v <= this.props.data.mergeList.length) { return (
        <Row key={v} gutter={24} type='flex' align='middle'>
          <Col span={20}>
            <FormItem {...formItemLayout} label={`主节点${v}`}>
              {getFieldDecorator(`master-${v}`, {
                rules: [{ required: true, message: '请选择主节点' }],
                initialValue: [this.props.data.mergeList[v - 1].master]
              })(
                <Cascader
                  popupClassName='cascaderPullMenu'
                  showSearch
                  options={masterOpts}
                  placeholder='请选择主节点'
                  expandTrigger='hover'
                />
              )}
            </FormItem>

            <FormItem {...formItemLayout} label={`从节点${v}`}>
              {getFieldDecorator(`slaves-${v}`, {
                rules: [{ required: true, message: '请选择从节点' }],
                initialValue: this.props.data.mergeList[v - 1].slaves
              })(
                <TreeSelect
                  treeData={[{
                    label: '全选',
                    value: null,
                    key: '全选',
                    children: masterOpts
                  }]}
                  showSearch
                  allowClear
                  treeDefaultExpandAll
                  multiple
                  treeCheckable
                  treeNodeFilterProp='label'
                  showCheckedStrategy={TreeSelect.SHOW_CHILD}
                  style={{ maxHeight: 100, overflow: 'auto' }}
                  dropdownStyle={{ maxHeight: 300 }}
                  searchPlaceholder='请选择从节点'
                />
              )}
            </FormItem>
          </Col>
          <Col span={3}>
            <Icon
              className='dynamic-delete-button'
              type='minus-circle-o'
              style={{fontSize: '20px'}}
              onClick={() => this.remove(v)}
            />
          </Col>
        </Row>
      ) }
      else {
        return (
          <Row key={v} gutter={24} type='flex' align='middle'>
            <Col span={20}>
              <FormItem {...formItemLayout} label={`主节点${v}`}>
                {getFieldDecorator(`master-${v}`, {
                  rules: [{ required: true, message: '请选择主节点' }]
                })(
                  <Cascader
                    popupClassName='cascaderPullMenu'
                    showSearch
                    options={masterOpts}
                    placeholder='请选择主节点'
                    expandTrigger='hover'
                  />
                )}
              </FormItem>

              <FormItem {...formItemLayout} label={`从节点${v}`}>
                {getFieldDecorator(`slaves-${v}`, {
                  rules: [{ required: true, message: '请选择从节点' }]
                })(
                  <TreeSelect
                    treeData={[{
                      label: '全选',
                      value: null,
                      key: '全选',
                      children: masterOpts
                    }]}
                    showSearch
                    allowClear
                    treeDefaultExpandAll
                    multiple
                    treeCheckable
                    treeNodeFilterProp='label'
                    showCheckedStrategy={TreeSelect.SHOW_CHILD}
                    style={{ maxHeight: 100, overflow: 'auto' }}
                    dropdownStyle={{ maxHeight: 300 }}
                    searchPlaceholder='请选择从节点'
                  />
                )}
              </FormItem>
            </Col>
            <Col span={3}>
              <Icon
                className='dynamic-delete-button'
                type='minus-circle-o'
                style={{fontSize: '20px'}}
                onClick={() => this.remove(v)}
              />
            </Col>
          </Row>
        )
      }
    })

    return (
      <Form onSubmit={this.handleSubmit}>
        <FormItem
          {...formItemLayout}
          label={
            <div style={{display: 'inline'}}>
              请选择产品
              <Tooltip title='创建后产品不能修改,只能修改本产品下节点主从关系'>
                <Icon type='question-circle-o' />
              </Tooltip>
            </div>
          }
        >
          {getFieldDecorator('productId', {
            rules: [{ required: true, message: '请选择产品' }],
            initialValue: [this.props.data.productId]
          })(
            <Cascader
              disabled
              popupClassName='cascaderPullMenu'
              showSearch
              options={opts}
              placeholder='请先选择产品'
              expandTrigger='hover'
            />
          )}
        </FormItem>

        { formItems }

        <FormItem {...tailFormItemLayout}>
          <Button type='dashed' onClick={this.add} style={{ width: '60%' }}>
            <Icon type='plus' /> 添加
          </Button>
        </FormItem>

        <FormItem {...tailFormItemLayout}>
          <Button type='primary' htmlType='submit' disabled={this.state.serNum <= 0}>提交</Button>
        </FormItem>
      </Form>
    )
  }
}

const Update = Form.create()(MergeUpdate)

export default Update
