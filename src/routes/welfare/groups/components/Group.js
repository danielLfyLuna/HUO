import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Form, Input, Button, Cascader, DatePicker, TimePicker, Switch, Icon } from 'antd'
import moment from 'moment'

const FormItem = Form.Item
const { RangePicker } = DatePicker

class GroupForm extends Component {
  state = {
    currentItem: {},
    modalType: '',
    select: true,
    runDays: [],
    runDay: false
  }

  componentWillMount() {
    const { currentItem, modalType } = this.props.onModalLoad()

    this.setState({
      currentItem: currentItem,
      modalType: modalType
    })
    if (modalType === 'update') {
      this.handleChange([currentItem.groupType])
    }
  }

  handleSubmit = (e) => {
    e.preventDefault()
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        let data = {}
        if (values.groupId) data.groupId = values.groupId
        if (values.name) data.name = values.name
        if (values.types.length) data.groupType = values.types[0]
        if (values.days) data.runDay = values.days[0]
        if (values.runTime) data.runTime = values.runTime.format('HH:mm:ss')
        if (values.times.length) {
          data.startTime = values.times[0].format('YYYY-MM-DD HH:mm:ss')
          data.endTime = values.times[1].format('YYYY-MM-DD HH:mm:ss')
        }
        if (values.open) data.open = values.open ? 1 : 0

        let posts = {
          form: data,
          handle: this.state.modalType.toUpperCase()
        }

        if (['update'].includes(this.state.modalType)) {
          this.props.onUpdate(posts)
        } else {
          this.props.onCreate(posts)
        }
        this.props.onSubmitting()
      }
    })
  }

  handleChange = (value) => {
    const { initials } = this.props
    const [, ...runDays] = initials.map.runDays[value[0]].map((d, i) => ({ value: i, label: d }))
    if (value[0] == 7) {
      this.setState({
        runDay: true,
        runDays: runDays
      })
    } else if (value[0] == 30) {
      this.setState({
        runDay: true,
        runDays: runDays
      })
    } else if (value[0] == 1) {
      this.setState({
        runDay: false,
        runDays: []
      })
    }
  }

  render() {
    const { getFieldDecorator } = this.props.form
    const { initials } = this.props

    const detail = this.state.currentItem
    const modalType = this.state.modalType
    const check = ['update'].includes(modalType)

    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 6 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 12 }
      }
    }

    const tailFormItemLayout = {
      wrapperCol: {
        xs: { span: 24, offset: 0 },
        sm: { span: 14, offset: 6 }
      }
    }

    return (
      <Form onSubmit={this.handleSubmit}>
        {
          check &&
          <FormItem
            {...formItemLayout}
            label='ID'
          >
            {getFieldDecorator('groupId', {
              initialValue: detail.groupId || '',
              rules: [{ required: true, message: '请填写 ID!' }]
            })(
              <Input placeholder='请填写 ID' disabled={check} />
            )}
          </FormItem>
        }
        <FormItem
          {...formItemLayout}
          label='分组名称'
        >
          {getFieldDecorator('name', {
            initialValue: detail.name || '',
            rules: [{ required: true, message: '请填写分组名称!' }]
          })(
            <Input placeholder='请填写分组名称' />
          )}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label='分组类型'
        >
          {getFieldDecorator('types', {
            initialValue: detail.groupType ? [detail.groupType] : [],
            rules: [{ type: 'array', required: true, message: '请选择分组类型!' }]
          })(
            <Cascader
              options={initials.enum.groupTypes}
              showSearch
              expandTrigger='hover'
              onChange={this.handleChange}
              placeholder='请选择分组类型'
            />
          )}
        </FormItem>
        {
          this.state.runDay &&
          <FormItem
            {...formItemLayout}
            label='执行日期'
          >
            {getFieldDecorator('days', {
              initialValue: detail.runDay ? [detail.runDay] : [],
              rules: [{ type: 'array', required: true, message: '请选择执行日期!' }]
            })(
              <Cascader
                options={this.state.runDays}
                showSearch
                expandTrigger='hover'
                placeholder='请选择执行日期'
              />
            )}
          </FormItem>
        }
        <FormItem
          {...formItemLayout}
          label='执行时间'
        >
          {getFieldDecorator('runTime', {
            initialValue: detail.runTime ? moment(detail.runTime, 'HH:mm:ss') : null,
            rules: [{ required: true, message: '请选择执行执行时间!' }]
          })(
            <TimePicker
              defaultOpenValue={moment('00:00:00', 'HH:mm:ss')}
              placeholder='请选择执行执行时间'
              style={{ width: '100%' }}
            />
          )}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label='开始时间 & 结束时间'
        >
          {getFieldDecorator('times', {
            initialValue: detail.startTime ? [moment(detail.startTime), moment(detail.endTime)] : [],
            rules: [{ required: true, message: '请选择开始时间和结束时间' }]
          })(
            <RangePicker
              showTime
              format='YYYY-MM-DD HH:mm:ss'
              placeholder={['请选择开始时间', '请选择结束时间']}
              style={{ width: '100%' }}
            />
          )}
        </FormItem>
        {
          check &&
          <FormItem
            {...formItemLayout}
            label='开关'
          >
            {getFieldDecorator('open', {
              initialValue: detail.open || false,
              rules: [{ required: true, message: '请选择开关!' }]
            })(
              <Switch
                checkedChildren={<Icon type='check' />}
                unCheckedChildren={<Icon type='cross' />}
                defaultChecked={detail.open === 1}
              />
            )}
          </FormItem>
        }
        <FormItem {...tailFormItemLayout}>
          <Button type='primary' htmlType='submit'>提交</Button>
        </FormItem>
      </Form>
    )
  }
}

GroupForm.propTypes = {
  form: PropTypes.object,
  initials: PropTypes.object,
  onCreate: PropTypes.func,
  onUpdate: PropTypes.func,
  onModalLoad: PropTypes.func,
  onSubmitting: PropTypes.func
}

const GroupForms = Form.create()(GroupForm)

export default GroupForms
