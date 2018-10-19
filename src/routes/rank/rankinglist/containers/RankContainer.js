import { connect } from 'react-redux'

import { fetchGet } from './../modules/RankModules'
import { fetchProductsMap } from '../../../../base/modules/Products'
import Index from './../components/RanksPage'


const mapDispatchtoProps = {
  fetchGet,
  fetchProductsMap
}

const mapStateToProps = (state) => ({
  login: state.islogin,
  ranks: state.ranks,
  products: state.products
})

export default connect(mapStateToProps, mapDispatchtoProps)(Index)
