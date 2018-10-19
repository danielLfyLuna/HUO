import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Card, Form, Cascader, Switch, Tooltip, Icon, TreeSelect, Input, DatePicker, Button } from 'antd'
import _ from 'lodash'
import moment from 'moment'
import 'moment/locale/zh-cn'
moment.locale('zh-cn')


const { RangePicker } = DatePicker
const FormItem = Form.Item
const { TextArea } = Input

class NoticesPage extends Component {

  static propTypes = {
    login: PropTypes.object.isRequired,
    // mergeNotice: PropTypes.object,
    fetchMergeNotice: PropTypes.func,
    fetchProductsMap: PropTypes.func,
    products: PropTypes.object.isRequired,
    form: PropTypes.object
  }

  state = {
    switch: 1,
    sers: []
  }

  onSearch = (fieldsValue) => {
    this.props.fetchMergeNotice(fieldsValue)
  }

  handleReset = () => {
    this.props.form.resetFields()
  }

  handleSubmit = (e) => {
    e.preventDefault()
    this.props.form.validateFieldsAndScroll((err, fieldValues) => {
      if (!err) {
        let values = {
          productId: fieldValues.productId[0],
          serverInfo: fieldValues.serverInfo,
          startTime: fieldValues.times[0].valueOf(),
          endTime: fieldValues.times[1].valueOf()
        }
        fieldValues.switch ? (values.serverIdList = fieldValues.servers) : (values.serverIds = fieldValues.serverBlock)
        this.onSearch(values)
      }
    })
  }

  onSwitch = (e) => {
    this.setState({
      switch: (e ? 1 : 2)
    })
  }

  onChange = (e) => {
    _.forEach(this.props.products.options, (v, k) => {
      v.value === e[0] &&
      this.setState({
        sers: v.children
      })
    })
  }

  componentWillMount() {
    this.props.fetchProductsMap()
  }

  render() {
    const {getFieldDecorator} = this.props.form
    const {login: {curd}} = this.props

    let options = []
    let proOptions = []
    if (this.props.products.options) {
      options = this.props.products.options
    }
    _.map(options, (v, k) => {
      proOptions.push({
        value: v.value,
        label: v.label
      })
    })

    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 6 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 14 }
      }
    }

    return (
      <Card style={{marginBottom: 6}}>
        <Form onSubmit={this.handleSubmit}>
          <FormItem label='产品' {...formItemLayout}>
            {getFieldDecorator('productId', {
              rules: [{ required: true, message: '请填写产品!' }]
            })(
              <Cascader
                showSearch
                options={proOptions}
                placeholder='请选择产品(必选)'
                expandTrigger='hover'
                onChange={this.onChange}
              />
            )}
          </FormItem>

          <FormItem label='服务器选择方式' {...formItemLayout}>
            {getFieldDecorator('switch', {
              initialValue: this.state.switch === 1,
              valuePropName: 'checked'
            })(
              <Switch checkedChildren={'多选'} unCheckedChildren={'填写区间'} onChange={this.onSwitch} />
            )}
          </FormItem>

          {
            this.state.switch === 1 ?
              <FormItem {...formItemLayout} label='多选服务器'>
                { getFieldDecorator('servers', {
                  rules: [{ required: true, message: '请选择服务器(必选)' }]
                })(
                  <TreeSelect
                    treeData={[{
                      label: '全选',
                      value: null,
                      key: '全选',
                      children: this.state.sers
                    }]}
                    showSearch
                    allowClear
                    treeDefaultExpandAll
                    multiple
                    treeCheckable
                    treeNodeFilterProp='label'
                    showCheckedStrategy={TreeSelect.SHOW_CHILD}
                    searchPlaceholder='请选择服务器'
                    dropdownStyle={{height: 300}}
                  />
                )}
              </FormItem>
            :
              <FormItem
                {...formItemLayout}
                label={(
                  <span>
                    填写服务器&nbsp;
                    <Tooltip
                      title={
                        <div>连续区间用 (-) 分隔. <i style={{color: '#f11738'}}>例：app_001-app_100</i><p>多段区间用 (,) 分割. <i style={{color: '#f11738'}}>例：app_001-app_002,app_100-app_102</i></p></div>
                      }
                    >
                      <Icon type='question-circle-o' />
                    </Tooltip>
                  </span>
                )}
              >
                {getFieldDecorator('serverBlock', {
                  rules: [
                    { required: true, whitespace: true, message: '输入区间数值!' }
                  ]
                })(
                  <Input type='textarea' placeholder='输入区间数值' autosize={{ minRows: 2, maxRows: 8 }} />
                )}
              </FormItem>
          }

          <FormItem label='开始/结束时间' {...formItemLayout}>
            {getFieldDecorator('times', {
              rules: [{ required: true, message: '请选择起止日期' }],
              initialValue: [moment('00:00:00', 'HH:mm:ss'), moment('00:00:00', 'HH:mm:ss').subtract({days: -1})]
            })(
              <RangePicker
                showTime
                format='YYYY-MM-DD HH:mm:ss'
              />
            )}
          </FormItem>

          <FormItem
            {...formItemLayout}
            label={(
              <span>
                填写服合服区服&nbsp;
                <Tooltip
                  title={
                    <div>例：S1-S9;S10-S15;S16-S21</div>
                  }
                >
                  <Icon type='question-circle-o' />
                </Tooltip>
              </span>
            )}
          >
            {getFieldDecorator('serverInfo', {
              rules: [{ required: true, message: '请输入合服区服', whitespace: true }]
            })(
              <TextArea autosize={{ minRows: 2, maxRows: 8 }} />
            )}
          </FormItem>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <div>
              {
                _.has(curd, '90401') &&
                <Button type='primary' className='margin-right' htmlType='submit'>提交</Button>
              }
              <Button onClick={this.handleReset} style={{marginLeft: '20px'}}>重置</Button>
            </div>
          </div>
        </Form>
      </Card>
    )
  }

}

const Index = Form.create()(NoticesPage)

export default Index
