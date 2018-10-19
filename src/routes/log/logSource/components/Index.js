import React, {Component} from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import _ from 'lodash'
import { Form, Card, Button, Cascader } from 'antd'
import { fetchLog } from '../modules/Module'
import { fetchProductsMap } from '../../../../base/modules/Products'

const FormItem = Form.Item

const mapDispatchtoProps = {
  fetchProductsMap,
  fetchLog
}
const mapStateToProps = (state) => ({
  login: state.islogin,
  logSource: state.logSource,
  products: state.products
})
@connect(mapStateToProps, mapDispatchtoProps)
export class SyncPage extends Component {

  static propTypes = {
    login: PropTypes.object.isRequired,
    form: PropTypes.object.isRequired,
    products: PropTypes.object.isRequired,
    logSource: PropTypes.object.isRequired,
    fetchProductsMap: PropTypes.func.isRequired,
    fetchLog: PropTypes.func.isRequired
  }

  onSubmit = (e) => {
    e.preventDefault()
    this.props.form.validateFields((err, fieldsValue) => {
      if (!err) {
        this.props.fetchLog({
          productId: fieldsValue.products[0],
          serverId: fieldsValue.products[1]
        })
      }
    })
  }

  componentWillMount() {
    this.props.fetchProductsMap()
  }

  render() {
    const { form: {getFieldDecorator}, login, products, logSource } = this.props

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
      <div>
        {
          _.has(login.curd, '50701') ?
            <Card title='同步日志来源' style={{marginBottom: 6}}>

              <Form onSubmit={this.onSubmit}>
                <FormItem
                  {...formItemLayout}
                  label='产品/服务器'
                    >
                  {getFieldDecorator('products', {
                        rules: [{ required: true, message: '必填!' }]
                      })(
                        <Cascader
                          showSearch
                          placeholder='请选择产品与服务器(必选)'
                          options={products.options}
                          expandTrigger='hover'
                        />
                      )}
                </FormItem>
                <FormItem {...tailFormItemLayout}>
                  <Button
                    type='primary'
                    htmlType='submit'
                    icon='sync'
                    loading={logSource.fetching}
                    size='large'
                  >
                    同步日志来源
                  </Button>
                </FormItem>
              </Form>
            </Card>
          :
            ''
        }
      </div>
    )
  }
}

const Sync = Form.create()(SyncPage)

export default Sync
