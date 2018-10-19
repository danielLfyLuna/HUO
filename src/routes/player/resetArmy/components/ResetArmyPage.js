import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import _ from 'lodash'
import {
  Card,
  Form,
  Input,
  Button,
  InputNumber,
  Cascader,
  Tooltip,
  Icon,
  Modal
} from 'antd'

import { resetArmyActionCreator, keepResetArmy } from './../modules/ResetArmyModules'
import { fetchProductsMap } from '../../../../base/modules/Products'

import Team from './Team'
const FormItem = Form.Item


const mapDispatchtoProps = {
  resetArmyActionCreator,
  fetchProductsMap,
  keepResetArmy
}
const mapStateToProps = (state) => ({
  login: state.islogin,
  products: state.products,
  resetArmy: state.resetArmy
})
@connect(mapStateToProps, mapDispatchtoProps)
class ResetArmyPage extends Component {
  static propTypes = {
    login: PropTypes.object.isRequired,
    form: PropTypes.object.isRequired,
    resetArmy: PropTypes.object.isRequired,
    resetArmyActionCreator: PropTypes.func.isRequired,
    products: PropTypes.object.isRequired,
    fetchProductsMap: PropTypes.func.isRequired,
    keepResetArmy: PropTypes.func.isRequired
  }

  state = {
    visible: false
  }

  onSearch = e => {
    e.preventDefault()
    this.props.form.validateFields((err, fieldsValue) => {
      if (!err) {
        let val = {
          products: fieldsValue.products,
          list: {}
        }
        val.list.coord = fieldsValue.coord
        val.list.playerId = fieldsValue.playerId
        val.list.num = fieldsValue.num
        this.props.resetArmyActionCreator(val)
      }
    })
  }

  onTeam = (val) => {
    this.props.resetArmyActionCreator(val)
  }

  handleClick = () => {
    this.setState({
      visible: true
    })
  }

  handleCancel = () => {
    this.setState({
      visible: false
    })
  }

  render() {
    const {
      login: { curd },
      form: { getFieldDecorator },
      products: { options },
      resetArmy: { keeping }
    } = this.props

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

    let product, server
    try {
      product = keeping['0']
      server = keeping['1']
    } catch (e) {
    } finally {
      console.log(_.size(keeping), product, server)
    }

    return (
      <Card>
        {_.has(curd, '30601') ? (
          <Form onSubmit={this.onSearch}>
            <FormItem {...formItemLayout} label='产品/服务器'>
              {getFieldDecorator('products', {
                initialValue:
                  _.size(keeping) > 0 ? [keeping[0], keeping[1]] : [],
                rules: [
                  {
                    required: true,
                    message: '必填!'
                  }
                ]
              })(
                <Cascader
                  placeholder='请选择产品与服务器(必选)'
                  options={options}
                  expandTrigger='hover'
                  showSearch
                />
              )}
            </FormItem>

            <FormItem {...formItemLayout} label='玩家ID'>
              {getFieldDecorator('playerId', {
                rules: [
                  {
                    required: true,
                    message: '必填!'
                  }
                ]
              })(<Input placeholder='玩家ID' />)}
            </FormItem>

            <FormItem
              {...formItemLayout}
              label={
                <span>
                  队伍编号&nbsp;
                  <Tooltip title='队伍编号*(1-5)'>
                    <Icon type='question-circle-o' />
                  </Tooltip>
                </span>
              }
            >
              {getFieldDecorator('num', {
                initialValue: 1,
                rules: [
                  {
                    required: true,
                    message: '必填!'
                  }
                ]
              })(<InputNumber min={1} max={5} placeholder='1-5' />)}
            </FormItem>

            <FormItem
              {...formItemLayout}
              label={
                <span>
                  坐标&nbsp;
                  <Tooltip title='格式: 767,680 坐标-1默认放入联盟主城'>
                    <Icon type='question-circle-o' />
                  </Tooltip>
                </span>
              }
            >
              {getFieldDecorator('coord', {
                rules: [
                  {
                    required: true,
                    message: '必填!'
                  }
                ]
              })(<Input placeholder='格式: 767,680 坐标-1默认放入联盟主城' />)}
            </FormItem>

            <FormItem {...tailFormItemLayout}>
              <Button type='primary' className='margin-right' htmlType='submit'>
                提交
              </Button>
              {
                false && <Button style={{ marginLeft: 10 }} onClick={this.handleClick}>重置联盟队伍</Button>
              }
            </FormItem>
          </Form>
        ) : (
          '无权限'
        )}
        <Modal
          width={600}
          maskClosable={false}
          title='重置联盟队伍'
          footer={null}
          visible={this.state.visible}
          onCancel={this.handleCancel}
        >
          <Team
            handleCancel={this.handleCancel}
            options={options}
            onTeam={this.onTeam}
          />
        </Modal>
      </Card>
    )
  }

  componentWillMount() {
    this.props.fetchProductsMap()
  }

  componentDidMount() {}

  componentWillUnmount() {
    const { form: { getFieldValue }, keepResetArmy } = this.props
    const products = getFieldValue('products')
    keepResetArmy(products)
  }
}

const WrappedForm = Form.create()(ResetArmyPage)

export default WrappedForm
