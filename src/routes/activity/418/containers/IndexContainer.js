import { connect } from 'react-redux'
import {
  updateActivity,
  fetchConfigure
} from '../../index/modules/Module'
import { fetchProductsMap } from '../../../../../../modules/products'
import { fetchGoodsMap } from '../../../../../../modules/goods'
import Update from '../components/Update'

const mapDispatchtoProps = {
  updateActivity,
  fetchConfigure,
  fetchProductsMap,
  fetchGoodsMap
}

const mapStateToProps = (state) => ({
  activities: state.activities,
  products: state.products,
  goods: state.goods,
  login: state.islogin
})

export default connect(mapStateToProps, mapDispatchtoProps)(Update)
