import React, {Component} from 'react'
import PropTypes from 'prop-types'
import { Form, Cascader, Input, Button } from 'antd'

const FormItem = Form.Item

class PlayerLogsPage extends Component {

  static propTypes = {
    form: PropTypes.object,
    options: PropTypes.array,
    onTeam: PropTypes.func,
    handleCancel: PropTypes.func
  }
  handleSearch = (e) => {
    e.preventDefault()
    this.props.form.validateFields((err, fieldsValue) => {
      if (!err) {
        let val = {
          products: fieldsValue.products,
          list: {}
        }
        val.list.allianceId = fieldsValue.allianceId
        this.props.onTeam(val)
        this.props.handleCancel()
      }
    })
  }

  render() {
    const { getFieldDecorator } = this.props.form

    return (
      <div>
        <Form onSubmit={this.handleSearch}>
          <FormItem label='产品/服务器'>
            {getFieldDecorator('products', {
              rules: [{
                required: true, message: '必填!'
              }]
            })(
              <Cascader
                placeholder='请选择产品与服务器(必选)'
                options={this.props.options}
                expandTrigger='hover'
                showSearch
              />
            )}
          </FormItem>
          <FormItem label='联盟ID'>
            {getFieldDecorator('allianceId', {
              rules: [{
                required: true, message: '必填!'
              }]
            })(
              <Input
                placeholder='请输入联盟ID(必填)'
              />
            )}
          </FormItem>
          <FormItem>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <div>
                <Button type='primary' className='margin-right' htmlType='submit'>提交</Button>
              </div>
            </div>
          </FormItem>
        </Form>
      </div>
    )

  }
}

const logsConfig = Form.create()(PlayerLogsPage)

export default logsConfig
