import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'
import { Table, Modal, Icon } from 'antd'
// import { Link } from 'react-router'
// import _ from 'lodash'

import DropOption from '../../../../base/components/DropOption'
// import { info } from './modal'
import Info from './modal'
const activityStates = {
  0: '初始化',
  1: '预热，玩家可见，还未开始',
  2: '开启，正在进行',
  3: '活动结束，等待处理结果',
  4: '结果处理完毕',
  5: '运营人员强制下线'
}

export default class List extends Component {

  constructor(props) {
    super(props)
    this.columns = [
      {
        title: '类型',
        dataIndex: 'functionId'
      }, {
        title: '名称',
        dataIndex: 'name'
      }, {
        title: '模板 ID',
        dataIndex: 'templateId'
      }, {
        title: ' 开启时间',
        dataIndex: 'startTime'
      }, {
        title: '结束时间',
        dataIndex: 'endTime'
      }, {
        title: '更新时间',
        dataIndex: 'updateTime'
      }, {
        title: '操作人',
        dataIndex: 'adminUserName'
      }, {
        title: '状态',
        dataIndex: 'state',
        render: (text, record) => {
          return activityStates[record.state]
        }
      }, {
        title: '操作',
        dataIndex: 'action',
        render: (text, record) => {
          // const { options, initials } = this.props.dataFlow
          // const pathname = `/sango2/activity/activities/${record.functionId}`
          // const query = { ...initials.paths, templateId: record.templateId }
          // let copyCheck = _.includes(_.map(this.props.initials.enum.functionIds, 'value'), record.functionId)
          let menuOptions = []
          let optionName = ''
          let records = {...record}
          if (record.state === 2) {
            records = {...records, switchKey: 0}
            optionName = '活动下线'
          }
          if (record.state === 5) {
            records = {...records, switchKey: 1}
            optionName = '活动开启'
          }
          const { authRoutes } = this.props.dataFlow.options.login
          authRoutes.includes('pay-recharge') &&
            menuOptions.push({key: 'DETAIL', name: '活动详情'})
          authRoutes.includes('pay-recharge') &&
            menuOptions.push({key: 'SWITCH', name: optionName})

          return (
            <DropOption
              onMenuClick={e => this.handleMenuClick(records, e)}
              menuOptions={menuOptions}
              dropdownProps={{
                trigger: ['hover']
              }}
            />
          )
        }
      }
    ]

    this.state = {
      data: {
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

  componentWillReceiveProps(nextProps) {
    const activities = nextProps.dataFlow.options.activity.activities
    let dataSource = []
    activities.list.map((elem, index) => {
      dataSource.push({key: index, ...elem})
    })
    this.setState({
      data: {
        dataSource: [...dataSource],
        count: dataSource.length
      }
    })
  }

  handleMenuClick = (records, e) => {
    if (e.key === 'DETAIL') {
      this.onDetailAction({
        currentItem: { ...records },
        modalType: e.key.toLowerCase()
      })
    } else if (e.key === 'SWITCH') {
      this.onSwitchAction(records)
    }
  }

  onDetailAction = (fields) => {
    this.setState({
      modal: {
        ...fields,
        modalTitle: '活动详情',
        visible: true
      }
    })
    // info(fields.currentItem, this.props.goods)
  }

  handleCancel = () => {
    this.setState({
      modal: {
        ...this.state.modal,
        visible: false
      }
    })
  }

  onSwitchAction = (fields) => {
    const initials = this.props.dataFlow.initials
    Modal.confirm({
      title: `活动 ${fields.switchKey ? '开启' : '下线'}`,
      content: (
        <Fragment>
          <p><Icon type='question-circle' /> 您确定要 {fields.switchKey ? '开启' : '下线'} 下列活动吗？</p>
          <p><em>活动：{fields.templateId}</em></p>
        </Fragment>
      ),
      okText: '确认',
      cancelText: '取消',
      onOk: () => {
        this.props.onSwitch({
          path: { ...fields, ...initials.paths }
        })
      }
    })
  }

  render() {
    const paths = this.props.dataFlow.initials.paths

    const defaultLocale = {
      emptyText: paths.productId ? `${paths.productId}/${paths.serverId}: 暂未查到数据` : '未作查询，暂无数据'
    }
    const pagination = {
      showSizeChanger: true,
      defaultPageSize: 200,
      pageSizeOptions: ['20', '50', '100', '200', '500'],
      total: this.state.count,
      showTotal: (total, range) => `第 ${range[0]}-${range[1]} 条 / 共 ${total} 条`
    }

    return (
      <Fragment>
        <Table
          bordered
          dataSource={this.state.data.dataSource}
          columns={this.columns}
          rowKey='templateId'
          locale={defaultLocale}
          pagination={pagination}
        />
        <Modal
          width={1000}
          key='details'
          visible={this.state.modal.visible}
          onCancel={this.handleCancel}
          footer={null}
          maskClosable={false}
          destroyOnClose
        >
          <Info
            goods={this.props.goods}
            data={this.state.modal.currentItem}
          />
        </Modal>
      </Fragment>
    )
  }
}

List.propTypes = {
  dataFlow: PropTypes.object,
  goods: PropTypes.object,
  onSwitch: PropTypes.func
}
