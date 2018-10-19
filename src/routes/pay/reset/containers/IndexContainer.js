import { connect } from 'react-redux'
import { fetchProductsMap } from '../../../../base/modules/Products'
import {
  fetchRechargeReset,
  clearReset
} from './../modules/Module'
import Index from './../components/Index'


const mapDispatchtoProps = {
  fetchRechargeReset,
  clearReset,
  fetchProductsMap
}

const mapStateToProps = (state) => ({
  login: state.islogin,
  rechargeReset: state.rechargeReset,
  products: state.products
})

export default connect(mapStateToProps, mapDispatchtoProps)(Index)
