import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { Tabs, Icon } from 'antd'

import { fetchProductsMap } from '../../../../base/modules/Products'
import { fetchGoodsMap } from '../../../../base/modules/Goods'
import {
  fetchPersonMails,
  createPersonMail,
  updatePersonMail,
  fetchPersonMail,
  fetchAllianceMails,
  createAllianceMail,
  updateAllianceMail,
  fetchAllianceMail,
  fetchServerMails,
  createServerMail,
  updateServerMail,
  fetchServerMail,
  sendMail,
  approveMail,
  editMailPlayer,
  changeReceiver
} from '../modules/Module'

import Filter from './Filter'
import List from './List'
import BatchMailsIndex from './batchmails/index/components/Index'

const TabPane = Tabs.TabPane
const TabPaneContent = (props) => {
  return (
    <Fragment>
      <Filter
        options={props.options}
        initials={props.initials}
        mailType={props.mailType}
        onSearch={props.onSearch}
        onCreate={props.onCreate}
      />
      <List
        options={props.options}
        initials={props.initials}
        mailType={props.mailType}
        onUpdate={props.onUpdate}
        onCreate={props.onCreate}
        onFetch={props.onFetch}
        onPass={props.onPass}
        onSend={props.onSend}
        changeReceiver={props.changeReceiver}
      />
    </Fragment>
  )
}
TabPaneContent.propTypes = {
  options: PropTypes.object,
  initials: PropTypes.object,
  mailType: PropTypes.string,
  onSearch: PropTypes.func,
  onCreate: PropTypes.func,
  onUpdate: PropTypes.func,
  onFetch: PropTypes.func,
  onPass: PropTypes.func,
  onSend: PropTypes.func,
  changeReceiver: PropTypes.func
}

const mapDispatchtoProps = {
  fetchPersonMails,
  createPersonMail,
  updatePersonMail,
  fetchPersonMail,
  fetchAllianceMails,
  createAllianceMail,
  fetchAllianceMail,
  updateAllianceMail,
  fetchServerMails,
  createServerMail,
  fetchServerMail,
  updateServerMail,
  sendMail,
  approveMail,
  editMailPlayer,
  fetchProductsMap,
  fetchGoodsMap,
  changeReceiver
}

const mapStateToProps = (state) => ({
  login: state.islogin,
  mail: state.mail,
  products: state.products.options,
  goods: state.goods.options,
})

@connect(mapStateToProps, mapDispatchtoProps)
export default class Index extends Component {

  state = {
    fields: {
      products: {
        value: []
      },
      nickName: {
        value: ''
      },
      allianceName: {
        value: ''
      },
      dates: {
        value: []
      },
      mailStatus: {
        value: ''
      },
    },
    initials: {
      params: {},
      conf: {
        itemTypes: { item: 0, skill: 4, soldier: 5 },
        passState: { pass: '通过', deny: '拒绝' },
        mailStatus: { pass: 4, deny: 5 }
      },
      map: {
        mailStatus: { 0: '未发送', 1: '发送成功', 2: '发送失败', 3: '审核中', 4: '审核通过', 5: '审核未通过' }
      },
      enum: {
        mailStatus: [
          { value: '0', label: '未发送' },
          { value: '1', label: '发送成功' },
          { value: '2', label: '发送失败' },
          { value: '3', label: '审核中' },
          { value: '4', label: '审核通过' },
          { value: '5', label: '审核未通过' }
        ]
      }
    }
  }

  componentWillMount() {
    this.props.fetchProductsMap()
  }

  onSearch = (values) => {
    if (values.handle === 'PERSONAL') {
      this.props.fetchPersonMails(values)
    } else if (values.handle === 'ALLIANCE') {
      this.props.fetchAllianceMails(values)
    } else if (values.handle === 'SERVERS') {
      this.props.fetchServerMails(values)
    }
    this.props.fetchGoodsMap({ productId: values.params.productId || '_' })
  }

