import { connect } from 'react-redux'
import { keepInitial, fetchDatachange, exportDatachange, datachangeSources, clearDatachange } from './../modules/Module'

import { itemsActionCreator } from '../../../../base/modules/Items'
import { fetchGoodsMap } from '../../../../base/modules/Goods'
import { fetchProductsMap } from '../../../../base/modules/Products'
import Index from './../components/Index'


const mapDispatchtoProps = {
  clearDatachange,
  fetchDatachange,
  exportDatachange,
  datachangeSources,
  itemsActionCreator,
  fetchGoodsMap,
  keepInitial,
  fetchProductsMap
}

const mapStateToProps = (state) => ({
  login: state.islogin,
  datachange: state.datachange,
  item: state.goods,
  products: state.products
})

export default connect(mapStateToProps, mapDispatchtoProps)(Index)
