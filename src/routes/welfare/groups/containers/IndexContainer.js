import { connect } from 'react-redux'

import {
  fetchPurchases,
  fetchPurchaseSync,
  fetchProducts
} from '../../../../base/modules/Purchase'
import {
  fetchGroups,
  createGroup,
  updateGroup,
  keepWelfare
} from '../modules/Module'
import Index from '../components/Index'

const mapDispatchtoProps = {
  fetchGroups,
  createGroup,
  updateGroup,
  keepWelfare,
  fetchPurchases,
  fetchPurchaseSync,
  fetchProducts
}

const mapStateToProps = (state) => ({
  welfare: state.welfare,
  globals: state.globals,
  login: state.islogin
})

export default connect(mapStateToProps, mapDispatchtoProps)(Index)
