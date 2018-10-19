import React, {Component} from 'react'
import PropTypes from 'prop-types'
import { Form, DatePicker, Button, Input, InputNumber } from 'antd'
import moment from 'moment'
import 'moment/locale/zh-cn'
moment.locale('zh-cn')

const RangePicker = DatePicker.RangePicker
const FormItem = Form.Item

class Filters extends Component {

  static propTypes = {
    form: PropTypes.object,
    data: PropTypes.object,
    setCD: PropTypes.func,
    onCancel: PropTypes.func
  }

  handleSearch = (e) => {
    e.preventDefault()
    this.props.form.validateFields((err, fieldsValue) => {
      if (!err) {
        let value = {
          id: fieldsValue.id,
          productId: fieldsValue.productId,
          list: {
            dayPeriod: fieldsValue.dayPeriod,
            startTime: fieldsValue.time[0].format('YYYY-MM-DD HH:mm:ss'),
            endTime: fieldsValue.time[1].format('YYYY-MM-DD HH:mm:ss')
          }
        }
        this.props.setCD(value)
        this.props.onCancel()
      }
    })
  }

  handleReset = () => {
    this.props.form.resetFields()
  }

  render() {
    const { form: { getFieldDecorator } } = this.props

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
    const tailFormItemLayout = {
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

    const rangeConfig = {
      rules: [{ type: 'array', required: true, message: '请选择起止日期' }],
      initialValue: [moment('00:00:00', 'HH:mm:ss'), moment('00:00:00', 'HH:mm:ss').subtract({days: -1})]
    }

    return (
      <div>
        <Form
          className='ant-advanced-search-form'
          onSubmit={this.handleSearch}
        >
          <FormItem
            label='id'
            {...formItemLayout}
          >
            {getFieldDecorator('id', {
              rules: [{ required: true, message: '请输入id' }],
              initialValue: this.props.data.id
            })(
              <Input disabled placeholder='id' />
            )}
          </FormItem>

          <FormItem
            label='产品ID'
            {...formItemLayout}
          >
            {getFieldDecorator('productId', {
              rules: [{ required: true, message: '请输入产品ID' }],
              initialValue: this.props.data.productId
            })(
              <Input disabled placeholder='产品ID' />
            )}
          </FormItem>

          <FormItem
            {...formItemLayout}
            label='起止时间'
          >
            {getFieldDecorator('time', rangeConfig)(
              <RangePicker showTime format='YYYY-MM-DD HH:mm:ss' />
            )}
          </FormItem>

          <FormItem
            label='时间周期'
            {...formItemLayout}
          >
            {getFieldDecorator('dayPeriod', {
              rules: [{ required: true, message: '请输入时间周期' }]
            })(
              <InputNumber placeholder='时间周期' />
            )}
          </FormItem>
          <FormItem {...tailFormItemLayout}>
            <Button type='primary' htmlType='submit' >提交</Button>
            <Button type='default' onClick={this.handleReset} style={{marginLeft: '10px'}}>重置</Button>
          </FormItem>
        </Form>
      </div>
    )
  }
}

const Filter = Form.create()(Filters)

export default Filter
