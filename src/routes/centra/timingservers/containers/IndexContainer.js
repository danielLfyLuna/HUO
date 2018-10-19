import { connect } from 'react-redux'
import { fetchServers, createServers, deleteServers } from '../modules/Module'
import Index from '../components/Index'

import { fetchProductsMap } from '../../../../base/modules/Products'

const mapDispatchtoProps = {
  fetchServers,
  createServers,
  deleteServers,
  fetchProductsMap
}

const mapStateToProps = (state) => ({
  products: state.products,
  timingservers: state.timingServers,
  login: state.islogin
})

export default connect(mapStateToProps, mapDispatchtoProps)(Index)
