import { connect } from 'react-redux'
import { fetchAllRewadItemList, editBlackRewardItem, handleSyncItem } from '../../../../base/modules/Items'
import { fetchProductsMap } from '../../../../base/modules/Products'

import Index from './../components/Index'

const mapDispatchtoProps = {
  fetchProductsMap,
  fetchAllRewadItemList,
  editBlackRewardItem,
  handleSyncItem
}

const mapStateToProps = (state) => ({
  login: state.islogin,
  products: state.products,
  items: state.items
})

export default connect(mapStateToProps, mapDispatchtoProps)(Index)
