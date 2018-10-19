import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'
import { Form, Row, Col, Button } from 'antd'

class PermissionFilter extends Component {
  state = {
    select: true
  }

  handleSearch = (e) => {
    e.preventDefault()
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        this.props.onSearch({handle: 'SEARCH'})
      }
    })
  }

  render() {
    const { options } = this.props

    return (
      <Fragment>
        <Form layout='inline' onSubmit={this.handleSearch}>
          <Row gutter={10} style={{ marginBottom: 8 }}>
            {
              options.authRoutes.includes('fetch-permission') &&
              <Col className='gutter-row' span={2}>
                <Button type='primary' htmlType='submit' style={{ marginLeft: 16 }}>查询</Button>
              </Col>
            }
          </Row>
        </Form>
      </Fragment>
    )
  }
}

PermissionFilter.propTypes = {
  form: PropTypes.object,
  options: PropTypes.object,
  onSearch: PropTypes.func
}

PermissionFilter.contextTypes = {
  router: PropTypes.object
}

const Filter = Form.create()(PermissionFilter)

export default Filter
