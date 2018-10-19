import { connect } from 'react-redux'
import { fetchLogConsumes, exportLogConsumes, clearLogConsumes, consumeSources, keepInitial } from './../modules/Module'

import { itemsActionCreator } from '../../../../base/modules/Items'
import { fetchGoodsMap } from '../../../../base/modules/Goods'
import { fetchProductsMap } from '../../../../base/modules/Products'
import Index from './../components/Index'

const mapDispatchtoProps = {
  fetchLogConsumes,
  itemsActionCreator,
  fetchGoodsMap,
  clearLogConsumes,
  exportLogConsumes,
  consumeSources,
  keepInitial,
  fetchProductsMap
}

const mapStateToProps = (state) => ({
  login: state.islogin,
  consume: state.consume,
  item: state.goods,
  products: state.products
})

export default connect(mapStateToProps, mapDispatchtoProps)(Index)
