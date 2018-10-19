import { connect } from 'react-redux'
import { fetchChannels } from './../modules/ChannelModules'
import Index from './../components/Index'

const mapDispatchtoProps = {
  fetchChannels
}

const mapStateToProps = (state) => ({
  login: state.islogin,
  channel: state.channel
})

export default connect(mapStateToProps, mapDispatchtoProps)(Index)
