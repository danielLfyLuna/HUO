import { connect } from 'react-redux'
import { fetchGet } from './../modules/BlackListModules'
import { fetchProductsMap } from '../../../../base/modules/Products'
import BlackListPage from './../components/BlackListPage'

const mapDispatchtoProps = {
  fetchProductsMap,
  fetchGet
}

const mapStateToProps = (state) => ({
  login: state.islogin,
  blacklist: state.blacklist
})

export default connect(mapStateToProps, mapDispatchtoProps)(BlackListPage)
