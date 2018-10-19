import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'
import { Table, Tabs, Icon } from 'antd'

const TabPane = Tabs.TabPane

export default class BackList extends Component {

  constructor(props) {
    super(props)
    this.type = { 2: '武将', 1: '玩家' }
    this.columns = {
      equipage: [
        { title: '技能名称', dataIndex: 'skillTemplateName' },
        { title: '技能ID', dataIndex: 'skillTemplateId' },
        { title: '等级', dataIndex: 'level' },
        { title: '技能槽', dataIndex: 'pos' },
        { title: '角色名称', dataIndex: 'name' },
        { title: '角色ID', dataIndex: 'roleId' },
        { title: '穿戴对象',
          dataIndex: 'type',
          render: (text, record) => {
            return this.type[text]
          }
        }
      ],
      backpack: [
        { title: '技能名称', dataIndex: 'skillTemplateName' },
        { title: '技能ID', dataIndex: 'skillTemplateId' },
        { title: '等级', dataIndex: 'level' },
        { title: '数量', dataIndex: 'count' },
        {
          title: '是否锁定',
          dataIndex: 'lock',
          render: (text, record) => text ? '锁定' : '未锁定'
        },
        { title: '角色ID', dataIndex: 'roleId' },
        {
          title: '是否最新',
          dataIndex: 'new',
          render: (text, record) => text ? '是' : '否'
        }
      ]
    }

    this.state = {
      equipage: {
        dataSource: [],
        count: 0
      },
      backpack: {
        dataSource: [],
        count: 0
      },
      modal: {
        currentItem: {},
        modalType: '',
        modalTitle: '',
        visible: false,
      }
    }
  }

  componentWillReceiveProps(nextProps, nextState) {
    const equipage = nextProps.options.equipage
    let equiped = []
    let backpack = []
    equipage.skills.map((elem, index) => {
      elem.equiped
      ? equiped.push({key: index, ...elem})
      : backpack.push({key: index, ...elem})
    })
    this.setState({
      equipage: {
        dataSource: [...equiped],
        count: equiped.length
      },
      backpack: {
        dataSource: [...backpack],
        count: backpack.length
      }
    })
  }


  render() {
    const { options } = this.props
    if (false) {
      console.log(options)
    }
    const { params, products } = this.props.initials

    let arrParam = []
    products.productId && arrParam.push(`产品/服务器：${products.productId}/${products.serverId}`)
    params.nickname && arrParam.push(`昵称：${params.nickname}`)
    params.playerId && arrParam.push(`玩家 ID：${params.playerId}`)

    const defaultLocale = {
      emptyText: arrParam.length ? `查询：{ ${arrParam.join('，')} }，暂未查到数据` : '未作查询，暂无数据'
    }
    const pagination = {
      showSizeChanger: true,
      defaultPageSize: 50,
      pageSizeOptions: ['20', '50', '100', '200', '500']
    }

    return (
      <Fragment>
        <Tabs>
          <TabPane tab={<span><Icon type='bars' />已装备</span>} key='equipage'>
            <Table
              bordered
              dataSource={this.state.equipage.dataSource}
              columns={this.columns.equipage}
              locale={defaultLocale}
              rowKey='skillTemplateId'
              pagination={{
                ...pagination,
                total: this.state.equipage.count
              }}
            />
          </TabPane>
          <TabPane tab={<span><Icon type='bars' />未装备</span>} key='backpack'>
            <Table
              bordered
              dataSource={this.state.backpack.dataSource}
              columns={this.columns.backpack}
              locale={defaultLocale}
              rowKey='skillTemplateId'
              pagination={{
                ...pagination,
                total: this.state.backpack.count
              }}
            />
          </TabPane>
        </Tabs>
      </Fragment>
    )
  }

}

BackList.propTypes = {
  options: PropTypes.object,
  initials: PropTypes.object,
  // params: PropTypes.object,
  // onSearch: PropTypes.func
}
