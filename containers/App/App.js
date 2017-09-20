import React from 'react'
import { connect } from 'react-redux'
import MainWrapper from '../main-wrapper'
import { bindActions } from 'reporting/actions'

function App (props) {
  return (
    <MainWrapper
      actions={props.actions}
      location={props.location}
      state={props.state}>
      { props.children }
    </MainWrapper>
  )
}

export default connect(
  function mapStateToProps (state) { return {state} },
  function mapDispatchToProps (dispatch) { return { actions: bindActions(dispatch) } }
)(App)
