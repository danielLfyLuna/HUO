import React, {Component} from 'react'
import PropTypes from 'prop-types'
import { Tabs, Icon } from 'antd'
// import _ from 'lodash'
import LogsConfig from './logLevel/List'
import Filter from './logConfig/Filter'
import List from './logConfig/List'

const TabPane = Tabs.TabPane


export default class Index extends Component {

  static propTypes = {
    login: PropTypes.object.isRequired,
    products: PropTypes.object,
    playerLogs: PropTypes.object.isRequired,
    fetchLogsConfig: PropTypes.func.isRequired,
    clearLogsConfig: PropTypes.func.isRequired,
    updateLogsModule: PropTypes.func.isRequired,
    fetchDumpLogs: PropTypes.func.isRequired,
    fetchPullLogs: PropTypes.func.isRequired,
    fetchLogs: PropTypes.func.isRequired,
    clearLogs: PropTypes.func.isRequired,
    fetchProductsMap: PropTypes.func
  }

  onSearch = (fieldsValue) => {
    this.props.fetchLogsConfig(fieldsValue)
  }

  onUpdate = (fieldsValue) => {
    this.props.updateLogsModule(fieldsValue)
  }

  onDump = (fieldsValue) => {
    this.props.fetchDumpLogs(fieldsValue)
  }

  onPull = (fieldsValue) => {
    this.props.fetchPullLogs(fieldsValue)
  }

  onGet = (fieldsValue) => {
    this.props.fetchLogs(fieldsValue)
  }

  componentWillMount() {
    this.props.fetchProductsMap()
  }

  render() {
    const {login: {curd}} = this.props

    let options = []
    if (this.props.products.options) {
      options = this.props.products.options
    }

    return (
      <div>
        <Tabs defaultActiveKey='level' type='card'>
          <TabPane tab={<div><Icon type='tool' />按模块设置log等级</div>} key='level'>
            <LogsConfig
              curd={curd}
              options={options}
              onSearch={this.onSearch}
              onUpdate={this.onUpdate}
              data={this.props.playerLogs.logsConfig}
              iniVisit={this.props.playerLogs.visit}
              clearLogsConfig={this.props.clearLogsConfig}
            />
          </TabPane>
          <TabPane tab={<div><Icon type='sync' />实时客户端日志拉取</div>} key='pull'>
            <Filter
              curd={curd}
              options={options}
              onDump={this.onDump}
              onPull={this.onPull}
              onGet={this.onGet}
            />
            <List
              data={this.props.playerLogs.logs}
              loading={this.props.playerLogs.loading}
              clearLogs={this.props.clearLogs}
            />
          </TabPane>
        </Tabs>
      </div>
    )
  }

}
