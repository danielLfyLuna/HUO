import React, {Component} from 'react'
import PropTypes from 'prop-types'
import _ from 'lodash'
import { Form, Cascader, Button, TreeSelect } from 'antd'

const FormItem = Form.Item


class SyncForm extends Component {

  static propTypes = {
    options: PropTypes.array,
    form: PropTypes.object,
    handleSyncCancel: PropTypes.func,
    onSync: PropTypes.func
  }

  state = {
    pro: ''
  }

  handleSubmit = (e) => {
    e.preventDefault()
    this.props.form.validateFieldsAndScroll((err, fieldValues) => {
      if (!err) {
        let value = {
          productId: fieldValues.products[0],
          serverId: fieldValues.products[1],
          target: {
            productId: fieldValues.targetPro[0],
            servers: fieldValues.targetSer[0]
          }
        }
        this.props.onSync(value)
        this.props.handleSyncCancel()
      }
    })
  }

  handleReset = () => {
    this.props.form.resetFields()
  }

  handleChange = (e) => {
    this.setState({
      pro: e[0]
    })
  }

  render() {
    const { getFieldDecorator } = this.props.form

    let pros = []
    _.map(this.props.options, (v, i) => {
      pros.push({
        value: v.value,
        label: v.label
      })
    })
    let sers = []
    _.forEach(this.props.options, (v, i) => {
      if (v.value === this.state.pro) {
        sers = v.children
      }
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

    return (
      <Form onSubmit={this.handleSubmit}>

        <FormItem
          {...formItemLayout}
          label='敏感词来源产品/服务器'
        >
          {getFieldDecorator('products', {
            rules: [{ required: true, message: '请选择产品/服务器' }]
          })(
            <Cascader
              showSearch
              options={this.props.options}
              placeholder='请选择产品/服务器'
              expandTrigger='hover'
            />
          )}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label='目标产品'
        >
          {getFieldDecorator('targetPro', {
            rules: [{ required: true, message: '请选择产品' }]
          })(
            <Cascader
              showSearch
              options={pros}
              placeholder='请选择产品'
              expandTrigger='hover'
              onChange={this.handleChange}
            />
          )}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label='目标服务器(多选)'
        >
          {getFieldDecorator('targetSer', {
            rules: [{ required: true, message: '请选择目标服务器' }]
          })(
            <TreeSelect
              treeData={[{
                label: '全选',
                value: null,
                key: '全选',
                children: [...sers]
              }]}
              showSearch
              allowClear
              treeDefaultExpandAll
              multiple
              treeCheckable
              treeNodeFilterProp='label'
              searchPlaceholder='请选择目标服务器'
              dropdownStyle={{height: 300}}
            />
          )}
        </FormItem>


        <FormItem {...tailFormItemLayout}>
          <Button type='primary' htmlType='submit' >提交</Button>
          <Button type='default' onClick={this.handleReset} style={{marginLeft: '10px'}}>重置</Button>
        </FormItem>

      </Form>
    )
  }
}

const Sync = Form.create()(SyncForm)

export default Sync
