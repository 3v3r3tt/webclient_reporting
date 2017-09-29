import React from 'react'
import { connect } from 'react-redux'
import MainWrapper from '../main-wrapper'
import { bindActions } from 'reporting/actions'
import check from 'util/check'

function provisionedSession (props) {
  return check.feature('reportingv2')
    .then(hasFeature => {
      const isAuthenticated = props.state.auth.config.size > 0
      if (hasFeature && isAuthenticated) {
        return true
      } else {
        window.location = '/' // go home
        return false
      }
    })
}

function App (props) {
  if (provisionedSession(props)) {
    return (
      <MainWrapper
        actions={props.actions}
        location={props.location}
        state={props.state}>
        { props.children }
      </MainWrapper>
    )
  } else {
    return null
  }
}

export default connect(
  function mapStateToProps (state) { return {state} },
  function mapDispatchToProps (dispatch) { return { actions: bindActions(dispatch) } }
)(App)
