import { connect } from 'react-redux'
import { clearMerge, fetchMerge, addMerge, updateMerge } from '../modules/Module'
import { fetchProductsMap } from '../../../../base/modules/Products'
import { fetchProductsCellMap } from '../../../../base/modules/ProductsCell'
import Index from '../components/Index'

const mapDispatchtoProps = {
  fetchProductsMap,
  fetchProductsCellMap,
  clearMerge,
  fetchMerge,
  addMerge,
  updateMerge
}

const mapStateToProps = (state) => ({
  merge: state.merge,
  products: state.products,
  productsCell: state.productsCell,
  login: state.islogin
})

export default connect(mapStateToProps, mapDispatchtoProps)(Index)
