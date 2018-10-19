import { connect } from 'react-redux'

import {
  fetchPurchases,
  fetchPurchaseSync,
  fetchProducts
} from '../../../../base/modules/Purchase'

import {
  fetchBatchPlayers,
  clearPlayerLogs,
  keepWelfare
} from '../modules/Module'
import Index from '../components/Index'

const mapDispatchtoProps = {
  fetchBatchPlayers,
  clearPlayerLogs,
  keepWelfare,
  fetchPurchases,
  fetchPurchaseSync,
  fetchProducts
}

const mapStateToProps = (state) => ({
  welfare: state.welfare,
  globals: state.purchases,
  login: state.islogin
})

export default connect(mapStateToProps, mapDispatchtoProps)(Index)
