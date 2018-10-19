import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Card, Form, Cascader, Switch, Tooltip, Icon, TreeSelect, Input, Button } from 'antd'
import _ from 'lodash'
import moment from 'moment'
// 推荐在入口文件全局设置 locale
import 'moment/locale/zh-cn'
moment.locale('zh-cn')


const FormItem = Form.Item

class NoticesPage extends Component {

  static propTypes = {
    login: PropTypes.object.isRequired,
    // mergeNotice: PropTypes.object,
    fetchRechargeReset: PropTypes.func,
    fetchProductsMap: PropTypes.func,
    products: PropTypes.object.isRequired,
    form: PropTypes.object
  }

  state = {
    switch: 1,
    sers: []
  }

  onSearch = (fieldsValue) => {
    this.props.fetchRechargeReset(fieldsValue)
  }

  handleReset = () => {
    this.props.form.resetFields()
  }

  handleSubmit = (e) => {
    e.preventDefault()
    this.props.form.validateFieldsAndScroll((err, fieldValues) => {
      if (!err) {
        let values = {}
        values.productId = fieldValues.productId[0]
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

    // const itemsLayout = {
    //   labelCol: {
    //     xs: { span: 24 },
    //     sm: { span: 4 }
    //   },
    //   wrapperCol: {
    //     xs: { span: 24 },
    //     sm: { span: 18 }
    //   }
    // }
    //
    // const tailFormItemLayout = {
    //   wrapperCol: {
    //     xs: {
    //       span: 24,
    //       offset: 0
    //     },
    //     sm: {
    //       span: 14,
    //       offset: 6
    //     }
    //   }
    // }

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
                onChange={e => this.onChange(e)}
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

          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <div>
              {
                _.has(curd, '140301') &&
                <Button type='primary' className='margin-right' htmlType='submit'>提交</Button>
              }
              <Button onClick={this.handleReset} style={{marginLeft: '20px'}}>清空表单内容</Button>
            </div>
          </div>
        </Form>
      </Card>
    )
  }

}

const Index = Form.create()(NoticesPage)

export default Index
