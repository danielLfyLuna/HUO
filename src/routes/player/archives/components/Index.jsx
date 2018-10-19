import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { Tabs, Icon } from 'antd'

import { fetchGlobalProducts } from '../../../../base/modules/Global'
import {
  fetchImages,
  fetchImage,
  fetchNicknames,
} from '../modules/Module'

const TabPane = Tabs.TabPane
const TabPaneContent = (props) => {
  const List = require(`./${props.dataType}/List`).default
  const Filter = require(`./${props.dataType}/Filter`).default
  return (
    <Fragment>
      <Filter
        dataFlow={props.dataFlow}
        {...props.fields}
        dataType={props.dataType}
        onChange={props.onChange}
        onSearch={props.onSearch}
      />
      <List
        dataFlow={props.dataFlow}
        dataType={props.dataType}
      />
    </Fragment>
  )
}
TabPaneContent.propTypes = {
  fields: PropTypes.object,
  dataFlow: PropTypes.object,
  dataType: PropTypes.string,
  onChange: PropTypes.func,
  onSearch: PropTypes.func,
}

const mapDispatchtoProps = {
  fetchImages,
  fetchImage,
  fetchNicknames,
  fetchGlobalProducts
}

const mapStateToProps = (state) => ({
  login: state.islogin,
  archive: state.archive,
  globals: state.globals
})

@connect(mapStateToProps, mapDispatchtoProps)
export default class Index extends Component {

  state = {
    fields: {
      products: {
        value: []
      },
      nickname: {
        value: ''
      },
      playerId: {
        value: ''
      },
    },
    initials: {
      products: {},
      params: {},
      conf: {},
      map: {},
      enum: {}
    }
  }

  componentWillMount() {
    this.props.fetchGlobalProducts()
  }

  onChange = (changedFields) => {
    this.setState({
      fields: { ...this.state.fields, ...changedFields }
    })
  }

  onSearch = (values) => {
    if (values.handle === 'IMAGES') {
      this.props.fetchImages(values)
    } else if (values.handle === 'IMAGE') {
      this.props.fetchImage(values)
    } else if (values.handle === 'NICKNAMES') {
      this.props.fetchNicknames(values)
    }
    this.setState({
      initials: {
        ...this.state.initials,
        products: values.path,
        params: values.params || {}
      }
    })
  }


  render() {
    const { login, archive, globals } = this.props
    const authRoutes = login.authRoutes
    const dataFlow = {
      options: {
        login,
        archive,
        globals,
      },
      initials: this.state.initials
    }

    return (
      <Fragment>
        <Tabs>
          {
            authRoutes.includes('fetch-headimages') &&
            <TabPane tab={<span><Icon type='user' />头像列表</span>} key='images'>
              <TabPaneContent
                dataFlow={dataFlow}
                fields={this.state.fields}
                onChange={this.onChange}
                onSearch={this.onSearch}
                dataType='images'
              />
            </TabPane>
          }
          {
            authRoutes.includes('fetch-nicknames') &&
            <TabPane tab={<span><Icon type='team' />历史昵称</span>} key='nicknames'>
              <TabPaneContent
                dataFlow={dataFlow}
                fields={this.state.fields}
                onChange={this.onChange}
                onSearch={this.onSearch}
                dataType='nicknames'
              />
            </TabPane>
          }
        </Tabs>
      </Fragment>
    )
  }

}

Index.propTypes = {
  login: PropTypes.object,
  archive: PropTypes.object,
  globals: PropTypes.object,
  fetchImages: PropTypes.func,
  fetchImage: PropTypes.func,
  fetchNicknames: PropTypes.func,
  fetchGlobalProducts: PropTypes.func,
}
