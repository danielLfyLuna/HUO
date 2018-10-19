import { connect } from 'react-redux'

import { fetchBatchmailPlayer, clearBatchmailPlayer, sendBatchmailPlayers, sendSingleBatchmailPlayer } from '../modules/PlayerModule'
import Search from '../components/Search'
import { fetchProductsMap } from '../../../../../../../base/modules/Products'
import { fetchGoodsMap } from '../../../../../../../base/modules/Goods'


const mapDispatchtoProps = {
  fetchProductsMap,
  fetchGoodsMap,
  fetchBatchmailPlayer,
  clearBatchmailPlayer,
  sendBatchmailPlayers,
  sendSingleBatchmailPlayer

}

const mapStateToProps = (state) => ({
  login: state.islogin,
  batchmailPlayer: state.batchmailPlayer,
  products: state.products,
  goods: state.goods
})

export default connect(mapStateToProps, mapDispatchtoProps)(Search)
