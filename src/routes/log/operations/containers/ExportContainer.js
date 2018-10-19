import { connect } from 'react-redux'

import { operationSources } from './../modules/Module'
import Modal from './../components/Modal'

const mapDispatchtoProps = {
  operationSources
}

const mapStateToProps = (state) => ({
  login: state.islogin,
  operation: state.operation
})

export default connect(mapStateToProps, mapDispatchtoProps)(Modal)
