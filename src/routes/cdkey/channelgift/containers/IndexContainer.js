import { connect } from 'react-redux'
import { fetchChannelGifts, createChannelGift, deleteChannelGift } from '../../cdkeys/modules/Module'
import Page from '../components/Page'
import { fetchProductsMap } from '../../../../base/modules/Products'

const mapDispatchtoProps = {
  fetchChannelGifts,
  createChannelGift,
  fetchProductsMap,
  deleteChannelGift
}

const mapStateToProps = (state) => ({
  login: state.islogin,
  products: state.products,
  cdkey: state.cdkey
})

export default connect(mapStateToProps, mapDispatchtoProps)(Page)
