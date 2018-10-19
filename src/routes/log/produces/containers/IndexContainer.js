import { connect } from 'react-redux'

import { itemsActionCreator } from '../../../../base/modules/Items'
import { fetchGoodsMap } from '../../../../base/modules/Goods'
import { fetchProductsMap } from '../../../../base/modules/Products'
import { keepInitial, fetchLogProduces, exportLogProduces, clearLogProduces, produceSources } from './../modules/Module'
import Index from './../components/Index'

const mapDispatchtoProps = {
  fetchLogProduces,
  itemsActionCreator,
  exportLogProduces,
  clearLogProduces,
  produceSources,
  fetchGoodsMap,
  keepInitial,
  fetchProductsMap
}

const mapStateToProps = (state) => ({
  login: state.islogin,
  produce: state.produce,
  item: state.goods,
  products: state.products
})

export default connect(mapStateToProps, mapDispatchtoProps)(Index)
