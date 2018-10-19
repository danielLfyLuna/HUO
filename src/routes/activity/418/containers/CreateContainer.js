import { connect } from 'react-redux'
import {
  newCreateActivity,
  clearTemplateCreate
} from '../../index/modules/Module'
import { fetchProductsMap } from '../../../../../../modules/products'
import { fetchGoodsMap } from '../../../../../../modules/goods'
import Create from '../components/Create'

const mapDispatchtoProps = {
  newCreateActivity,
  clearTemplateCreate,
  fetchProductsMap,
  fetchGoodsMap
}

const mapStateToProps = (state) => ({
  activities: state.activities,
  products: state.products,
  goods: state.goods,
  login: state.islogin
})

export default connect(mapStateToProps, mapDispatchtoProps)(Create)
