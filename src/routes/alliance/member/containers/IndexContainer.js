import { connect } from 'react-redux'
import {
  fetchAllianceMembers
} from '../../index/modules/Module'
import { fetchProductsMap } from '../../../../base/modules/Products'
import Page from '../components/Page'

const mapDispatchtoProps = {
  fetchAllianceMembers,
  fetchProductsMap
}

const mapStateToProps = (state) => ({
  alliance: state.alliance,
  products: state.products,
  login: state.islogin
})

export default connect(mapStateToProps, mapDispatchtoProps)(Page)
