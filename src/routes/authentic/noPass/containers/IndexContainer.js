import { connect } from 'react-redux'
import {
  fetchAuthentics,
  addAuthentic,
  delAuthentic
} from '../modules/Module'
import { fetchProductsMap } from '../../../../base/modules/Products'
import Index from '../components/Index'

const mapDispatchtoProps = {
  fetchAuthentics,
  addAuthentic,
  delAuthentic,
  fetchProductsMap
}

const mapStateToProps = (state) => ({
  noPass: state.noPass,
  login: state.islogin,
  products: state.products
})

export default connect(mapStateToProps, mapDispatchtoProps)(Index)
