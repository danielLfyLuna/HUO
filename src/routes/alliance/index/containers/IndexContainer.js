import { connect } from 'react-redux'
import {
  fetchAlliances,
  allianceExport,
  keepAlliance
} from '../modules/Module'
import Index from '../components/Index'

import { fetchProductsMap } from '../../../../base/modules/Products'

const mapDispatchtoProps = {
  fetchAlliances,
  allianceExport,
  keepAlliance,
  fetchProductsMap
}

const mapStateToProps = (state) => ({
  alliance: state.alliance,
  products: state.products,
  login: state.islogin
})

export default connect(mapStateToProps, mapDispatchtoProps)(Index)
