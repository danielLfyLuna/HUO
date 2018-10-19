import { connect } from 'react-redux'
import { fetchProductsMap } from '../../../../base/modules/Products'
import { fetchNoticesUpdate, keepUpdate } from './../modules/Module'
import { fetchGoodsMap } from '../../../../base/modules/Goods'
import Index from './../components/Index'

const mapDispatchtoProps = {
  fetchNoticesUpdate,
  fetchProductsMap,
  fetchGoodsMap,
  keepUpdate
}

const mapStateToProps = (state) => ({
  login: state.islogin,
  notice: state.updateNotice,
  products: state.products,
  goods: state.goods
})

export default connect(mapStateToProps, mapDispatchtoProps)(Index)
