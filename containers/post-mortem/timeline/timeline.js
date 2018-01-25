import React from 'react'
import TimelineGeneric from './timeline-generic'

import {
  connect
} from 'react-redux'

function mapStateToProps (state, ownProps) {
  return {
  }
}

function mapDispatchToProps (dispatch) {
  return {
  }
}

class PostMortemSummary extends React.Component {
  render () {
    return (
      <div>
        <h1>Timeline here...</h1>
        <TimelineGeneric />
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(PostMortemSummary)
