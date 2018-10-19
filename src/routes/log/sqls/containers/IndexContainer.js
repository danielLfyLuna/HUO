import { connect } from 'react-redux'

import { fetchProductsMap } from '../../../../base/modules/Products'
import { fetchSqls, clearSqls, addSqls, deleteSqls, updateSqls, execSqls, clearExecSqls, exportSqls, mergebeforeSqls } from './../modules/Module'
import Index from './../components/Index'

const mapDispatchtoProps = {
  fetchSqls,
  clearSqls,
  addSqls,
  deleteSqls,
  updateSqls,
  execSqls,
  clearExecSqls,
  exportSqls,
  mergebeforeSqls,
  fetchProductsMap
}

const mapStateToProps = (state) => ({
  login: state.islogin,
  sql: state.sql,
  products: state.products
})

export default connect(mapStateToProps, mapDispatchtoProps)(Index)
