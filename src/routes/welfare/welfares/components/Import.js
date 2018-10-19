import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Form, Button, Input, Upload, Icon } from 'antd'

const FormItem = Form.Item

class PlayerImport extends Component {

  state = {
    groupId: '',
    fileList: [],
    uploading: false
  }

  componentWillMount() {
    const { location } = this.props.options

    this.setState({
      groupId: location.query.groupId
    })
  }

  handleSubmit = (e) => {
    e.preventDefault()
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        const data = new FormData()
        data.append('file', values.files.file)
        const posts = {
          form: data,
          path: {
            groupId: values.groupId
          }
        }
        this.props.onImport(posts)
        this.props.onSubmitting()
      }
    })
  }

  render() {
    const { form: { getFieldDecorator } } = this.props

    const detail = this.state

    const { uploading } = this.state
    const props = {
      action: '',
      onRemove: (file) => {
        this.setState(({ fileList }) => {
          const index = fileList.indexOf(file)
          const newFileList = fileList.slice()
          newFileList.splice(index, 1)
          return {
            fileList: newFileList
          }
        })
      },
      beforeUpload: (file) => {
        this.setState(({ fileList }) => ({
          fileList: [...fileList, file]
        }))
        return false
      },
      fileList: this.state.fileList
    }

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
        xs: { span: 24, offset: 0 },
        sm: { span: 14, offset: 6 }
      }
    }

    return (
      <Form onSubmit={this.handleSubmit} encType='multipart/form-data'>
        <FormItem
          {...formItemLayout}
          label='所属分组'
        >
          {getFieldDecorator('groupId', {
            initialValue: detail.groupId,
            rules: [{ required: true, message: '请填写所属分组!' }]
          })(
            <Input disabled placeholder='请填写所属分组' />
          )}
        </FormItem>

        <FormItem
          {...formItemLayout}
          label='选择文件'
        >
          {getFieldDecorator('files', {
            rules: [{ required: true, message: '请选择上传文件!' }]
          })(
            <Upload {...props}>
              <Button>
                <Icon type='upload' /> Select File
              </Button>
            </Upload>
          )}
        </FormItem>

        <FormItem {...tailFormItemLayout}>
          <Button type='primary' htmlType='submit' loading={uploading}>提交</Button>
        </FormItem>
      </Form>
    )
  }
}

PlayerImport.propTypes = {
  form: PropTypes.object,
  options: PropTypes.object,
  onImport: PropTypes.func,
  onSubmitting: PropTypes.func
}

const Imports = Form.create()(PlayerImport)

export default Imports
