import { connect } from 'react-redux'
import { fetchLogsConfig, updateLogsModule, clearLogsConfig, fetchDumpLogs, fetchPullLogs, fetchLogs, clearLogs } from './../modules/Module'
import { fetchProductsMap } from '../../../../base/modules/Products'
import Index from './../components/Index'


const mapDispatchtoProps = {
  fetchLogsConfig,
  updateLogsModule,
  clearLogsConfig,
  fetchDumpLogs,
  fetchPullLogs,
  fetchLogs,
  clearLogs,
  fetchProductsMap
}

const mapStateToProps = (state) => ({
  login: state.islogin,
  playerLogs: state.playerLogs,
  products: state.products
})

export default connect(mapStateToProps, mapDispatchtoProps)(Index)
