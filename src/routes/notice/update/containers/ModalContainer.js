import { connect } from 'react-redux'

import { itemsActionCreator } from '../../../../base/modules/Items'
import {
  addUpdateNotice,
  updateUpdateNotice
} from './../modules/Module'
import Modal from './../components/Modal'

const mapDispatchtoProps = {
  itemsActionCreator,
  addUpdateNotice,
  updateUpdateNotice
}

const mapStateToProps = (state) => ({
  login: state.islogin,
  item: state.items,
  notice: state.updateNotice
})

export default connect(mapStateToProps, mapDispatchtoProps)(Modal)
