import { connect } from 'react-redux'
import { fetchProductsMap } from '../../../../base/modules/Products'
import {
  fetchMergeNotice,
  clearNotice
} from './../modules/Module'
import Index from './../components/Index'


const mapDispatchtoProps = {
  fetchMergeNotice,
  clearNotice,
  fetchProductsMap
}

const mapStateToProps = (state) => ({
  login: state.islogin,
  mergeNotice: state.mergeNotice,
  products: state.products
})

export default connect(mapStateToProps, mapDispatchtoProps)(Index)
