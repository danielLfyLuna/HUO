import { connect } from 'react-redux'

import { produceSources } from './../modules/Module'
import { itemsActionCreator } from '../../../../base/modules/Items'
import { fetchGoodsMap } from '../../../../base/modules/Goods'
import Modal from './../components/Modal'

const mapDispatchtoProps = {
  produceSources,
  itemsActionCreator,
  fetchGoodsMap
}

const mapStateToProps = (state) => ({
  login: state.islogin,
  produce: state.produce,
  item: state.goods
})

export default connect(mapStateToProps, mapDispatchtoProps)(Modal)
