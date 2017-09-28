import React from 'react'
import { connect } from 'react-redux'
import MainWrapper from '../main-wrapper'
import { bindActions } from 'reporting/actions'

function provisionedSession (props) {
  const state = props.state
  const isAuthenticated = state.auth.config.size > 0
  const hasRequiredFeatureFlags = !state.meta.get('isFetching', true) && state.meta.getIn(['featureFlags', 'feature:reportingv2'], false)

  if (!isAuthenticated || !hasRequiredFeatureFlags) {
    window.location = '/' // go home
    return false
  }

  return true
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