  onCreate = (values) => {
    if (values.handle === 'PERSONAL') {
      this.props.createPersonMail(values)
    } else if (values.handle === 'ALLIANCE') {
      this.props.createAllianceMail(values)
    } else if (values.handle === 'SERVERS') {
      this.props.createServerMail(values)
    }
  }

  onUpdate = (values) => {
    if (values.handle === 'PERSONAL') {
      this.props.updatePersonMail(values)
    } else if (values.handle === 'ALLIANCE') {
      this.props.updateAllianceMail(values)
    } else if (values.handle === 'SERVERS') {
      this.props.updateServerMail(values)
    }
  }

  onFetch = (values) => {
    if (values.handle === 'PERSONAL') {
      this.props.fetchPersonMail(values)
    } else if (values.handle === 'ALLIANCE') {
      this.props.fetchAllianceMail(values)
    } else if (values.handle === 'SERVERS') {
      this.props.fetchServerMail(values)
    }
  }

  onPass = (values) => {
    this.props.approveMail(values)
  }

  onSend = (values) => {
    this.props.sendMail(values)
  }

  render() {
    const { login, mail, products, goods } = this.props
    let options = {
      login,
      mail,
      products,
      goods,
    }
    let initials = this.state.initials

    return (
      <Fragment>
        <Tabs>
          {
            login.authRoutes.includes('mails-personal') &&
            <TabPane tab={<span><Icon type='user' />个人邮件列表</span>} key='personal'>
              <TabPaneContent
                options={options}
                initials={initials}
                onSearch={this.onSearch}
                onCreate={this.onCreate}
                onUpdate={this.onUpdate}
                onFetch={this.onFetch}
                onPass={this.onPass}
                onSend={this.onSend}
                changeReceiver={this.props.changeReceiver}
                mailType='personal'
              />
            </TabPane>
          }
          {
            login.authRoutes.includes('mails-alliance') &&
            <TabPane tab={<span><Icon type='team' />联盟邮件列表</span>} key='alliance'>
              <TabPaneContent
                options={options}
                initials={initials}
                onSearch={this.onSearch}
                onCreate={this.onCreate}
                onUpdate={this.onUpdate}
                onFetch={this.onFetch}
                onPass={this.onPass}
                onSend={this.onSend}
                changeReceiver={this.props.changeReceiver}
                mailType='alliance'
              />
            </TabPane>
          }
          {
            login.authRoutes.includes('mails-servers') &&
            <TabPane tab={<span><Icon type='bars' />全服邮件列表</span>} key='servers'>
              <TabPaneContent
                options={options}
                initials={initials}
                onSearch={this.onSearch}
                onCreate={this.onCreate}
                onUpdate={this.onUpdate}
                onFetch={this.onFetch}
                onPass={this.onPass}
                onSend={this.onSend}
                mailType='servers'
              />
            </TabPane>
          }
          {
            login.authRoutes.includes('mails-servers') &&
            <TabPane tab={<span><Icon type='bars' />批量发邮件</span>} key='batch'>
              <BatchMailsIndex />
            </TabPane>
          }
        </Tabs>
      </Fragment>
    )
  }

}

Index.propTypes = {
  login: PropTypes.object,
  mail: PropTypes.object,
  goods: PropTypes.object,
  products: PropTypes.object,
  fetchPersonMails: PropTypes.func,
  createPersonMail: PropTypes.func,
  updatePersonMail: PropTypes.func,
  fetchPersonMail: PropTypes.func,
  sendMail: PropTypes.func,
  approveMail: PropTypes.func,
  fetchAllianceMails: PropTypes.func,
  createAllianceMail: PropTypes.func,
  fetchAllianceMail: PropTypes.func,
  updateAllianceMail: PropTypes.func,
  fetchServerMails: PropTypes.func,
  createServerMail: PropTypes.func,
  fetchServerMail: PropTypes.func,
  updateServerMail: PropTypes.func,
  fetchProductsMap: PropTypes.func,
  fetchGoodsMap: PropTypes.func,
  changeReceiver: PropTypes.func
}
