import { connect } from 'react-redux'

import { consumeSources } from './../modules/Module'
import Modal from './../components/Modal'
import { itemsActionCreator } from '../../../../base/modules/Items'
import { fetchGoodsMap } from '../../../../base/modules/Goods'

const mapDispatchtoProps = {
  consumeSources,
  itemsActionCreator,
  fetchGoodsMap
}

const mapStateToProps = (state) => ({
  login: state.islogin,
  consume: state.consume,
  item: state.goods
})

export default connect(mapStateToProps, mapDispatchtoProps)(Modal)
