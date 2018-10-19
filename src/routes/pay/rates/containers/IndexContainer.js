import { connect } from 'react-redux'
import { fetchRates, createRate, deleteRate, keepRecharge } from '../../index/modules/Module'
import Page from '../components/Page'

import { fetchProductsMap } from '../../../../../modules/products'

const mapDispatchtoProps = {
  fetchRates,
  createRate,
  deleteRate,
  keepRecharge,
  fetchProductsMap
}

const mapStateToProps = (state) => ({
  recharge: state.recharge,
  products: state.products,
  login: {
    manager: state.islogin.admin.data,
    resolved: state.islogin.resolved
  }
})

export default connect(mapStateToProps, mapDispatchtoProps)(Page)
