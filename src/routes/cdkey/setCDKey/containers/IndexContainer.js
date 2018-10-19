import React from 'react'
import { connect } from 'react-redux'
import {
  fetchCD,
  setCD
} from './../modules/Module'
import Index from './../components/Index'


const mapDispatchtoProps = {
  fetchCD,
  setCD
}

const mapStateToProps = (state) => ({
  login: state.islogin,
  setCDKey: state.setCDKey
})

const Containers = connect(mapStateToProps, mapDispatchtoProps)(Index)
export default function (props) {
  return (<Containers {...props} key={Math.random()} />)
}
