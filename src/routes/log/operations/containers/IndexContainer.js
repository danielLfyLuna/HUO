import { connect } from 'react-redux'

import { fetchProductsMap } from '../../../../base/modules/Products'
import { keepInitial, fetchLogOperations, operationSources, exportLogOperations, clearLogOperations } from './../modules/Module'
import Index from './../components/Index'

const mapDispatchtoProps = {
  fetchLogOperations,
  exportLogOperations,
  operationSources,
  clearLogOperations,
  keepInitial,
  fetchProductsMap
}

const mapStateToProps = (state) => ({
  login: state.islogin,
  operation: state.operation,
  products: state.products
})

export default connect(mapStateToProps, mapDispatchtoProps)(Index)
