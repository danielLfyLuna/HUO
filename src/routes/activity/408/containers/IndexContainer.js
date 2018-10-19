import { connect } from 'react-redux'
import {
  updateActivity,
  fetchConfigure
} from '../../activities/modules/Module'
import { fetchProductsMap } from '../../../../base/modules/Products'
import { itemsActionCreator } from '../../../../base/modules/Items'
import Update from '../components/Update'

const mapDispatchtoProps = {
  updateActivity,
  fetchConfigure,
  fetchProductsMap,
  itemsActionCreator
}

const mapStateToProps = (state) => ({
  activities: state.activities,
  products: state.products,
  items: state.items.data,
  login: state.islogin
})

export default connect(mapStateToProps, mapDispatchtoProps)(Update)
